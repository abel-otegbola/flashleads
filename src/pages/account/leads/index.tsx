import { useState, useContext } from "react";
import { Letter, Phone, Buildings, MapPoint, Star, AddCircle, Pen, TrashBin2 } from "@solar-icons/react";
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import type { Lead } from "../../../contexts/LeadsContextValue";
import LeadModal from "../../../components/leadModal/LeadModal";
import ApolloLeadSearch from "../../../components/apolloLeadSearch/ApolloLeadSearch";
import Button from "../../../components/button/Button";

const statusColors = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-purple-100 text-purple-700 border-purple-200",
  qualified: "bg-green-100 text-green-700 border-green-200",
  negotiating: "bg-orange-100 text-orange-700 border-orange-200",
  won: "bg-emerald-100 text-emerald-700 border-emerald-200",
  lost: "bg-gray-100 text-gray-700 border-gray-200"
};

export default function Leads() {
  const { leads, loading, addLead, updateLead, deleteLead } = useContext(LeadsContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApolloModalOpen, setIsApolloModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

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

  const handleImportApolloLeads = async (apolloLeads: Omit<Lead, 'id' | 'addedDate'>[]) => {
    console.log('🎯 handleImportApolloLeads called with', apolloLeads.length, 'leads');
    console.log('📋 First lead sample:', apolloLeads[0]);
    
    try {
      let successCount = 0;
      let failCount = 0;
      
      for (let i = 0; i < apolloLeads.length; i++) {
        const leadData = apolloLeads[i];
        console.log(`\n--- Processing lead ${i + 1}/${apolloLeads.length} ---`);
        console.log('Lead data:', leadData);
        
        try {
          console.log('🔄 Calling addLead...');
          await addLead(leadData);
          successCount++;
          console.log(`✅ Lead ${i + 1} imported successfully`);
        } catch (err) {
          failCount++;
          console.error(`❌ Failed to import lead ${i + 1}:`, err);
          console.error('Lead data that failed:', leadData);
        }
      }
      
      console.log(`\n📊 Import Summary: ${successCount} succeeded, ${failCount} failed out of ${apolloLeads.length} total`);
      
      // Show success message
      if (successCount > 0) {
        const message = failCount > 0 
          ? `Imported ${successCount} lead${successCount > 1 ? 's' : ''}. ${failCount} failed.`
          : `Successfully imported ${successCount} lead${successCount > 1 ? 's' : ''}!`;
        alert(message);
      } else {
        alert('Failed to import any leads. Check console for details.');
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
            onClick={() => setIsApolloModalOpen(true)} 
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Star size={20} />
            AI Lead Generation
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
          <p className="text-sm opacity-[0.5] mb-1">Total Leads</p>
          <p className="text-2xl font-medium">{leads.length}</p>
        </div>
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-sm opacity-[0.5] mb-1">New Leads</p>
          <p className="text-2xl font-medium">
            {leads.filter(l => l.status === "new").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-sm opacity-[0.5] mb-1">Qualified</p>
          <p className="text-2xl font-medium">
            {leads.filter(l => l.status === "qualified").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-sm opacity-[0.5] mb-1">Total Value</p>
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
              className="w-full px-4 py-2 border border-gray-200/[0.2] rounded-lg focus:outline-none focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200/[0.2] rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="negotiating">Negotiating</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200/[0.2] rounded-lg overflow-hidden md:w-full w-[90vw]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lead
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Industry
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Value
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Added
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Buildings size={14} />
                          <span>{lead.company}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm opacity-[0.5]">
                        <Letter size={14} />
                        <a href={`mailto:${lead.email}`} className="hover:text-primary">
                          {lead.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm opacity-[0.5]">
                        <Phone size={14} />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPoint size={14} />
                        <span>{lead.location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-700">{lead.industry}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[lead.status]}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-900">
                      ${lead.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-yellow-500" weight="Bold" />
                      <span className={`text-sm ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm opacity-[0.5]">
                      {new Date(lead.addedDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
        <p className="text-sm opacity-[0.5]">
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

      {/* Apollo AI Lead Search Modal */}
      <ApolloLeadSearch
        isOpen={isApolloModalOpen}
        onClose={() => setIsApolloModalOpen(false)}
        onImportLeads={handleImportApolloLeads}
      />
    </div>
  );
}
