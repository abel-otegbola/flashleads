'use client'
import { type ReactNode, useEffect, useState, useContext } from 'react';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { FirebaseError } from "firebase/app";
import { app } from "../firebase/firebase";
import { AuthContext } from "./AuthContextValue";
import { LeadsContext, type Lead } from "./LeadsContextValue";

const db = getFirestore(app);

const LeadsProvider = ({ children }: { children: ReactNode }) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useContext(AuthContext);

    // Fetch leads for the current user
    const refreshLeads = async () => {
        if (!user?.id) {
            setLeads([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const leadsRef = collection(db, 'leads');
            const q = query(leadsRef, where('userId', '==', user.id));
            const querySnapshot = await getDocs(q);

            const fetchedLeads: Lead[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedLeads.push({
                    id: doc.id,
                    name: data.name,
                    company: data.company,
                    email: data.email,
                    phone: data.phone,
                    location: data.location,
                    status: data.status,
                    value: data.value,
                    industry: data.industry,
                    score: data.score,
                    addedDate: data.addedDate?.toDate?.()?.toISOString() || data.addedDate,
                    userId: data.userId
                });
            });

            setLeads(fetchedLeads);
        } catch (err: unknown) {
            const message = err instanceof FirebaseError ? err.message : String(err);
            setError(message);
            console.error('Error fetching leads:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add a new lead
    const addLead = async (leadData: Omit<Lead, 'id' | 'userId' | 'addedDate'>) => {
        if (!user?.id) {
            setError('User must be logged in to add leads');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const leadsRef = collection(db, 'leads');
            const newLead = {
                ...leadData,
                userId: user.id,
                addedDate: Timestamp.now()
            };

            const docRef = await addDoc(leadsRef, newLead);

            // Add to local state
            const addedLead: Lead = {
                ...leadData,
                id: docRef.id,
                userId: user.id,
                addedDate: new Date().toISOString()
            };

            setLeads(prev => [...prev, addedLead]);
        } catch (err: unknown) {
            const message = err instanceof FirebaseError ? err.message : String(err);
            setError(message);
            console.error('Error adding lead:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update an existing lead
    const updateLead = async (id: string, updates: Partial<Lead>) => {
        if (!user?.id) {
            setError('User must be logged in to update leads');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const leadRef = doc(db, 'leads', id);
            await updateDoc(leadRef, updates);

            // Update local state
            setLeads(prev => 
                prev.map(lead => 
                    lead.id === id ? { ...lead, ...updates } : lead
                )
            );
        } catch (err: unknown) {
            const message = err instanceof FirebaseError ? err.message : String(err);
            setError(message);
            console.error('Error updating lead:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete a lead
    const deleteLead = async (id: string) => {
        if (!user?.id) {
            setError('User must be logged in to delete leads');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const leadRef = doc(db, 'leads', id);
            await deleteDoc(leadRef);

            // Remove from local state
            setLeads(prev => prev.filter(lead => lead.id !== id));
        } catch (err: unknown) {
            const message = err instanceof FirebaseError ? err.message : String(err);
            setError(message);
            console.error('Error deleting lead:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Fetch leads when user changes
    useEffect(() => {
        if (user?.id) {
            refreshLeads();
        } else {
            setLeads([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    return (
        <LeadsContext.Provider value={{ 
            leads, 
            loading, 
            error, 
            addLead, 
            updateLead, 
            deleteLead, 
            refreshLeads 
        }}>
            {children}
        </LeadsContext.Provider>
    );
}

export default LeadsProvider;
