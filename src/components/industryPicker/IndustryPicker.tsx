import { useState, useMemo } from "react";
import { Buildings } from "@solar-icons/react";
import { useOutsideClick } from "../../customHooks/useOutsideClick";
import { categoryApolloFilters, FREELANCING_SPECIALTIES } from "../../constants/specialties";

interface IndustryPickerProps {
  selectedIndustry: string;
  specialty?: string;
  onIndustryChange: (industry: string) => void;
}

const IndustryPicker = ({ selectedIndustry, specialty, onIndustryChange }: IndustryPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const popupRef = useOutsideClick(() => setIsOpen(false), false);

  // Map industries based on specialty category
  const availableIndustries = useMemo(() => {
    if (!specialty) return [];
    
    const specialtyData = FREELANCING_SPECIALTIES.find(
      s => s.label === specialty
    );
    const category = specialtyData?.category;
    const filters = categoryApolloFilters[category || ""];
    return filters?.industries || [];
  }, [specialty]);

  const filteredIndustries = availableIndustries.filter((industry) =>
    industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (value: string) => {
    onIndustryChange(value);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2  gap-2 p-2 rounded-full border border-gray-500/[0.1] hover:bg-gray-50 transition-colors text-sm"
      >
        <Buildings size={18} className="" />
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-500/[0.2] rounded-xl shadow-xl z-50 max-h-96 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 border-b border-gray-500/[0.2]">
            <Buildings size={16} />
            <input
              type="text"
              placeholder="Search industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-4 text-sm focus:outline-none"
            />
          </div>

          {/* Industry List */}
          <div className="overflow-y-auto flex-1">
            {/* All Industries Option */}
            <button
              onClick={() => handleSelect("")}
              className={`w-full text-left px-4 py-2 text-[12px] hover:bg-gray-50 transition-colors border-b border-gray-500/[0.1] ${
                selectedIndustry === "" ? "bg-primary/5 text-primary font-medium" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>All Industries</span>
              </div>
            </button>

            {filteredIndustries.length > 0 ? (
              filteredIndustries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => handleSelect(industry)}
                  className={`w-full text-left px-4 py-2 text-[12px] font-medium hover:bg-gray-50 transition-colors border-b border-gray-500/[0.1] last:border-b-0 ${
                    selectedIndustry === industry ? "bg-primary/5 text-primary font-medium" : "text-gray-700"
                  }`}
                >
                    <span>{industry}</span>
                </button>
              ))
            ) : searchQuery ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No industries found
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustryPicker;
