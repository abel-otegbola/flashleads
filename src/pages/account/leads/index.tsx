import { useState, useContext } from "react";
import { Letter, Phone, Buildings, MapPoint, Star, AddCircle, Pen, TrashBin2, MagicStick, Upload, UserSpeak } from "@solar-icons/react";
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import type { Lead } from "../../../contexts/LeadsContextValue";
import LeadModal from "../../../components/leadModal/LeadModal";
import BusinessDiscovery from "../../../components/businessDiscovery/BusinessDiscovery";
import { CSVImport } from "../../../components/csvImport/CSVImport";
import Button from "../../../components/button/Button";
import LoadingIcon from "../../../assets/icons/loadingIcon";

const statusColors = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-purple-100 text-purple-700 border-purple-200",
  conversation: "bg-yellow-100 text-yellow-700 border-yellow-200",
  proposal: "bg-orange-100 text-orange-700 border-orange-200",
  closed: "bg-green-100 text-green-700 border-green-200"
};

export default function Leads() {
  const { leads, loading, addLead, updateLead, deleteLead } = useContext(LeadsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [findingEmailFor, setFindingEmailFor] = useState<string | null>(null);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddLead = async (values: Omit<Lead, 'id' | 'addedDate'>) => {
    await addLead(values);
  };

  const handleEditLead = async (values: Omit<Lead, 'id' | 'addedDate'>) => {
    if (editingLead) {
      await updateLead(editingLead.id, values);
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
    phone: string;
    location: string;
    companyWebsite: string;
    userId: string;
    industry: string;
    score?: number;
    serviceNeeds?: string[];
    value?: number;
  }

  const handleImportDiscoveredLeads = async (discoveredLeads: ImportableBusiness[]) => {
    console.log('🎯 Importing discovered businesses:', discoveredLeads.length, 'leads');
    
    try {
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < discoveredLeads.length; i++) {
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
          console.error(`❌ Failed to import lead ${i + 1}:`, err);
        }
      }
      
      console.log(`📊 Import Summary: ${successCount} succeeded, ${failCount} failed`);
      
      if (successCount > 0) {
        const message = failCount > 0 
          ? `Imported ${successCount} lead${successCount > 1 ? 's' : ''}. ${failCount} failed.`
          : `Successfully imported ${successCount} lead${successCount > 1 ? 's' : ''}!`;
        alert(message);
      }
    } catch (err) {
      console.error('❌ Critical error in import handler:', err);
      alert('Failed to import leads. Please try again.');
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
    if (!companyWebsite) {
      alert('No website available for this lead. Please add a website first.');
      return;
    }

    setFindingEmailFor(leadId);

    try {
      // Extract domain from website
      const domain = new URL(companyWebsite).hostname.replace('www.', '');

      // Call Hunter.io API through your helper
      const response = await fetch(`https://api.hunter.io/v2/domain-search?domain=${domain}&api_key=${import.meta.env.VITE_HUNTER_API_KEY}&limit=5`);
      
      if (!response.ok) {
        throw new Error('Failed to find contacts');
      }

      const data = await response.json();
      
      if (data.data && data.data.emails && data.data.emails.length > 0) {
        // Get the first email (usually the most common pattern)
        const contact = data.data.emails[0];
        const email = contact.value;
        const firstName = contact.first_name || 'Contact';
        const lastName = contact.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();

        // Update the lead with the found email and name
        const lead = leads.find(l => l.id === leadId);
        if (lead) {
          await updateLead(leadId, {
            ...lead,
            email: email,
            name: fullName || lead.name
          });
          
          alert(`✅ Found contact: ${fullName}\nEmail: ${email}`);
        }
      } else {
        alert(`No contacts found for ${companyName}. Try searching manually with Hunter.io.`);
      }
    } catch (error) {
      console.error('Error finding email:', error);
      alert('Failed to find contact. Please check your Hunter.io API key or try manually.');
    } finally {
      setFindingEmailFor(null);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center gap-12 justify-between">
        <div>
          <h1 className="text-2xl font-medium mb-2">Leads</h1>
          <p className="text-gray-600">Manage and track your potential clients</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsDiscoveryModalOpen(true)} 
            variant="secondary"
            className="flex items-center gap-2"
          >
            <MagicStick size={20} />
            Discover Businesses
          </Button>
          <Button 
            onClick={() => setIsCSVImportOpen(true)} 
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Upload size={20} />
            Import CSV
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <AddCircle size={20} />
            Add New Lead
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-[12px] opacity-[0.5] mb-1">Total Leads</p>
          <p className="text-2xl font-medium">{leads.length}</p>
        </div>
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-[12px] opacity-[0.5] mb-1">New Leads</p>
          <p className="text-2xl font-medium">
            {leads.filter(l => l.status === "new").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-[12px] opacity-[0.5] mb-1">In Conversation</p>
          <p className="text-2xl font-medium">
            {leads.filter(l => l.status === "conversation").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-[12px] opacity-[0.5] mb-1">Total Value</p>
          <p className="text-2xl font-medium">
            ${leads.reduce((sum, l) => sum + l.value, 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search leads by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-1 border border-gray-200/[0.2] rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-1 border border-gray-200/[0.2] rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="new">New Lead</option>
            <option value="contacted">Contacted</option>
            <option value="conversation">In Conversation</option>
            <option value="proposal">Proposal Sent</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/[0.2] rounded-lg overflow-hidden md:w-full w-[90vw]">
        <div className="overflow-x-auto md:text-[14px] text-[12px]">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lead
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Industry
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Added
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/[0.2]">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-white font-semibold text-[12px] flex-shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <div className="flex items-center gap-1 text-[12px] text-gray-500">
                          <Buildings size={14} />
                          <span>{lead.company}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-1">
                    <div className="space-y-[2px]">
                      <div className="flex items-center gap-2 text-[12px] opacity-[0.5]">
                        <Letter size={14} />
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`} className="hover:text-primary">
                            {lead.email}
                          </a>
                        ) : (
                          <button
                            onClick={() => handleFindEmail(lead.id, lead.companyWebsite, lead.company)}
                            disabled={findingEmailFor === lead.id}
                            className="text-blue-600 hover:text-blue-800 underline disabled:opacity-50 flex items-center gap-1"
                          >
                            {findingEmailFor === lead.id ? (
                              <>
                                <LoadingIcon />
                                Finding...
                              </>
                            ) : (
                              <>
                                <UserSpeak size={14} />
                                Find Contact
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] opacity-[0.5]">
                        <Phone size={14} />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-gray-500">
                        <MapPoint size={14} />
                        <span>{lead.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-1">
                    <span className="text-[12px] text-gray-700">{lead.industry}</span>
                  </td>
                  <td className="px-4 py-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[lead.status]}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-1">
                    <span className="text-[12px] font-semibold text-gray-900">
                      ${lead.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-1">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-yellow-500" weight="Bold" />
                      <span className={`text-[12px] ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-1">
                    <span className="text-[12px] opacity-[0.5]">
                      {new Date(lead.addedDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-4 py-1">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(lead)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit lead"
                      >
                        <Pen size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete lead"
                      >
                        <TrashBin2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {loading ? 'Loading leads...' : 'No leads found matching your criteria'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[12px] opacity-[0.5]">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
      </div>

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
