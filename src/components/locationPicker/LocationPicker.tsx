import { useState } from "react";
import { MapPoint } from "@solar-icons/react";
import { useOutsideClick } from "../../customHooks/useOutsideClick";

interface LocationPickerProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

const LocationPicker = ({ selectedLocation, onLocationChange }: LocationPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(selectedLocation || "");
    const popupRef = useOutsideClick(() => setIsOpen(false), false);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            onLocationChange(value);
            setIsOpen(false);
        }
    }

    return (
        <div className="relative">
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 p-2 rounded-full border border-gray/[0.1] hover:bg-gray-50 transition-colors text-sm"
        >
            <MapPoint size={18} className="" />
        </button>

        {isOpen && (
            <div
            ref={popupRef}
            className="absolute top-full left-0 mt-2 w-80 bg-background border border-gray/[0.2] rounded-xl shadow-xl z-50 max-h-96 overflow-hidden flex flex-col"
            >
            {/* Header */}
            <div className="flex items-center px-4 gap-2 border-b border-gray/[0.2]">
                <MapPoint size={16} />
                <input
                type="text"
                placeholder="Type location..."
                value={value}
                onBlur={() => onLocationChange(value)}
                onKeyUp={(e) => handleKey(e)}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-lg py-4 text-sm focus:outline-none"
                />
            </div>
            </div>
        )}
        </div>
    );
};

export default LocationPicker;
