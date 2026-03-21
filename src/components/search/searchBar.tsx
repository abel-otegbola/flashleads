import { useState } from "react";
import { Magnifer } from "@solar-icons/react";

interface Props {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ placeholder = "Search...", onChange }: Props) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center relative w-full border border-gray/[0.3] rounded-lg pl-4">
      <Magnifer size={16} color="currentColor" />
      <input
        className="w-full p-2 bg-transparent rounded-lg outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {setQuery(e.target.value); if (onChange) onChange(e); }}
      />
    </div>
  );
}