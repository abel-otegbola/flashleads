// User Profile Interface
export interface UserProfile {
  uid: string;
  
  // Basic Info
  email: string;
  fullName: string;
  username?: string;
  specialty?: string; // User's freelancing specialty
  company?: string;
  bio?: string;
  photoURL?: string;
  status?: string;
  
  // Portfolio
  portfolio?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  companyName: string;
  industry: string;
  projectType: string;
  year: number;
}
