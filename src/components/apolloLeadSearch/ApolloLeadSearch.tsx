import { useState } from "react";
import { CloseCircle, Buildings2, MapPoint, UserCircle, Star } from "@solar-icons/react";
import Button from "../button/Button";
import LoadingIcon from "../../assets/icons/loadingIcon";
import { searchLeads, apolloContactToLead, type ApolloContact } from "../../helpers/apolloApi";

interface ApolloLeadSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: Record<string, unknown>[]) => void;
}

const industryTags = [
  { id: '5567cd4773696439b10b0000', name: 'Technology' },
  { id: '5567cd4773696439b11d0000', name: 'Software' },
  { id: '5567cd4773696439b1230000', name: 'Finance' },
  { id: '5567cd4773696439b1170000', name: 'Healthcare' },
  { id: '5567cd4773696439b1250000', name: 'Marketing' },
  { id: '5567cd4773696439b11f0000', name: 'E-commerce' },
  { id: '5567cd4773696439b1210000', name: 'Real Estate' },
];

const employeeRanges = [
  { value: '1,10', label: '1-10 employees' },
  { value: '11,50', label: '11-50 employees' },
  { value: '51,200', label: '51-200 employees' },
  { value: '201,500', label: '201-500 employees' },
  { value: '501,1000', label: '501-1000 employees' },
  { value: '1001,10000', label: '1001+ employees' },
];

export default function ApolloLeadSearch({ isOpen, onClose, onImportLeads }: ApolloLeadSearchProps) {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ApolloContact[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>('');

  // Search params
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, unknown> = {
        page: 1,
        per_page: 25,
        person_titles: jobTitle ? [jobTitle] : undefined,
        organization_locations: location ? [location] : undefined,
        organization_industry_tag_ids: industry ? [industry] : undefined,
        organization_num_employees_ranges: companySize ? [companySize] : undefined,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await searchLeads(params);
      setSearchResults(response.contacts);

      if (response.contacts.length === 0) {
        setError('No leads found matching your criteria. Try adjusting your filters.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search leads. Please check your Apollo API key.';
      setError(errorMessage);
      console.error('Apollo search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLead = (id: string) => {
    const newSelected = new Set(selectedLeads);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedLeads(newSelected);
  };

  const toggleAll = () => {
    if (selectedLeads.size === searchResults.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(searchResults.map(c => c.id)));
    }
  };

  const handleImport = () => {
    const leadsToImport = searchResults
      .filter(contact => selectedLeads.has(contact.id))
      .map(apolloContactToLead);
    
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
              <p className="text-sm text-gray-600">Powered by Apollo.io</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseCircle size={24} />
          </button>
        </div>

        {/* Search Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., CEO, Marketing Manager, Founder"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">All Industries</option>
                {industryTags.map(tag => (
                  <option key={tag.id} value={tag.id}>{tag.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Any Size</option>
                {employeeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
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
                    key={contact.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedLeads.has(contact.id)
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleLead(contact.id)}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.has(contact.id)}
                        onChange={() => {}}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                            <p className="text-sm text-gray-600">{contact.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Buildings2 size={14} />
                            <span>{contact.organization?.name}</span>
                          </div>
                          {contact.organization?.city && (
                            <div className="flex items-center gap-1">
                              <MapPoint size={14} />
                              <span>{contact.organization.city}, {contact.organization.state}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          {contact.email && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              ✓ Email
                            </span>
                          )}
                          {contact.linkedin_url && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              LinkedIn
                            </span>
                          )}
                          {contact.organization?.website_url && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              Website
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
              <p className="text-gray-500">
                Enter your search criteria and click "Search Leads" to find potential clients
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
