import { createContext } from "react";
import { type IUser } from "../interface/auth";

export type values = {
    user: IUser;
    loading: boolean;
    popup: { type: string; msg: string; timestamp?: number } | null;
    login: (email: string, password: string, rememberMe?: boolean, callbackUrl?: string) => Promise<void>;
    signUp: (data: { email: string, password: string, fullname: string, role: string, storename?: string }) => Promise<void>;
    sociallogin: (callbackUrl?: string) => Promise<void>;
    logOut: () => void;
}

export const AuthContext = createContext({} as values);
