import { useContext, useEffect, useState } from "react"
import { UserProfileContext } from "../../../contexts/UserProfileContextValue";
import "../../../assets/css/react-calendar.css"
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Buildings, MapPoint, Star } from "@solar-icons/react";
import { AuthContext } from "../../../contexts/AuthContextValue";
import SkeletonLoader from "../../../components/skeletonLoader/SkeletonLoader";
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import Button from "../../../components/button/Button";
import { generateDashboardLeads, type GeneratedLead } from "../../../helpers/leadGenerator";
import { categoryApolloFilters, FREELANCING_SPECIALTIES } from "../../../constants/specialties";
import LocationPicker from "../../../components/locationPicker/LocationPicker";
import IndustryPicker from "../../../components/industryPicker/IndustryPicker";

function Dashboardpage() {
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);
  const { addLead } = useContext(LeadsContext);
  const navigate = useNavigate();
  const [generatedLeads, setGeneratedLeads] = useState<GeneratedLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>('United States');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  
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

  // Generate leads when dashboard opens or search parameters change
  useEffect(() => {
    const fetchLeads = async () => {
      if (!user?.uid || !profile?.specialty) return;

      setLoading(true);
      setError(null);

      try {
        const specialtyData = FREELANCING_SPECIALTIES.find(
          s => s.label === profile.specialty
        );

        const category = specialtyData?.category;

        const filters = categoryApolloFilters[category || ""] || { industries: [], jobTitles: [], companySize: [], signals: [] };

        // Use selected industry or pick random ones
        const industries = selectedIndustry 
          ? [selectedIndustry]
          : filters.industries
              ?.sort(() => 0.5 - Math.random())
              .slice(0, 3) || [];

        const titles =
          filters.jobTitles
            ?.sort(() => 0.5 - Math.random())
            .slice(0, 2) || [];

        const randomPage = Math.floor(Math.random() * 5) + 1;

        const leads = await generateDashboardLeads({
          searchTerm: searchTerm !== "" ? searchTerm : profile.specialty,
          specialty: profile.specialty,
          industries,
          titles,
          companySize: filters.companySize || ["1-10", "11-50"],
          location: selectedLocation,
          page: randomPage,
          perPage: 5
        });

        setGeneratedLeads(leads);
      } catch (err) {
        console.error("Error generating dashboard leads:", err);
        setError(err instanceof Error ? err.message : "Failed to generate leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [user?.uid, profile?.specialty, searchTerm, selectedLocation, selectedIndustry]);

  return (
      <div className="flex md:flex-row flex-col gap-4 md:p-4 h-full">

        <div className="md:w-[65%] w-full p-4 flex flex-col gap-4 mb-6 md:border border-gray-500/[0.09] bg-slate-100/[0.1] md:rounded-lg">
          <div>
            <h1 className="mb-2 font-semibold uppercase">Discover</h1>
            <p className="text-gray-600">Leads based on your specialization:</p>
          </div>
          
        <div className="flex flex-col gap-3 p-4 shadow-[4px_4px_20px_#0000000A] rounded-[20px] border border-gray-500/[0.1] bg-white">
          <div className="flex items-start gap-2">
            <Link to="/account" className="w-10 h-10 rounded-full bg-primary/[0.2] border border-gray-500/[0.2] flex items-center justify-center font-semibold flex-shrink-0">
              <img src={user?.photoURL || profile?.photoURL || "/profile.jpg"} width={40} height={40} className="rounded-full" alt="Profile" />
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <button className="px-2 py-[2px] text-[10px] leading-[14px] bg-slate-100/[0.4] rounded font-semibold">{selectedLocation}</button>
                <button className="px-2 py-[2px] text-[10px] leading-[14px] bg-slate-100/[0.4] rounded font-semibold">{selectedIndustry}</button>
              </div>
              <textarea 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="py-2 flex-1 border-none outline-none text-semibold resize-none" 
                placeholder="Customize your client search here..."
                rows={2}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-between gap-2 items-center">
            <div className="flex gap-2 items-center">
              <LocationPicker 
                selectedLocation={selectedLocation}
                onLocationChange={setSelectedLocation}
              />
              
              <IndustryPicker 
                selectedIndustry={selectedIndustry}
                specialty={profile?.specialty}
                onIndustryChange={setSelectedIndustry}
              />
            </div>
            
            <Button 
              onClick={() => setSearchTerm(searchQuery || profile?.specialty || '')}
              className="px-6 py-2 rounded-lg text-white hover:bg-primary-dark text-sm font-medium"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <p className="font-semibold opacity-[0.5]">Current search: <span className="underline">{searchTerm || profile?.specialty}</span></p>
          <p className="text-xs text-gray-500">{selectedLocation} {selectedIndustry && `• ${selectedIndustry}`}</p>
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
                    <div className="flex items-center flex-wrap gap-2 mt-2">
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