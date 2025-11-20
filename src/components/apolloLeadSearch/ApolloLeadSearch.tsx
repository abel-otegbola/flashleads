import { useState } from "react";
import { CloseCircle, Buildings2, UserCircle, Star } from "@solar-icons/react";
import Button from "../button/Button";
import LoadingIcon from "../../assets/icons/loadingIcon";
import { searchLeads, hunterContactToLead, type HunterContact, type HunterOrganization } from "../../helpers/apolloApi";

interface ApolloLeadSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: Record<string, unknown>[]) => void;
}

const departments = [
  'executive', 'it', 'finance', 'management', 'sales', 'legal', 
  'support', 'hr', 'marketing', 'communication', 'design', 'operations'
];

const seniorities = ['junior', 'senior', 'executive'];

export default function ApolloLeadSearch({ isOpen, onClose, onImportLeads }: ApolloLeadSearchProps) {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<HunterContact[]>([]);
  const [organization, setOrganization] = useState<HunterOrganization | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');
  const [totalResults, setTotalResults] = useState<number>(0);

  // Search params
  const [domain, setDomain] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [seniority, setSeniority] = useState('');

  const handleSearch = async () => {
    if (!domain) {
      setError('Please enter a company domain (e.g., stripe.com)');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const params: Record<string, unknown> = {
        domain: domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0], // Clean domain
        limit: 10, // Free plan limit
      };

      if (jobTitle) params.job_titles = jobTitle;
      if (department) params.department = department;
      if (seniority) params.seniority = seniority;

      const response = await searchLeads(params);
      setSearchResults(response.data.emails || []);
      setOrganization(response.data);
      setTotalResults(response.meta?.results || 0);

      if (!response.data.emails || response.data.emails.length === 0) {
        setError('No leads found for this domain. Try a different company or check the domain name.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search leads. Please check your Hunter.io API key.';
      setError(errorMessage);
      console.error('Hunter search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLead = (email: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(email)) {
      newSelected.delete(email);
    } else {
      newSelected.add(email);
    }
    setSelectedLeads(newSelected);
  };

  const toggleAll = () => {
    if (selectedLeads.size === searchResults.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(searchResults.map(c => c.value)));
    }
  };

  const handleImport = () => {
    if (!organization) {
      console.error('No organization data available');
      setError('Organization data is missing. Please try searching again.');
      return;
    }

    if (selectedLeads.size === 0) {
      setError('Please select at least one lead to import.');
      return;
    }
    
    const leadsToImport = searchResults
      .filter(contact => selectedLeads.has(contact.value))
      .map(contact => hunterContactToLead(contact, organization));
    
    console.log('Importing leads:', leadsToImport);
    onImportLeads(leadsToImport);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Star size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-bold">AI Lead Generation</h2>
              <p className="text-sm text-gray-600">Powered by Hunter.io</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Search Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Company Domain <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g., stripe.com, intercom.com"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
            />
            <p className="text-xs text-gray-500 mt-1">Enter the company's website domain to find their team members</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Job Title (Optional)</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., CEO, VP Sales"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Department (Optional)</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept.charAt(0).toUpperCase() + dept.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Seniority (Optional)</label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">All Levels</option>
                {seniorities.map(level => (
                  <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <Button onClick={handleSearch} disabled={loading} className="w-full">
            {loading ? (
              <LoadingIcon color="white" className="animate-spin w-5 h-5" />
            ) : (
              <>
                <Star size={18} />
                Search Leads
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {totalResults > searchResults.length && searchResults.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <span className="text-lg">ℹ️</span>
                <div>
                  <p className="font-medium mb-1">Free Plan Limit</p>
                  <p className="text-sm">
                    Showing {searchResults.length} of {totalResults} contacts. 
                    <a href="https://hunter.io/pricing" target="_blank" rel="noopener noreferrer" className="underline font-medium ml-1">
                      Upgrade to see all {totalResults} results
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {searchResults.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Found {searchResults.length} leads
                </p>
                <button
                  onClick={toggleAll}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  {selectedLeads.size === searchResults.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="space-y-3">
                {searchResults.map((contact) => (
                  <div
                    key={contact.value}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedLeads.has(contact.value)
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleLead(contact.value)}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(contact.value)}
                        onChange={() => {}}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {contact.first_name} {contact.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">{contact.position || 'Position not available'}</p>
                          </div>
                          <span className="text-xs font-medium text-primary">
                            {contact.confidence}% match
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Buildings2 size={14} />
                            <span>{organization?.organization}</span>
                          </div>
                          {contact.department && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {contact.department}
                            </span>
                          )}
                          {contact.seniority && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {contact.seniority}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            ✓ {contact.value}
                          </span>
                          {contact.linkedin && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              LinkedIn
                            </span>
                          )}
                          {contact.verification?.status && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              contact.verification.status === 'valid' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {contact.verification.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && searchResults.length === 0 && !error && (
            <div className="text-center py-12">
              <UserCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">
                Enter a company domain to find their team members' contact information
              </p>
              <p className="text-xs text-gray-400">
                Example: stripe.com, intercom.com, shopify.com
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedLeads.size} lead{selectedLeads.size !== 1 ? 's' : ''} selected
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={selectedLeads.size === 0}
                >
                  Import {selectedLeads.size} Lead{selectedLeads.size !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
