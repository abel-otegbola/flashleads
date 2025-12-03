// User Profile Context and Management
import { createContext } from 'react';
import type { UserProfile } from '../interface/userProfile';

export interface UserProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  
  // Profile management
  createProfile: (profile: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  getProfile: (userId: string) => Promise<UserProfile | null>;
  
  // Profile checks
  hasCompletedProfile: () => boolean;
  getRecommendedIndustries: () => string[];
  getRecommendedServices: () => string[];
}

export const UserProfileContext = createContext({} as UserProfileContextValue);
