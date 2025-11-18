'use client'
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { type ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from "../customHooks/useLocaStorage";
import { app } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "./AuthContextValue";
import Toast from "../components/toast/Toast";

const auth = getAuth(app)

const AuthProvider = ({ children }: { children: ReactNode}) => {
    const [user, setUser] = useLocalStorage("user", null);
    const [popup, setPopup] = useState<{ type: string; msg: string; timestamp?: number }>({ type: "", msg: "" });
    const [loading, setLoading] = useState(false);
    const router = useNavigate()

    const formatError = (msg: string) => {
        // Examples we want to convert:
        // "Firebase: Error (auth/wrong-password)." -> "wrong password"
        // "Firebase: Error (user-not-found)" -> "user not found"
        // Approach: remove the Firebase prefix and surrounding parentheses/dot,
        // strip any leading "auth/", then replace hyphens with spaces.
        const cleaned = msg
            .replace(/^Firebase: Error \(/i, '') // remove prefix
            .replace(/\).*$/, '') // remove trailing ')' and anything after
            .replace(/^auth\//, ''); // remove auth/ namespace if present

        return cleaned.replace(/-/g, ' ').trim();
    }

    const login = async (email: string, password: string, _rememberMe?: boolean, callbackUrl?: string) => {
        setLoading(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            setUser(res.user);
            setPopup({ type: "success", msg: "Login Successful", timestamp: Date.now() });
            router(callbackUrl ? callbackUrl : "/account");
        } catch (error: unknown) {
            // Prefer FirebaseError when available, otherwise fall back to stringifying the error
            const message = error instanceof FirebaseError ? error.message : String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
        } finally {
            setLoading(false);
        }
    }

    const signUp = async (data: { email: string, password: string }) => {
        setLoading(true);
        try {
            // Create the user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
            const firebaseUser = userCredential.user;
            setUser(firebaseUser);
            setPopup({ type: "success", msg: "Signup Successful, Please login to continue", timestamp: Date.now() });
            router("/login");
        } catch (error: unknown) {
            const message = error instanceof FirebaseError ? error.message : String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
        } finally {
            setLoading(false);
        }
    }
    
    const sociallogin = async (callbackUrl?: string) => {
        setLoading(true)
        try {
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            const firebaseUser = userCredential.user;
            setUser(firebaseUser);
            setPopup({ type: "success", msg: "Login Successful", timestamp: Date.now() });
            setLoading(false);
            router(callbackUrl ? callbackUrl : "/account");
        } catch (error: unknown) {
            // Prefer FirebaseError when available, otherwise fall back to stringifying the error
            const message = error instanceof FirebaseError ? error.message : String(error);
            setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() });
            setLoading(false);
        }
    }

    const logOut = () => {
        signOut(auth)
                .then(() => {
                        setPopup({ type: "success", msg:  "Logout Successful", timestamp: Date.now() })
                    }).catch((error: unknown) => {
                        const message = error instanceof FirebaseError ? error.message : String(error);
                        setPopup({ type: "error", msg: formatError(message), timestamp: Date.now() })
                    });
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user)
        })
    }, [setUser]);

    return (
        <AuthContext.Provider value={{ user, loading, popup, login, signUp, sociallogin, logOut }}>
            <Toast
              message={popup?.msg} 
              type={popup?.type as "error" | "success"} 
              timestamp={popup?.timestamp}
            />
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;