import { useContext, useEffect, useState, useCallback } from "react"
import { UserProfileContext } from "../../../contexts/UserProfileContextValue";
import "../../../assets/css/react-calendar.css"
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Buildings, MapPoint, Star } from "@solar-icons/react";
import { AuthContext } from "../../../contexts/AuthContextValue";
import SkeletonLoader from "../../../components/skeletonLoader/SkeletonLoader";
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import Button from "../../../components/button/Button";

interface GeneratedLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string | Record<string, never>;
  location: string;
  companyWebsite: string;
  industry: string;
  score: number;
  serviceNeeds: string[];
  value: number;
  addedDate: string;
  logoUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  foundedYear?: number;
  estimatedEmployees?: number;
}

interface ApolloOrganization {
  id?: string;
  name?: string;
  primary_email?: string;
  phone?: string | Record<string, never>;
  primary_phone?: Record<string, never>;
  website_url?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  estimated_num_employees?: number;
  linkedin_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  logo_url?: string;
  founded_year?: number;
  raw_address?: string;
}

function Dashboardpage() {
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);
  const { addLead } = useContext(LeadsContext);
  const navigate = useNavigate();
  const [generatedLeads, setGeneratedLeads] = useState<GeneratedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(profile?.specialty || "");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold";
    if (score >= 70) return "text-orange-600 font-medium";
    return "text-gray-600";
  };

  const saveLead = async (lead: GeneratedLead) => {
    if (!user?.uid) return null;
    
    setSavingLeadId(lead.id);
    
    try {
      const leadData = {
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        location: lead.location,
        companyWebsite: lead.companyWebsite,
        industry: lead.industry,
        score: lead.score,
        serviceNeeds: lead.serviceNeeds,
        value: lead.value,
        status: 'new' as const,
        userId: user.uid,
        linkedinUrl: lead.linkedinUrl,
        twitterUrl: lead.twitterUrl,
        facebookUrl: lead.facebookUrl,
        logoUrl: lead.logoUrl,
        foundedYear: lead.foundedYear,
        estimatedEmployees: lead.estimatedEmployees,
      };
      
      const leadId = await addLead(leadData);
      
      console.log('✅ Lead saved successfully with ID:', leadId);
      
      return leadId;
    } catch (error) {
      console.error('Error saving lead:', error);
      return null;
    } finally {
      setSavingLeadId(null);
    }
  };
  
  const handleLeadClick = async (lead: GeneratedLead) => {
    // Save the lead first, then navigate
    const leadId = await saveLead(lead);
    if (leadId) {
      navigate(`/account/leads/${leadId}`);
    }
  };

  const calculateScore = useCallback((org: ApolloOrganization): number => {
    let score = 50;
    
    const hasPhone = org.phone && typeof org.phone === 'string';
    if (hasPhone) score += 15;
    if (org.primary_email) score += 10;
    if (!org.website_url) score += 20; // Higher opportunity
    if (org.estimated_num_employees && org.estimated_num_employees >= 5 && org.estimated_num_employees <= 50) score += 10;
    
    return Math.min(score, 100);
  }, []);

  const determineServiceNeeds = useCallback((org: ApolloOrganization, specialty?: string): string[] => {
    const needs: string[] = [];
    
    if (!org.website_url) {
      needs.push('Website Development');
    }
    if (!org.linkedin_url) {
      needs.push('Social Media Setup');
    }
    
    // Add specialty-based needs
    if (specialty) {
      if (specialty.toLowerCase().includes('web')) {
        needs.push('Web Design');
      }
      if (specialty.toLowerCase().includes('seo')) {
        needs.push('SEO');
      }
      if (specialty.toLowerCase().includes('brand')) {
        needs.push('Branding');
      }
    }
    
    return needs.slice(0, 3); // Max 3 needs
  }, []);

  const estimateValue = useCallback((serviceNeeds: string[], score: number): number => {
    const baseValue = 2000;
    const needsMultiplier = serviceNeeds.length * 1000;
    const scoreMultiplier = (score / 100) * 1000;
    
    return baseValue + needsMultiplier + scoreMultiplier;
  }, []);

  const formatLocation = useCallback((org: ApolloOrganization): string => {
    const parts = [];
    if (org.city) parts.push(org.city);
    if (org.state) parts.push(org.state);
    if (org.country) parts.push(org.country);
    return parts.join(', ') || 'Unknown';
  }, []);

  // Generate leads when dashboard opens
  useEffect(() => {
    const generateDashboardLeads = async () => {
      if (!user?.uid || !profile) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        
        // Randomize location for variety
        const locations = [
          'United States',
          'New York, NY',
          'Los Angeles, CA',
          'Chicago, IL',
          'Houston, TX',
          'Phoenix, AZ',
          'Philadelphia, PA',
          'San Antonio, TX',
          'San Diego, CA',
          'Dallas, TX',
          'San Jose, CA',
          'Austin, TX',
          'Jacksonville, FL',
          'San Francisco, CA',
          'Columbus, OH',
          'Charlotte, NC',
          'Indianapolis, IN',
          'Seattle, WA',
          'Denver, CO',
          'Boston, MA',
          'Portland, OR',
          'Miami, FL',
          'Atlanta, GA',
          'Nashville, TN',
          'Detroit, MI'
        ];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        
        // Randomize page to get different results each time
        const randomPage = Math.floor(Math.random() * 5) + 1; // Pages 1-5
        
        console.log('🔍 Generating dashboard leads for:', searchTerm, 'in', randomLocation, 'page', randomPage);

        // Call Apollo discover API
        const response = await fetch('/api/apollo/discover', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchTerm: searchTerm || profile?.specialty,
            location: randomLocation,
            page: randomPage,
            perPage: 5, // Only get 5 leads for dashboard
            companySize: '1,50' // Small businesses
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(errorData.error || 'Failed to generate leads');
        }

        const data = await response.json();
        const organizations = data.organizations || [];

        // Transform into lead format
        const leads: GeneratedLead[] = organizations.slice(0, 5).map((org: ApolloOrganization, index: number) => {
          const score = calculateScore(org);
          const serviceNeeds = determineServiceNeeds(org, profile.specialty);
          
          // Handle phone field which can be string or empty object
          const phoneValue = org.phone && typeof org.phone === 'string' ? org.phone : '';
          
          return {
            id: org.id || `generated-${index}`,
            name: 'Contact',
            company: org.name || 'Unknown Company',
            email: org.primary_email || '',
            phone: phoneValue,
            location: formatLocation(org),
            companyWebsite: org.website_url || '',
            industry: org.industry || profile.specialty || 'General',
            score,
            serviceNeeds,
            value: estimateValue(serviceNeeds, score),
            addedDate: new Date().toISOString(),
            logoUrl: org.logo_url,
            linkedinUrl: org.linkedin_url,
            twitterUrl: org.twitter_url,
            facebookUrl: org.facebook_url,
            foundedYear: org.founded_year,
            estimatedEmployees: org.estimated_num_employees,
          };
        });

        setGeneratedLeads(leads);
        console.log('✅ Generated', leads.length, 'leads for dashboard');

      } catch (err) {
        console.error('Error generating dashboard leads:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate leads');
      } finally {
        setLoading(false);
      }
    };

    generateDashboardLeads();
  }, [user?.uid, profile, calculateScore, determineServiceNeeds, estimateValue, formatLocation, searchTerm]);

  return (
      <div className="flex md:flex-row flex-col gap-4 md:p-4 h-full">

        <div className="md:w-[65%] w-full p-4 flex flex-col gap-4 mb-6 md:border border-gray-500/[0.09] bg-slate-100/[0.1] md:rounded-lg">
          <div>
            <h1 className="mb-2 font-semibold uppercase">Discover</h1>
            <p className="text-gray-600">Leads based on your specialization:</p>
          </div>

        {loading && <SkeletonLoader count={5} />}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && generatedLeads.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">No leads generated yet. Please complete your profile first.</p>
          </div>
        )}

        <div className="flex flex-col gap-2 p-4 shadow-[4px_4px_20px_#0000000A] rounded-[20px] border border-gray-500/[0.1]">
          <div className="flex items-start gap-2">
            <Link to={"/account"} className="w-10 h-10 rounded-full bg-primary/[0.2] border border-gray-500/[0.2] flex items-center justify-center font-semibold">
                <img src={user?.photoURL || profile?.photoURL || "/profile.jpg"} width={40} height={40} className="rounded-full" />
            </Link>
            <textarea onChange={(e) => setSearchQuery(e.target.value)} className="p-2 flex-1 border-none outline-none text-semibold" placeholder="Customize your client search here..."></textarea>
          </div>
          <div className="flex justify-between gap-2 items-end">
            <select className="border border-gray-500/[0.1] rounded-full px-3 py-1 text-sm focus:ring-primary focus:ring-1 focus:outline-none">
              <option value="">All Industries</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="education">Education</option>
              <option value="real_estate">Real Estate</option>
              <option value="marketing">Marketing</option>
              <option value="consulting">Consulting</option>
            </select>
            <Button className="px-4 py-2 rounded text-white hover:bg-primary-dark text-sm font-medium" onChange={() => setSearchTerm(searchQuery)}>Search</Button>
          </div>
        </div>

        <p className="font-semibold opacity-[0.5] underline py-4">Current search: {profile?.specialty}</p>

        {!loading && generatedLeads.map((lead) => (
          <div
            key={lead?.id}
            className="bg-white border border-gray-200/[0.2] rounded-xl transition-all duration-300 overflow-hidden cursor-pointer w-full"
            onClick={() => handleLeadClick(lead)}
          >
              {/* Header */}
              <div className="flex items-start gap-4 p-4">
                {lead?.logoUrl ? (
                  <img 
                    src={lead.logoUrl} 
                    alt={`${lead.company} logo`}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-500/[0.1]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div 
                  className={`w-12 h-12 bg-slate-100/[0.3] rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-gray-500/[0.1] ${lead?.logoUrl ? 'hidden' : ''}`}
                >
                  {lead?.company.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold truncate">
                      {lead?.company}
                    </h3>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star size={14} className="text-yellow-500" weight="Bold" />
                      <span className={`text-xs font-medium ${getScoreColor(lead?.score)}`}>
                        {lead?.score}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600 mb-2">
                    <Buildings size={16} className="flex-shrink-0" />
                    <span className="font-medium">{lead?.industry}</span>
                    {lead?.estimatedEmployees && (
                      <span className="text-xs">• {lead.estimatedEmployees} employees</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPoint size={14} />
                    <span>{lead?.location}</span>
                    {lead?.foundedYear && (
                      <span>• Founded {lead.foundedYear}</span>
                    )}
                  </div>
                  
                  {/* Social Links */}
                  {(lead?.linkedinUrl || lead?.twitterUrl || lead?.facebookUrl || lead?.companyWebsite) && (
                    <div className="flex items-center gap-2 mt-2">
                      {lead?.companyWebsite && (
                        <Link
                          to={lead.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-4 py-1 rounded bg-slate-100/[0.5] font-medium border border-gray-500/[0.1] hover:bg-primary hover:text-white hover:border-primary"
                        >
                          Website
                        </Link>
                      )}
                      {lead?.linkedinUrl && (
                        <Link
                          to={lead.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-4 py-1 rounded bg-slate-100/[0.5] font-medium border border-gray-500/[0.1] hover:bg-primary hover:text-white hover:border-primary"
                        >
                          LinkedIn
                        </Link>
                      )}
                      {lead?.twitterUrl && (
                        <Link
                          to={lead.twitterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-4 py-1 rounded bg-slate-100/[0.5] font-medium border border-gray-500/[0.1] hover:bg-primary hover:text-white hover:border-primary"
                        >
                          Twitter
                        </Link>
                      )}
                      {lead?.facebookUrl && (
                        <Link
                          to={lead.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-4 py-1 rounded bg-slate-100/[0.5] font-medium border border-gray-500/[0.1] hover:bg-primary hover:text-white hover:border-primary"
                        >
                          Facebook
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    saveLead(lead);
                  }}
                  disabled={savingLeadId === lead.id}
                  className="opacity-75 hover:opacity-100 disabled:opacity-50"
                  title="Save to leads"
                >
                  <Bookmark 
                    size={20} 
                    weight={savingLeadId === lead.id ? 'Bold' : 'Linear'}
                    className={savingLeadId === lead.id ? 'text-blue-600' : ''}
                  />
                </button>
              </div>


              {/* Service Needs (if available) */}
              {lead?.serviceNeeds && lead.serviceNeeds.length > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <p className="text-xs text-gray-500 font-medium">Service Needs:</p>
                  <div className="flex flex-wrap gap-2">
                    {lead.serviceNeeds.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-50 text-xs rounded-full font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-1.5 p-4 border-t border-gray-500/[0.1]">
                <span className="text-xs text-gray-500">Est. Value:</span>
                <span className="text-sm font-bold text-gray-900">
                  ${lead?.value.toLocaleString()}
                </span>
              </div>
          </div>
        ))}
          
        </div>

        <div className="md:w-[35%] w-full p-4 flex flex-col mb-6 bg-white">
            <h1 className="mb-2 font-medium uppercase">Activities</h1>
        </div>
      </div>
  )
}

export default Dashboardpage