import { useContext, useState } from "react";
import { CloseCircle, Buildings2, MagicStick, Magnifer, AltArrowLeft } from "@solar-icons/react";
import Button from "../button/Button";
import LoadingIcon from "../../assets/icons/loadingIcon";
import type { Lead } from "../../contexts/LeadsContextValue";
import { AuthContext } from "../../contexts/AuthContextValue";

interface ApolloOrganization {
  name: string;
  website_url?: string;
  primary_email?: string;
  phone?: string;
  primary_phone?: string;
  city?: string;
  state?: string;
  country?: string;
  industry?: string;
  linkedin_url?: string;
  facebook_url?: string;
  twitter_url?: string;
}

interface DiscoveredBusiness {
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  companyWebsite: string;
  industry: string;
  score: number;
  userId: string,
  serviceNeeds: string[];
  value: number;
}

interface BusinessDiscoveryProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: Omit<Lead, 'id' | 'addedDate'>[]) => void;
}

const industries = [
  'Technology', 'Retail', 'Food & Beverage', 'Health & Wellness',
  'Professional Services', 'Construction', 'Education', 'Real Estate',
  'Fitness', 'Beauty', 'Automotive', 'Entertainment', 'Other'
];

const locations = [
  // North America
  'United States', 'Canada', 'Mexico',
  
  // Europe
  'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 
  'Switzerland', 'Belgium', 'Austria', 'Ireland', 'Sweden', 'Norway', 
  'Denmark', 'Finland', 'Poland', 'Portugal', 'Czech Republic', 'Greece', 
  'Hungary', 'Romania', 'Ukraine',
  
  // Asia-Pacific
  'Australia', 'New Zealand', 'Singapore', 'Japan', 'South Korea', 
  'India', 'China', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 
  'Malaysia', 'Pakistan', 'Bangladesh', 'Hong Kong', 'Taiwan',
  
  // Middle East
  'UAE', 'Saudi Arabia', 'Israel', 'Qatar', 'Kuwait', 'Turkey',
  
  // Latin America
  'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Costa Rica',
  
  // Africa
  'South Africa', 'Nigeria', 'Egypt', 'Kenya', 'Morocco', 'Ghana',
];

