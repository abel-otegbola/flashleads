import { createContext } from "react";
import { type IUser } from "../interface/auth";

export type values = {
    user: IUser;
    loading: boolean;
    popup: { type: string; msg: string; timestamp?: number } | null;
    login: (email: string, password: string, rememberMe?: boolean, callbackUrl?: string) => Promise<void>;
    signUp: (data: { email: string, password: string, fullname: string, specialty?: string }) => Promise<void>;
    sociallogin: (callbackUrl?: string) => Promise<void>;
    logOut: () => void;
    forgotPassword: (email: string) => Promise<void>;
    verifyOtp: (otp: string) => Promise<void>;
    resetPassword: (password: string) => Promise<void>;
    updateUser: (data: { email?: string, password?: string, fullname?: string, specialty?: string, bio?: string, photoURL?: string, username?: string, status?: string }) => Promise<void>;
    deleteAccount: (password: string) => Promise<void>;
}

export const AuthContext = createContext({} as values);
