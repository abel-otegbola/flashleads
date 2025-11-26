import { useContext } from "react"
import { LeadsContext } from "../../../contexts/LeadsContextValue";

function Dashboardpage() {
  const { leads } = useContext(LeadsContext);

  return (
    <div className="p-4">
      <div className="flex gap-4">

        <div className="md:w-[60%] w-full flex flex-col gap-4 mb-6">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">

            <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
              <p className="flex items-center justify-between gap-2 text-[12px] opacity-[0.5] mb-1">
                Total Leads
                <span className="py-[8px] px-2 rounded leading-0 text-[9px] bg-green/[0.2]">+8</span>
              </p>
              <div className="flex items-end justify-between gap-2 font-medium">
                <p className=" text-2xl">{leads.length}</p>
                <p className="opacity-[0.5] text-[10px]">+10 vs last week</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
              <p className="flex items-center justify-between gap-2 text-[12px] opacity-[0.5] mb-1">
                Conversion Rate
                <span className="py-[8px] px-2 rounded leading-0 text-[9px] bg-green/[0.2]">+8</span>
              </p>
              <div className="flex items-end justify-between gap-2 font-medium">
                <p className=" text-2xl">{( leads.filter(l => l.status === "conversation").length / leads.length) * 100}%</p>
                <p className="opacity-[0.5] text-[10px]">+10 vs last week</p>
              </div>
            </div>
            <div className="bg-white border border-gray-200/[0.2] rounded-lg p-4">
              <p className="flex items-start justify-between gap-2 text-[12px] opacity-[0.5] mb-1">In Conversation</p>
              <p className="text-2xl font-medium">{leads.filter(l => l.status === "conversation").length}</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboardpage