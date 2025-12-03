// User Profile Interface
export interface UserProfile {
  uid: string;
  
  // Basic Info
  email: string;
  fullName: string;
  company?: string;
  
  // Professional Details
  bio?: string;
  jobTitle?: string;
  yearsOfExperience?: number;
  
  // Expertise & Services
  primaryServices: string[]; // e.g., ['Website Design', 'SEO', 'Mobile Apps']
  industries: string[]; // Industries they specialize in
  
  // Previous Work
  previousClients: Array<{
    companyName: string;
    industry: string;
    projectType: string;
    year: number;
  }>;
  
  // Portfolio
  portfolioWebsites?: string[];
  
  // Target Market
  targetCompanySize: ('1-10' | '11-50' | '51-200' | '200+')[]; // Which company sizes they prefer
  targetBudgetRange: string; // e.g., "$5K-$20K"
  preferredLocations: string[]; // Preferred locations to work with
  
  // Lead Preferences
  leadPreferences?: {
    preferPersonalEmails: boolean;
    minimumScore: number;
    mustHaveWebsite: boolean;
    excludeIndustries: string[];
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface PreviousWork {
  companyName: string;
  industry: string;
  projectType: string;
  year: number;
}
