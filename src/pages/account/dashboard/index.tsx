import { useContext } from "react"
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import "../../../assets/css/react-calendar.css"
// import { AuthContext } from "../../../contexts/AuthContextValue";
import { useNavigate } from "react-router-dom";
import { Bookmark, Buildings, MapPoint, Star } from "@solar-icons/react";
import type { Timestamp } from "firebase/firestore";

function Dashboardpage() {
  const { leads } = useContext(LeadsContext);
  // const { user } = useContext(AuthContext)
  const navigate = useNavigate();
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 font-semibold";
    if (score >= 70) return "text-orange-600 font-medium";
    return "text-gray-600";
  };

  return (
      <div className="flex md:flex-row flex-col gap-4 md:p-4 h-full">

        <div className="md:w-[65%] w-full p-4 flex flex-col gap-4 mb-6 md:border border-gray-500/[0.09] bg-slate-100/[0.1] md:rounded-lg">
          <div>
            <h1 className="mb-2 font-semibold uppercase">Discover</h1>
            <p className="text-gray-600">Find clients based on your specialization:</p>
          </div>

        {leads?.map((lead) => (
          <div
            key={lead?.id}
            className="bg-white border border-gray-200/[0.2] rounded-xl transition-all duration-300 overflow-hidden cursor-pointer group"
            onClick={() => navigate(`/account/leads/${lead?.id}`)}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-slate-100/[0.3] rounded-full flex items-center justify-center font-bold flex-shrink-0 border border-gray-500/[0.1]">
                    {lead?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold truncate">
                        {lead?.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                        <Star size={14} className="text-yellow-500" weight="Bold" />
                        <span className={`text-xs font-medium ${getScoreColor(lead?.score)}`}>
                          {lead?.score}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Buildings size={16} className="flex-shrink-0" />
                      <span className="font-medium">{lead?.company}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">{lead?.industry}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPoint size={14} />
                      <span>{lead?.location}</span>
                    </div>
                  </div>
                  
                  <button className="opacity-75 hover:opacity-100"><Bookmark size={20} /></button>
                </div>
              </div>


              {/* Service Needs (if available) */}
              {lead?.serviceNeeds && lead.serviceNeeds.length > 0 && (
                <div className="mb-4 flex items-center gap-2">
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
              <div className="flex items-center justify-between pt-4 border-t border-gray-500/[0.1]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">Value:</span>
                    <span className="text-sm font-bold text-gray-900">
                      ${lead?.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
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
              </div>
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