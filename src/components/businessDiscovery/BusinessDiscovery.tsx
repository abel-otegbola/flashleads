import { useContext, useState } from "react";
import { CloseCircle, Buildings2, MagicStick, Magnifer, AltArrowLeft } from "@solar-icons/react";
import Button from "../button/Button";
import LoadingIcon from "../../assets/icons/loadingIcon";
import type { Lead } from "../../contexts/LeadsContextValue";
import { AuthContext } from "../../contexts/AuthContextValue";
import { UserProfileContext } from "../../contexts/UserProfileContextValue";
import { filterUnclaimedLeads, claimMultipleLeads, calculateLeadRelevanceScore } from "../../helpers/leadClaims";

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
  estimated_num_employees?: number;
  annual_revenue?: string;
  technologies?: string[];
  keywords?: string[];
}

interface SearchFilters {
  industry: string;
  location: string;
  keywords: string;
  companySize: string;
  revenueRange: string;
  hasWebsite: string;
  needsSEO: boolean;
  needsRedesign: boolean;
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
  relevanceScore?: number; // How well this lead matches user profile
}

interface BusinessDiscoveryProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: Omit<Lead, 'id' | 'addedDate'>[]) => void;
}

const industries = [
  'Technology', 'Retail', 'Food & Beverage', 'Health & Wellness',
  'Professional Services', 'Construction', 'Education', 'Real Estate',
  'Fitness', 'Beauty', 'Automotive', 'Entertainment', 'Marketing',
  'Legal Services', 'Accounting', 'Consulting', 'Manufacturing', 'Other'
];

const companySizes = [
  { label: 'All Sizes', value: '' },
  { label: 'Micro (1-10)', value: '1,10', revenue: '0-500K' },
  { label: 'Small (11-50)', value: '11,50', revenue: '500K-5M' },
  { label: 'Medium (51-200)', value: '51,200', revenue: '5M-50M' },
  { label: 'Large (200+)', value: '201,500', revenue: '50M+' }
];

const revenueRanges = [
  { label: 'All Revenue', value: '' },
  { label: '$0 - $500K', value: '0,500000' },
  { label: '$500K - $1M', value: '500000,1000000' },
  { label: '$1M - $5M', value: '1000000,5000000' },
  { label: '$5M - $10M', value: '5000000,10000000' },
  { label: '$10M+', value: '10000000,100000000' }
];

