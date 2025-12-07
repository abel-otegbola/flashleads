import { useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { Letter, Phone, Buildings, MapPoint, Star, AddCircle, Pen, TrashBin2, MagicStick, Upload, UserSpeak } from "@solar-icons/react";
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import { UserProfileContext } from "../../../contexts/UserProfileContextValue";
import { claimLead, isLeadClaimed } from "../../../helpers/leadClaims";
import type { Lead } from "../../../contexts/LeadsContextValue";
import LeadModal from "../../../components/leadModal/LeadModal";
import BusinessDiscovery from "../../../components/businessDiscovery/BusinessDiscovery";
import { CSVImport } from "../../../components/csvImport/CSVImport";
import Button from "../../../components/button/Button";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import { useModal } from "../../../contexts/useModal";

const statusColors = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-purple-100 text-purple-700 border-purple-200",
  conversation: "bg-yellow-100 text-yellow-700 border-yellow-200",
  proposal: "bg-orange-100 text-orange-700 border-orange-200",
  closed: "bg-green-100 text-green-700 border-green-200"
};

export default function Leads() {
  const { leads, loading, addLead, updateLead, deleteLead } = useContext(LeadsContext);
  const { profile } = useContext(UserProfileContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [findingEmailFor, setFindingEmailFor] = useState<string | null>(null);
  const { showModal } = useModal();

  const filteredLeads = leads?.filter(lead => {
    const matchesSearch = 
      lead?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead?.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead?.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead?.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
        profile?.primaryServices || []
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
          console.error(`❌ Failed to import lead ${i + 1}:`, err);
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
      console.error('❌ Critical error in import handler:', err);
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

  useEffect(() => {
    console.log(leads)
  }, [leads]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold";
    if (score >= 70) return "text-orange-600 font-medium";
    return "text-gray-600";
  };

  const handleFindEmail = async (leadId: string, companyWebsite: string, companyName: string) => {
    if (!companyWebsite) {
      await showModal({ message: 'No website available for this lead?. Please add a website first.' });
      return;
    }

    // Check if API key exists
    const apiKey = import.meta.env.VITE_HUNTER_API_KEY;
    if (!apiKey) {
      await showModal({ title: 'Hunter.io API Key Missing', message: '⚠️ Hunter.io API key not configured.\n\nAdd VITE_HUNTER_API_KEY to your .env file.\n\nGet your free API key at: https://hunter.io/api', showCancel: false });
      return;
    }

    setFindingEmailFor(leadId);

    try {
      // Extract domain from website
      let domain = companyWebsite.toLowerCase().trim();
      domain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
      domain = domain.split('/')[0].split('?')[0];

      console.log('🔍 Searching Hunter.io for domain:', domain);

      // Call Hunter.io API
      const url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(domain)}&api_key=${apiKey}&limit=5`;
      const response = await fetch(url);
      
      console.log('📡 Hunter.io response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Hunter.io error:', errorData);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Check your VITE_HUNTER_API_KEY in .env file.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. You\'ve used your monthly quota.');
        } else {
          throw new Error(errorData.errors?.[0]?.details || 'Failed to search Hunter.io');
        }
      }

      const data = await response.json();
      console.log('📊 Hunter.io data:', data);
      
      if (data.data && data.data.emails && data.data.emails.length > 0) {
        // Sort emails to prioritize personal emails (Gmail, etc.) and decision-makers
        const sortedContacts = [...data.data.emails].sort((a, b) => {
          const emailA = a.value.toLowerCase();
          const emailB = b.value.toLowerCase();
          
          // Personal email domains (Gmail, Yahoo, Outlook, etc.)
          const personalDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'me.com', 'protonmail.com'];
          const isPersonalA = personalDomains.some(domain => emailA.endsWith(domain));
          const isPersonalB = personalDomains.some(domain => emailB.endsWith(domain));
          
          // Prioritize personal emails first
          if (isPersonalA && !isPersonalB) return -1;
          if (!isPersonalA && isPersonalB) return 1;
          
          // Decision-maker keywords (CEO, founder, director, etc.)
          const decisionMakerKeywords = ['ceo', 'founder', 'co-founder', 'cto', 'coo', 'cfo', 'director', 'head', 'vp', 'president', 'owner', 'manager', 'lead'];
          const positionA = (a.position || '').toLowerCase();
          const positionB = (b.position || '').toLowerCase();
          
          const isDecisionMakerA = decisionMakerKeywords.some(keyword => positionA.includes(keyword));
          const isDecisionMakerB = decisionMakerKeywords.some(keyword => positionB.includes(keyword));
          
          // Among same email type, prioritize decision-makers
          if (isDecisionMakerA && !isDecisionMakerB) return -1;
          if (!isDecisionMakerA && isDecisionMakerB) return 1;
          
          // Seniority scoring (senior/executive = higher priority)
          const seniorityScore = (contact: { seniority?: string }) => {
            const seniority = (contact.seniority || '').toLowerCase();
            if (seniority.includes('executive') || seniority.includes('c-level')) return 3;
            if (seniority.includes('senior')) return 2;
            if (seniority.includes('manager') || seniority.includes('director')) return 1;
            return 0;
          };
          
          return seniorityScore(b) - seniorityScore(a);
        });
        
        // Get the top priority contact
        const contact = sortedContacts[0];
        const email = contact.value;
        const firstName = contact.first_name || 'Contact';
        const lastName = contact.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const position = contact.position || '';

        console.log('✅ Found contact:', fullName, email, position ? `(${position})` : '');

        // Update the lead with the found email and name
        const lead = leads?.find(l => l.id === leadId);
        if (lead) {
          // Only include defined fields to avoid Firestore errors
          const updateData: Partial<Lead> = {
            name: fullName || lead?.name,
            company: lead?.company,
            email: email,
            phone: lead?.phone,
            location: lead?.location,
            status: lead?.status,
            value: lead?.value,
            industry: lead?.industry,
            score: lead?.score,
            companyWebsite: lead?.companyWebsite,
            serviceNeeds: lead?.serviceNeeds,
            addedDate: lead?.addedDate,
            userId: lead?.userId
          };

          // Only add optional fields if they're defined
          if (lead?.notes !== undefined) {
            updateData.notes = lead?.notes;
          }
          if (lead?.websiteAudit !== undefined) {
            updateData.websiteAudit = lead?.websiteAudit;
          }

          await updateLead(leadId, updateData);
          
          const emailType = email.includes('@gmail.com') || email.includes('@yahoo.com') || email.includes('@outlook.com') || email.includes('@hotmail.com') ? '📧 Personal Email' : '🏢 Company Email';
          const positionInfo = position ? `\nPosition: ${position}` : '';
          
          await showModal({ title: 'Contact Found', message: `✅ Found contact!\n\nName: ${fullName}\nEmail: ${email}\n${emailType}${positionInfo}\n\nSearches remaining: ${data.meta.requests.searches.available - data.meta.requests.searches.used} / ${data.meta.requests.searches.available}` });
        }
      } else {
        await showModal({ title: 'No Contacts Found', message: `❌ No contacts found for ${companyName}\n\nDomain searched: ${domain}\n\nTips:\n• Company might not have public emails\n• Try finding them on LinkedIn\n• Use a different domain variant\n\nSearches remaining: ${data.meta?.requests?.searches?.available ? (data.meta.requests.searches.available - data.meta.requests.searches.used) : 'Unknown'}` });
      }
    } catch (error) {
      console.error('❌ Error finding email:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      await showModal({ title: 'Find Contact Failed', message: `❌ Failed to find contact\n\n${errorMessage}` });
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
        <div className="flex flex-wrap gap-3">
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
          <p className="text-2xl font-medium">{leads?.length}</p>
        </div>
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-[12px] opacity-[0.5] mb-1">New Leads</p>
          <p className="text-2xl font-medium">{leads?.filter(l => l.status === "new").length}</p>
        </div>
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-[12px] opacity-[0.5] mb-1">In Conversation</p>
          <p className="text-2xl font-medium">{leads?.filter(l => l.status === "conversation").length}</p>
        </div>
        <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
          <p className="text-[12px] opacity-[0.5] mb-1">Estimated Value</p>
          <p className="text-2xl font-medium">${leads?.reduce((sum, l) => sum + (l.value || 0), 0).toLocaleString()}</p>
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
      <div className="bg-white border border-gray-200/[0.2] rounded-lg overflow-x-auto md:w-full w-[90vw]">
        <div className="overflow-x-auto md:text-[14px] text-[12px] min-w-[1000px]">
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
              {filteredLeads?.map((lead) => (
                <tr key={lead?.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/account/leads/${lead?.id}`)}>
                  <td className="px-4 py-1 min-w-[210px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-400 flex items-center justify-center text-white font-semibold text-[12px] flex-shrink-0">
                        {lead?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lead?.name}</p>
                        <div className="flex items-center gap-1 text-[12px] text-gray-500">
                          <Buildings size={14} />
                          <span className="leading-[16px]">{lead?.company}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-1">
                    <div className="space-y-[2px]">
                      <div className="flex items-center gap-2 text-[12px] opacity-[0.5]">
                        <Letter size={14} />
                        {lead?.email ? (
                          <a href={`mailto:${lead?.email}`} className="hover:text-primary">
                            {lead?.email}
                          </a>
                        ) : (
                          <button
                            onClick={() => handleFindEmail(lead?.id, lead?.companyWebsite, lead?.company)}
                            disabled={findingEmailFor === lead?.id}
                            className="text-blue-600 hover:text-blue-800 underline disabled:opacity-50 flex items-center gap-1"
                          >
                            {findingEmailFor === lead?.id ? (
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
                        <span>{typeof lead?.phone === 'string' && lead.phone ? lead.phone : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-gray-500">
                        <MapPoint size={14} />
                        <p className="max-w-[140px] text-ellipsis overflow-hidden whitespace-nowrap">{lead?.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-1">
                    <p className="text-[12px] text-gray-700 max-w-[100px] text-ellipsis overflow-hidden whitespace-nowrap">{lead?.industry}</p>
                  </td>
                  <td className="px-4 py-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[lead?.status]}`}>
                      {lead?.status.charAt(0).toUpperCase() + lead?.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-1">
                    <span className="text-[12px] font-semibold text-gray-900">
                      ${lead?.value.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-1">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-yellow-500" weight="Bold" />
                      <span className={`text-[12px] ${getScoreColor(lead?.score)}`}>
                        {lead?.score}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-1  min-w-[110px]">
                    <span className="text-[12px] opacity-[0.5]">
                      {lead?.addedDate && typeof lead?.addedDate === 'string' 
                        ? new Date(lead?.addedDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : lead?.addedDate && typeof lead?.addedDate === 'object' && 'toDate' in lead.addedDate
                        ? (lead?.addedDate as Timestamp).toDate().toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'N/A'
                      }
                    </span>
                  </td>
                  <td className="px-4 py-1">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(lead); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit lead"
                      >
                        <Pen size={18} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead?.id); }}
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

        {filteredLeads?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {loading ? 'Loading leads?...' : 'No leads found matching your criteria'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[12px] opacity-[0.5]">
          Showing {filteredLeads?.length} of {leads?.length} leads
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
