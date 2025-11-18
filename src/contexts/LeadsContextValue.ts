import { createContext } from "react";

export interface Lead {
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    location: string;
    status: "new" | "contacted" | "qualified" | "negotiating" | "won" | "lost";
    value: number;
    industry: string;
    score: number;
    addedDate: string;
    userId: string;
    // Social media fields (optional - from Apollo.io)
    linkedinUrl?: string;
    twitterUrl?: string;
    facebookUrl?: string;
    companyWebsite?: string;
    companyLinkedin?: string;
    companyTwitter?: string;
    companyFacebook?: string;
}

export type LeadsContextValue = {
    leads: Lead[];
    loading: boolean;
    error: string | null;
    addLead: (lead: Omit<Lead, 'id' | 'userId' | 'addedDate'>) => Promise<void>;
    updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
    deleteLead: (id: string) => Promise<void>;
    refreshLeads: () => Promise<void>;
}

export const LeadsContext = createContext({} as LeadsContextValue);