const websiteQualityFilters = [
  { label: 'All Websites', value: '' },
  { label: 'Has Website', value: 'yes' },
  { label: 'No Website', value: 'no' },
  { label: 'Poor Quality', value: 'poor' }
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
  const { profile } = useContext(UserProfileContext);
  const [searchResults, setSearchResults] = useState<DiscoveredBusiness[]>([]);
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string>('');
  const [showMobileResults, setShowMobileResults] = useState(false);
  const [useProfileFilters, setUseProfileFilters] = useState(true);

  // Initialize filters with user profile preferences
  const getInitialFilters = (): SearchFilters => {
    if (useProfileFilters && profile) {
      return {
        industry: profile.industries?.[0] || '',
        location: profile.preferredLocations?.[0] || '',
        keywords: '',
        companySize: profile.targetCompanySize?.[0] || '',
        revenueRange: '',
        hasWebsite: profile.leadPreferences?.mustHaveWebsite ? 'yes' : '',
        needsSEO: false,
        needsRedesign: false
      };
    }
    return {
      industry: '',
      location: '',
      keywords: '',
      companySize: '',
      revenueRange: '',
      hasWebsite: '',
      needsSEO: false,
      needsRedesign: false
    };
  };

  // Search filters
  const [filters, setFilters] = useState<SearchFilters>(getInitialFilters());
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Search businesses using Apollo AI (via serverless proxy)
  const searchApolloBusinesses = async (searchFilters: SearchFilters): Promise<DiscoveredBusiness[]> => {
    const searchTerm = searchFilters.keywords || searchFilters.industry || 'businesses';
    const searchLocation = searchFilters.location || 'United States';
    
    console.log('🔍 Searching Apollo AI with filters:', searchFilters);
    
    try {
      // Build search payload with all filters
      const payload: Record<string, string | number> = {
        searchTerm,
        location: searchLocation,
        page: 1,
        perPage: 25
      };
      
      // Add company size filter
      if (searchFilters.companySize) {
        payload.companySize = searchFilters.companySize;
      }
      
      // Add revenue range
      if (searchFilters.revenueRange) {
        payload.revenueRange = searchFilters.revenueRange;
      }
      
      // Add website quality filters
      if (searchFilters.hasWebsite) {
        payload.hasWebsite = searchFilters.hasWebsite;
      }
      
      // Call our serverless proxy function to avoid CORS issues
      const response = await fetch('/api/apollo/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Apollo API error:', response.status, errorData);
        throw new Error(errorData.error || `Apollo API error: ${response.status}`);
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
        const serviceNeeds = determineServiceNeeds(org.website_url || '', score, searchFilters.industry);
        
        return {
          name: 'Contact',
          company: org.name || 'Unknown Company',
          email: org.primary_email || '',
          phone: org.phone || org.primary_phone || '',
          location: formatApolloLocation(org),
          companyWebsite: org.website_url || '',
          industry: org.industry || searchFilters.industry || 'General',
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
    let score = 30;
    let conversionPotential = 0;
    
    // Contact info increases score
    if (org.phone || org.primary_phone) {
      score += 15;
      conversionPotential += 10;
    }
    if (org.primary_email) {
      score += 10;
      conversionPotential += 10;
    }
    
    // Website presence (but higher opportunity if missing or poor)
    if (!org.website_url) {
      score += 25; // HIGH opportunity - no website
      conversionPotential += 25;
    } else {
      score += 10; // Has website
      // Check for website quality indicators
      if (org.website_url && !org.website_url.includes('https')) {
        conversionPotential += 15; // Needs HTTPS
      }
    }
    
    // Social media presence (lower = higher opportunity)
    const socialCount = [org.linkedin_url, org.facebook_url, org.twitter_url].filter(Boolean).length;
    if (socialCount === 0) {
      score += 15; // No social media = opportunity
      conversionPotential += 15;
    } else if (socialCount === 1) {
      score += 10;
      conversionPotential += 10;
    } else {
      score += 5;
      conversionPotential += 5;
    }
    
    // Company size sweet spot (small businesses are ideal)
    const empCount = org.estimated_num_employees || 0;
    if (empCount >= 5 && empCount <= 50) {
      score += 15;
      conversionPotential += 20; // Perfect size for services
    } else if (empCount >= 1 && empCount <= 100) {
      score += 10;
      conversionPotential += 10;
    }
    
    // Outdated technologies = opportunity
    if (org.technologies) {
      const outdatedTech = org.technologies.filter(tech => 
        tech.toLowerCase().includes('jquery') ||
        tech.toLowerCase().includes('wordpress') ||
        tech.toLowerCase().includes('php 5')
      );
      if (outdatedTech.length > 0) {
        conversionPotential += 15;
      }
    }
    
    // Final score is weighted toward conversion potential
    return Math.min(score + Math.floor(conversionPotential * 0.4), 100);
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
    setSelectedBusinesses(new Set()); // Reset selections
    
    try {
      // Search for organizations using Apollo AI
      let businesses = await searchApolloBusinesses(filters);
      
      const totalFound = businesses.length;
      
      // Apply client-side filters for better targeting
      if (filters.needsSEO) {
        businesses = businesses.filter(b => 
          !b.companyWebsite || b.score < 70
        );
      }
      
      if (filters.needsRedesign) {
        businesses = businesses.filter(b => 
          b.companyWebsite && b.score < 60
        );
      }
      
      if (filters.hasWebsite === 'no') {
        businesses = businesses.filter(b => !b.companyWebsite);
      } else if (filters.hasWebsite === 'yes') {
        businesses = businesses.filter(b => b.companyWebsite);
      }
      
      // Filter out already claimed leads (prevents duplicates across users)
      console.log('🔍 Checking for already claimed leads...');
      const unclaimedBusinesses = await filterUnclaimedLeads(businesses);
      const claimedCount = businesses.length - unclaimedBusinesses.length;
      
      if (claimedCount > 0) {
        console.log(`🚫 Filtered out ${claimedCount} already claimed leads`);
      }
      
      // Calculate relevance score for each lead based on user profile
      const businessesWithRelevance = unclaimedBusinesses.map(business => ({
        ...business,
        relevanceScore: calculateLeadRelevanceScore(
          business.industry,
          business.serviceNeeds,
          profile
        )
      }));
      
      // Filter out excluded industries
      let filteredBusinesses = businessesWithRelevance;
      if (profile?.leadPreferences?.excludeIndustries) {
        filteredBusinesses = businessesWithRelevance.filter(
          b => !profile.leadPreferences?.excludeIndustries?.includes(b.industry)
        );
      }
      
      // Sort by relevance score first, then by conversion score
      filteredBusinesses.sort((a, b) => {
        // Primary: relevance score (how well it matches user profile)
        if (Math.abs(a.relevanceScore - b.relevanceScore) > 10) {
          return b.relevanceScore - a.relevanceScore;
        }
        // Secondary: conversion potential
        return b.score - a.score;
      });
      
      console.log('✨ Sorted by relevance to your profile and conversion potential');
      
      setSearchResults(filteredBusinesses);
      setShowMobileResults(true); // Show results on mobile after search
      
      if (unclaimedBusinesses.length === 0) {
        if (claimedCount > 0 && totalFound > 0) {
          setError(`Found ${totalFound} businesses, but all ${claimedCount} have already been claimed by other users. Try different search criteria for fresh leads.`);
        } else {
          setError('No businesses found matching your criteria. Try adjusting your filters.');
        }
      } else if (claimedCount > 0) {
        // Show info message if some were filtered
        console.log(`ℹ️ Found ${unclaimedBusinesses.length} unclaimed leads (${claimedCount} already claimed by others)`);
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

  const handleImport = async () => {
    if (selectedBusinesses.size === 0) {
      setError('Please select at least one business to import.');
      return;
    }
    
    const selectedLeads = searchResults.filter((_, index) => selectedBusinesses.has(index));
    
    const leadsToImport = selectedLeads.map(business => ({
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
    
    // Claim these leads so other users won't see them
    if (user?.uid) {
      await claimMultipleLeads(
        selectedLeads.map(b => ({
          companyWebsite: b.companyWebsite,
          email: b.email,
          company: b.company,
          industry: b.industry
        })),
        user.uid,
        profile?.primaryServices || []
      );
      console.log('🔒 Claimed selected leads for user');
    }
    
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
          <div className={`p-4 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50 md:w-96 overflow-y-auto ${showMobileResults ? 'hidden md:block' : 'block'}`}>
            <h3 className="font-semibold mb-4 flex items-center justify-between">
              <span>Search Criteria</span>
              {searchResults.length > 0 && (
                <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                  {searchResults.length} found
                </span>
              )}
            </h3>
            
            <div className="space-y-4">
              {/* Profile-based Recommendations */}
              {profile && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <span>🎯</span> Personalized for You
                  </p>
                  <div className="space-y-1 text-xs text-purple-800">
                    {profile.industries && profile.industries.length > 0 && (
                      <p>• Industries: <span className="font-medium">{profile.industries.slice(0, 2).join(', ')}</span></p>
                    )}
                    {profile.primaryServices && profile.primaryServices.length > 0 && (
                      <p>• Services: <span className="font-medium">{profile.primaryServices.slice(0, 2).join(', ')}</span></p>
                    )}
                    {profile.previousClients && profile.previousClients.length > 0 && (
                      <p>• Experience: <span className="font-medium">{profile.previousClients.length} previous {profile.previousClients.length === 1 ? 'client' : 'clients'}</span></p>
                    )}
                  </div>
                  <button
                    onClick={() => setUseProfileFilters(!useProfileFilters)}
                    className="text-xs text-purple-600 hover:text-purple-800 underline mt-2"
                  >
                    {useProfileFilters ? 'Use custom filters' : 'Use my profile'}
                  </button>
                </div>
              )}
              
              {/* Basic Filters */}
              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => updateFilter('industry', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
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
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                >
                  <option value="">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Keywords</label>
                <input
                  type="text"
                  value={filters.keywords}
                  onChange={(e) => updateFilter('keywords', e.target.value)}
                  placeholder="e.g., restaurant, accounting"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="w-full text-left text-sm font-medium text-primary hover:text-primary-dark flex items-center justify-between py-2"
              >
                <span>🎯 Advanced Filters</span>
                <span className="text-xs">{showAdvancedFilters ? '▲' : '▼'}</span>
              </button>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Company Size</label>
                    <select
                      value={filters.companySize}
                      onChange={(e) => updateFilter('companySize', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                    >
                      {companySizes.map(size => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Smaller companies often need more help</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Revenue Range</label>
                    <select
                      value={filters.revenueRange}
                      onChange={(e) => updateFilter('revenueRange', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                    >
                      {revenueRanges.map(range => (
                        <option key={range.value} value={range.value}>{range.label}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Target companies that can afford your services</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Website Quality</label>
                    <select
                      value={filters.hasWebsite}
                      onChange={(e) => updateFilter('hasWebsite', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
                    >
                      {websiteQualityFilters.map(filter => (
                        <option key={filter.value} value={filter.value}>{filter.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.needsSEO}
                        onChange={(e) => updateFilter('needsSEO', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm">Needs SEO (Score &lt; 70)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.needsRedesign}
                        onChange={(e) => updateFilter('needsRedesign', e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="text-sm">Needs Redesign (Score &lt; 60)</span>
                    </label>
                  </div>
                </div>
              )}
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

            {/* Dynamic Strategy Tips */}
            <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg text-sm">
              <p className="font-semibold text-blue-900 mb-2">
                {filters.hasWebsite === 'no' ? '🎯 High Conversion Strategy' :
                 filters.needsSEO || filters.needsRedesign ? '💼 Value-Add Strategy' :
                 filters.companySize === '1,10' ? '🚀 Startup Strategy' :
                 '💡 Smart Targeting'}
              </p>
              <p className="text-blue-800 leading-relaxed">
                {filters.hasWebsite === 'no' 
                  ? 'Companies without websites are 3x more likely to convert. They know they need help!' 
                  : filters.needsSEO && filters.needsRedesign
                  ? 'Targeting businesses with poor web presence = easier to demonstrate value with audits.'
                  : filters.needsSEO
                  ? 'SEO-focused leads often have budget for ongoing services. Great for retainers!'
                  : filters.companySize === '1,10'
                  ? 'Micro businesses (1-10 employees) are decision-makers themselves. Faster sales cycle!'
                  : filters.companySize === '11,50'
                  ? 'Small businesses (11-50) have dedicated budgets and growth mindset. Ideal clients!'
                  : 'Target businesses with weak online presence for the best conversion rates!'
                }
              </p>
              {(filters.needsSEO || filters.needsRedesign || filters.hasWebsite === 'no') && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700 font-medium">Expected Conversion Rate:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: filters.hasWebsite === 'no' ? '85%' : 
                                 filters.needsRedesign ? '70%' : 
                                 filters.needsSEO ? '60%' : '45%' 
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-blue-900">
                      {filters.hasWebsite === 'no' ? '85%' : 
                       filters.needsRedesign ? '70%' : 
                       filters.needsSEO ? '60%' : '45%'}
                    </span>
                  </div>
                </div>
              )}
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
