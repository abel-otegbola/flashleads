import { useContext, useState } from "react"
import { LeadsContext } from "../../../contexts/LeadsContextValue";
import { AltArrowLeft, AltArrowRight, HandMoney, Letter } from "@solar-icons/react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import Calendar from "react-calendar";
import "../../../assets/css/react-calendar.css"

function Dashboardpage() {
  const { leads } = useContext(LeadsContext);
  const [dateRange, setDateRange] = useState<[string, string]>(["Sat Nov 22 2025 00:00:00 GMT+0100 (West Africa Standard Time)", "Sun Nov 23 2025 23:59:59 GMT+0100 (West Africa Standard Time)"]);

  const data = [
  {
    name: '13th',
    uv: 2000,
  },
  {
    name: '14th',
    uv: 1500,
  },
  {
    name: '15th',
    uv: 2000,
  },
  {
    name: '16th',
    uv: 1780,
  },
  {
    name: '17th',
    uv: 1890,
  },
  {
    name: '18th',
    uv: 2390,
  },
  {
    name: '19th',
    uv: 1800,
  },
  {
    name: '20th',
    uv: 1500,
  },
  {
    name: '21st',
    uv: 2000,
  },
  {
    name: '22nd',
    uv: 2780,
  },
  {
    name: '23rd',
    uv: 1590,
  },
  {
    name: '24th',
    uv: 2390,
  },
];

  return (
    <div className="p-4">
      <div className="flex gap-4">

        <div className="md:w-[65%] w-full flex flex-col gap-4 mb-6">
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">

            <div className="bg-white border border-gray-500/[0.2] rounded-lg p-4">
              <p className="flex items-center justify-between gap-2 text-[12px] opacity-[0.5] mb-1">
                Total Leads
                <span className="py-[8px] px-2 rounded leading-0 text-[9px] bg-green/[0.4]">+8</span>
              </p>
              <div className="flex items-end justify-between gap-2 font-medium">
                <p className=" text-2xl">{leads.length}</p>
                <p className="opacity-[0.5] text-[10px]">+10 vs last week</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-500/[0.2] rounded-lg p-4">
              <p className="flex items-center justify-between gap-2 text-[12px] opacity-[0.5] mb-1">
                Conversion Rate
                <span className="py-[8px] px-2 rounded leading-0 text-[9px] bg-green/[0.4]">+8</span>
              </p>
              <div className="flex items-end justify-between gap-2 font-medium">
                <p className=" text-2xl">{( leads.filter(l => l.status === "conversation").length / leads.length) * 100}%</p>
                <p className="opacity-[0.5] text-[10px]">+10 vs last week</p>
              </div>
            </div>
            <div className="bg-white border border-gray-500/[0.2] rounded-lg p-4">
              <p className="flex items-start justify-between gap-2 text-[12px] opacity-[0.5] mb-1">In Conversation</p>
              <p className="text-2xl font-medium">{leads.filter(l => l.status === "conversation").length}</p>
            </div>

          </div>
          
          <div className="bg-white rounded-lg border border-gray-500/[0.2] bg-white">
            <p className="text-sm px-4 py-4 text-gray-500 mb-2 flex items-center gap-2">
              <span className='p-2 border border-gray-500/[0.1] rounded bg-gray-200/[0.05] font-semibold'><HandMoney /> </span> 
              Revenue
            </p>
            <div className="p-4">
              <AreaChart
                style={{ width: '100%', maxWidth: '700px', maxHeight: '50vh', aspectRatio: 1.618 }}
                responsive
                data={data}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <defs>
                  <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#8884d890" stopOpacity={1} />
                    <stop offset="1" stopColor="#ffffff00" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="uv" strokeWidth={2} stroke="#111" fill="url(#splitColor)" />
              </AreaChart>
            </div>
          </div>
        </div>

        <div className="md:w-[35%] w-full flex flex-col mb-6 bg-white border border-gray-500/[0.2] rounded-lg">
          <p className="text-sm text-gray-500 flex items-center gap-2 p-3">
            <span className='p-2 border border-gray-500/[0.1] rounded bg-gray-200/[0.05] font-semibold'><Letter /> </span> 
            Calendar
          </p>
          <Calendar
              defaultValue={dateRange}
              selectRange={true}
              onChange={(value) => {
                  if (Array.isArray(value) && value[0] && value[1]) {
                      setDateRange([
                          value[0].toString(),
                          value[1].toString()
                      ]);
                  }
              }}
              nextLabel={<AltArrowRight color="#fff" size={20} />}
              prevLabel={<AltArrowLeft color="#fff" size={20} />}
          />
          <div className="flex flex-col gap-4 p-4" >
            <div className="flex flex-col gap-2 p-2 rounded">
              <p>{new Date(dateRange[0]).toLocaleString()}</p>
              <div className="w-full">
                {leads.filter(lead => {
                  const leadDate = new Date(lead.addedDate);
                  const startDate = new Date(dateRange[0]);
                  const endDate = new Date(dateRange[1]);
                  return leadDate >= startDate && leadDate <= endDate;
                }).slice(0, 3).map(filteredLead => (
                  <div key={filteredLead.id} className="p-2 border border-gray-500/[0.1] rounded">
                    <p className="font-medium">{filteredLead.name}</p>
                    <p className="text-sm opacity-[0.7]">{filteredLead.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboardpage