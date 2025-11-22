import { useState } from "react";
import { Magnifer } from "@solar-icons/react";

interface Props {
  placeholder?: string;
}

export default function SearchBar({ placeholder = "Search..." }: Props) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center relative w-full border border-gray-100/[0.5] rounded-lg pl-2">
      <Magnifer size={16} color="currentColor" />
      <input
        className="w-full p-2 bg-transparent rounded-lg outline-none"
        placeholder={placeholder}
        value={query}
        onChange={(e) => {setQuery(e.target.value); console.log("Input changed:", e.target.value); }}
      />
    </div>
  );
}