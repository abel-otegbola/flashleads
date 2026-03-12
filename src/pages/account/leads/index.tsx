import { useState, useContext } from "react";
import { AddCircle } from "@solar-icons/react";
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import { claimLead, isLeadClaimed } from "../../../helpers/leadClaims";
import { findLeadEmail } from "../../../helpers/emailFinder";
import type { Lead } from "../../../contexts/LeadsContextValue";
import LeadModal from "../../../components/leadModal/LeadModal";
import BusinessDiscovery from "../../../components/businessDiscovery/BusinessDiscovery";
import { CSVImport } from "../../../components/csvImport/CSVImport";
import Button from "../../../components/button/Button";
import { useModal } from "../../../contexts/useModal";
import SkeletonLoader from "../../../components/skeletonLoader/SkeletonLoader";
import LeadCard from "../../../components/leadCard/LeadCard";

export default function Leads() {
  const { leads, loading, addLead, updateLead, deleteLead } = useContext(LeadsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [findingEmailFor, setFindingEmailFor] = useState<string | null>(null);
  const { showModal } = useModal();

  const filteredLeads = leads;

  const handleAddLead = async (values: Omit<Lead, 'id' | 'addedDate'>) => {
    // Check if lead is already claimed by another user
    const alreadyClaimed = await isLeadClaimed(values.companyWebsite, values.email);
    
    if (alreadyClaimed) {
      const confirmed = await showModal({
        title: 'Lead Already Exists',
        message: `This company (${values.company}) has already been claimed by another user.\n\nDo you still want to add them to your leads?`,
        showCancel: true
      });
      
      if (!confirmed) return;
    }
    
    await addLead(values);
    
    // Claim the lead with user's services
    if (values.userId && (values.companyWebsite || values.email)) {
      await claimLead(
        values.companyWebsite, 
        values.email, 
        values.company, 
        values.userId,
        values.industry,
      );
    }
  };

  const handleEditLead = async (values: Omit<Lead, 'id' | 'addedDate'>) => {
    if (editingLead) {
      await updateLead(editingLead?.id, values);
      setEditingLead(null);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
    }
  };

  interface ImportableBusiness {
    name: string;
    company: string;
    email: string;
    phone: string | Record<string, never>;
    location: string;
    companyWebsite: string;
    userId: string;
    industry: string;
    score?: number;
    serviceNeeds?: string[];
    value?: number;
  }

  const handleImportDiscoveredLeads = async (discoveredLeads: ImportableBusiness[]) => {
    console.log('🎯 Importing discovered businesses:', discoveredLeads?.length, 'leads');
    
    try {
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < discoveredLeads?.length; i++) {
        const business = discoveredLeads[i];
        
        // Convert business to Lead format
        const leadData: Omit<Lead, 'id' | 'addedDate'> = {
          name: business.name,
          company: business.company,
          email: business.email,
          phone: business.phone,
          location: business.location,
          companyWebsite: business.companyWebsite,
          industry: business.industry,
          score: business.score || 75,
          serviceNeeds: business.serviceNeeds || ['Website Design', 'SEO Optimization'],
          value: business.value || 10000,
          userId: business.userId,
          status: 'new',
          notes: ''
        };
        
        try {
          await addLead(leadData);
          successCount++;
        } catch (err) {
          failCount++;
          console.error(`Failed to import lead ${i + 1}:`, err);
        }
      }
      
      console.log(`📊 Import Summary: ${successCount} succeeded, ${failCount} failed`);
      
          if (successCount > 0) {
            const message = failCount > 0 
              ? `Imported ${successCount} lead${successCount > 1 ? 's' : ''}. ${failCount} failed.`
              : `Successfully imported ${successCount} lead${successCount > 1 ? 's' : ''}!`;
            await showModal({ title: 'Import Results', message });
      }
    } catch (err) {
      console.error('Critical error in import handler:', err);
          await showModal({ title: 'Import Failed', message: 'Failed to import leads?. Please try again.', showCancel: false });
    }
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold";
    if (score >= 70) return "text-orange-600 font-medium";
    return "text-gray-600";
  };

  const handleFindEmail = async (leadId: string, companyWebsite: string, companyName: string) => {
    setFindingEmailFor(leadId);
    
    try {
      await findLeadEmail({
        leadId,
        companyWebsite,
        companyName,
        leads,
        updateLead,
        showModal
      });
    } finally {
      setFindingEmailFor(null);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-6 justify-between">
        <div>
          <h1 className="text-2xl font-medium mb-2">Bookmarked leads</h1>
          <p className="text-gray-600">Manage and track your potential clients</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <AddCircle size={20} />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="md:w-1/3 w-full">
            <input
              type="text"
              placeholder="Search leads by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200/[0.2] rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {loading && <SkeletonLoader count={5} />}

      {/* Feed Layout */}
      <div className="grid md:grid-cols-2 gap-2 space-y-4">
        {!loading && filteredLeads.map((lead) => (
          <LeadCard
            key={lead?.id}
            lead={lead}
            onFindEmail={handleFindEmail}
            isFindingEmail={findingEmailFor === lead.id}
            onEdit={openEditModal}
            onDelete={handleDeleteLead}
            getScoreColor={getScoreColor}
          />
        ))}
      </div>

      {/* Pagination placeholder */}
      {filteredLeads?.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredLeads?.length}</span> of <span className="font-semibold">{leads?.length}</span> leads
          </p>
        </div>
      )}

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingLead ? handleEditLead : handleAddLead}
        lead={editingLead}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
      />

      {/* Business Discovery Modal */}
      <BusinessDiscovery
        isOpen={isDiscoveryModalOpen}
        onClose={() => setIsDiscoveryModalOpen(false)}
        onImportLeads={handleImportDiscoveredLeads}
      />

      {/* CSV Import Modal */}
      {isCSVImportOpen && (
        <CSVImport
          onImport={handleImportDiscoveredLeads}
          onClose={() => setIsCSVImportOpen(false)}
        />
      )}
    </div>
  );
}
