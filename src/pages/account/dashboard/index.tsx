import { useContext, useEffect, useState, useCallback } from "react"
import { UserProfileContext } from "../../../contexts/UserProfileContextValue";
import "../../../assets/css/react-calendar.css"
import { useNavigate } from "react-router-dom";
import { Bookmark, Buildings, MapPoint, Star } from "@solar-icons/react";
import { AuthContext } from "../../../contexts/AuthContextValue";
import SkeletonLoader from "../../../components/skeletonLoader/SkeletonLoader";

interface GeneratedLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  companyWebsite: string;
  industry: string;
  score: number;
  serviceNeeds: string[];
  value: number;
  addedDate: string;
}

interface ApolloOrganization {
  id?: string;
  name?: string;
  primary_email?: string;
  phone?: string;
  primary_phone?: string;
  website_url?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  estimated_num_employees?: number;
  linkedin_url?: string;
}

function Dashboardpage() {
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [generatedLeads, setGeneratedLeads] = useState<GeneratedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold";
    if (score >= 70) return "text-orange-600 font-medium";
    return "text-gray-600";
  };

  const calculateScore = useCallback((org: ApolloOrganization): number => {
    let score = 50;
    
    if (org.phone || org.primary_phone) score += 15;
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
        // Determine search term based on user's specialty
        const searchTerm = profile.specialty || 'businesses';
        
        console.log('🔍 Generating dashboard leads for:', searchTerm);

        // Call Apollo discover API
        const response = await fetch('/api/apollo/discover', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            searchTerm,
            location: 'United States',
            page: 1,
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
          
          return {
            id: org.id || `generated-${index}`,
            name: 'Contact',
            company: org.name || 'Unknown Company',
            email: org.primary_email || '',
            phone: org.phone || org.primary_phone || '',
            location: formatLocation(org),
            companyWebsite: org.website_url || '',
            industry: org.industry || profile.specialty || 'General',
            score,
            serviceNeeds,
            value: estimateValue(serviceNeeds, score),
            addedDate: new Date().toISOString()
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
  }, [user?.uid, profile, calculateScore, determineServiceNeeds, estimateValue, formatLocation]);

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

        {!loading && generatedLeads.map((lead) => (
          <div
            key={lead?.id}
            className="bg-white border border-gray-200/[0.2] rounded-xl transition-all duration-300 overflow-hidden cursor-pointer group hover:shadow-md"
            onClick={() => navigate(`/account/feeds`)}
          >
              {/* Header */}
              <div className="flex items-start gap-4 p-4">
                <div className="w-12 h-12 bg-slate-100/[0.3] rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-gray-500/[0.1]">
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
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPoint size={14} />
                    <span>{lead?.location}</span>
                  </div>
                </div>
                
                <button className="opacity-75 hover:opacity-100"><Bookmark size={20} /></button>
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