export default function BusinessDiscovery({ isOpen, onClose, onImportLeads }: BusinessDiscoveryProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState<DiscoveredBusiness[]>([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>('');
  const [showMobileResults, setShowMobileResults] = useState(false);

  // Search params
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [keywords, setKeywords] = useState('');

  // Search businesses using Apollo AI
  const searchApolloBusinesses = async (industry: string, location: string, keywords: string): Promise<DiscoveredBusiness[]> => {
    const searchTerm = keywords || industry || 'businesses';
    const searchLocation = location || 'United States';
    
    console.log('🔍 Searching Apollo AI:', searchTerm, 'in', searchLocation);
    
    const apiKey = import.meta.env.VITE_APOLLO_API_KEY;
    
    if (!apiKey) {
      console.error('❌ VITE_APOLLO_API_KEY not found in environment');
      setError('Apollo API key not configured. Please add VITE_APOLLO_API_KEY to your .env.local file.');
      return [];
    }
    
    try {
      // Apollo AI organization search endpoint (free tier available)
      const response = await fetch('https://api.apollo.io/v1/mixed_companies/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'X-Api-Key': apiKey
        },
        body: JSON.stringify({
          q_organization_keyword_tags: [searchTerm],
          organization_locations: [searchLocation],
          page: 1,
          per_page: 25,
          organization_num_employees_ranges: ['1,20', '21,50', '51,100'], // Small businesses
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Apollo API error:', response.status, errorText);
        throw new Error(`Apollo API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Apollo API response:', data);
      
      const organizations = data.organizations || data.accounts || [];
      
      if (organizations.length === 0) {
        console.log('ℹ️ No organizations found');
        return [];
      }
      
      const businesses = organizations.map((org: ApolloOrganization) => {
        const score = calculateApolloScore(org);
        const serviceNeeds = determineServiceNeeds(org.website_url || '', score, industry);
        
        return {
          name: 'Contact',
          company: org.name || 'Unknown Company',
          email: org.primary_email || '',
          phone: org.phone || org.primary_phone || '',
          location: formatApolloLocation(org),
          companyWebsite: org.website_url || '',
          industry: org.industry || industry || 'General',
          score,
          userId: user?.uid,
          serviceNeeds,
          value: estimateProjectValue(serviceNeeds, score)
        };
      });
      
      console.log('✅ Parsed', businesses.length, 'businesses from Apollo');
      return businesses;
      
    } catch (error) {
      console.error('Apollo search error:', error);
      throw error;
    }
  };
  
  const formatApolloLocation = (org: ApolloOrganization): string => {
    const parts = [];
    if (org.city) parts.push(org.city);
    if (org.state) parts.push(org.state);
    if (org.country) parts.push(org.country);
    return parts.join(', ') || 'Unknown';
  };
  
  const calculateApolloScore = (org: ApolloOrganization): number => {
    let score = 40;
    
    if (org.website_url) score += 20;
    if (org.phone || org.primary_phone) score += 10;
    if (org.linkedin_url) score += 5;
    if (org.facebook_url) score += 5;
    if (org.twitter_url) score += 5;
    
    // Lower score for companies without much web presence
    if (!org.facebook_url && !org.twitter_url && !org.linkedin_url) {
      score += 15; // Higher opportunity
    }
    
    return Math.min(score, 100);
  };



  const determineServiceNeeds = (website: string, score: number, category: string): string[] => {
    const needs: string[] = [];
    
    if (!website) {
      needs.push('Website Design', 'SEO Optimization', 'Google My Business');
    } else {
      if (score < 70) needs.push('Website Redesign', 'SEO Optimization');
      if (score < 60) needs.push('Speed Optimization', 'Mobile Optimization');
      
      const cat = category.toLowerCase();
      if (cat.includes('retail') || cat.includes('shop')) {
        needs.push('E-commerce Setup');
      } else if (cat.includes('restaurant') || cat.includes('food')) {
        needs.push('Online Ordering');
      }
    }
    
    if (needs.length === 0) {
      needs.push('Website Maintenance', 'SEO');
    }
    
    return needs;
  };

  const estimateProjectValue = (serviceNeeds: string[], score: number): number => {
    let value = 3000;
    value += serviceNeeds.length * 2500;
    
    if (score < 50) value += 12000;
    else if (score < 70) value += 6000;
    else value += 2000;
    
    value += Math.floor(Math.random() * 4000);
    
    return value;
  };

  const handleDiscover = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Search businesses using Apollo AI
      const businesses = await searchApolloBusinesses(industry, location, keywords);
      
      setSearchResults(businesses);
      setShowMobileResults(true); // Show results on mobile after search
      
      if (businesses.length === 0) {
        setError('No businesses found. Try different search terms.');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to discover businesses';
      setError(errorMessage);
      console.error('Business discovery error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBusiness = (index: number) => {
    const newSelected = new Set(selectedBusinesses);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedBusinesses(newSelected);
  };

  const toggleAll = () => {
    if (selectedBusinesses.size === searchResults.length) {
      setSelectedBusinesses(new Set());
    } else {
      setSelectedBusinesses(new Set(searchResults.map((_, index) => index)));
    }
  };

  const handleImport = () => {
    if (selectedBusinesses.size === 0) {
      setError('Please select at least one business to import.');
      return;
    }
    
    const leadsToImport = searchResults
      .filter((_, index) => selectedBusinesses.has(index))
      .map(business => ({
        name: business.name,
        company: business.company,
        email: business.email,
        phone: business.phone,
        location: business.location,
        status: 'new' as const,
        value: business.value,
        industry: business.industry,
        score: business.score,
        userId: user?.uid,
        companyWebsite: business.companyWebsite,
        serviceNeeds: business.serviceNeeds,
        linkedinUrl: '',
        twitterUrl: '',
        companyLinkedin: '',
        notes: ''
      }));
    
    console.log('✨ Importing discovered businesses:', leadsToImport);
    onImportLeads(leadsToImport);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MagicStick size={24} className="text-primary" />
            <div>
              <h2 className="text-lg font-bold">Discover Businesses</h2>
              <p className="text-sm text-gray-600">Find small businesses that need your services</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <CloseCircle size={24} />
          </button>
        </div>

        <div className="flex md:flex-row flex-col overflow-y-auto">
          {/* Search Filters */}
          <div className={`p-4 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 md:w-80 ${showMobileResults ? 'hidden md:block' : 'block'}`}>
            <h3 className="font-semibold mb-4">Search Criteria</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">All Industries</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind.toLowerCase()}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Keywords (Optional)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., outdated website, slow site"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <Button onClick={handleDiscover} disabled={loading} className="w-full mt-6">
              {loading ? (
                <LoadingIcon color="white" className="animate-spin w-5 h-5" />
              ) : (
                <>
                  <Magnifer size={18} />
                  Discover Businesses
                </>
              )}
            </Button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-900 mb-2">💡 Pro Tip</p>
              <p className="text-blue-800">
                We find businesses with poor websites, slow speeds, and SEO issues - perfect opportunities for your services!
              </p>
            </div>
          </div>

          {/* Results */}
          <div className={`flex-1 overflow-y-auto p-4 ${!showMobileResults ? 'hidden md:block' : 'block'}`}>
            {/* Back button for mobile */}
            {showMobileResults && (
              <button
                onClick={() => setShowMobileResults(false)}
                className="flex items-center gap-2 text-primary mb-4 md:hidden hover:underline"
              >
                <AltArrowLeft size={20} />
                <span>Back to Search</span>
              </button>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {searchResults.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">
                    Found {searchResults.length} potential clients
                  </p>
                  <button
                    onClick={toggleAll}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    {selectedBusinesses.size === searchResults.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="grid gap-3">
                  {searchResults.map((business, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedBusinesses.has(index)
                          ? 'border-primary bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleBusiness(index)}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedBusinesses.has(index)}
                          onChange={() => {}}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{business.company}</h3>
                              <p className="text-sm text-gray-600">{business.name}</p>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">
                              Score: {business.score}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Buildings2 size={14} />
                              <span>{business.industry}</span>
                            </div>
                            <span>📍 {business.location}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-2">
                            {business.serviceNeeds.map((need: string, idx: number) => (
                              <span key={idx} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                                🎯 {need}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>💰 Est. Value: ${business.value.toLocaleString()}</span>
                            <span>🌐 {business.companyWebsite}</span>
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
                <Buildings2 size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">
                  Select your criteria and click "Discover Businesses"
                </p>
                <p className="text-xs text-gray-400">
                  We'll find small businesses that need your services
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {searchResults.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedBusinesses.size} business{selectedBusinesses.size !== 1 ? 'es' : ''} selected
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={selectedBusinesses.size === 0}
                >
                  Import {selectedBusinesses.size} Lead{selectedBusinesses.size !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
