'use client'
import { type ReactNode, useEffect, useState, useContext, useCallback } from 'react';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { FirebaseError } from "firebase/app";
import { app } from "../firebase/firebase";
import { AuthContext } from "./AuthContextValue";
import { ClientsContext, type ClientsContextValue, type Client, type Project, type Milestone, type Invoice, type Estimate, type Email } from "./ClientsContextValue";

const db = getFirestore(app);

const ClientsProvider = ({ children }: { children: ReactNode }) => {
    // State for all entities
    const [clients, setClients] = useState<Client[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [estimates, setEstimates] = useState<Estimate[]>([]);
    const [emails, setEmails] = useState<Email[]>([]);
    
    // Loading states
    const [clientsLoading, setClientsLoading] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [milestonesLoading, setMilestonesLoading] = useState(false);
    const [invoicesLoading, setInvoicesLoading] = useState(false);
    const [estimatesLoading, setEstimatesLoading] = useState(false);
    const [emailsLoading, setEmailsLoading] = useState(false);
    
    const { user } = useContext(AuthContext);

    // ==================== CLIENTS ====================
    
    const refreshClients = async () => {
        if (!user?.uid) return;
        
        setClientsLoading(true);
        try {
            const q = query(
                collection(db, 'clients'),
                where('userId', '==', user.uid)
            );
            
            const querySnapshot = await getDocs(q);
            const clientsData: Client[] = [];
            
            querySnapshot.forEach((doc) => {
                clientsData.push({ id: doc.id, ...doc.data() } as Client);
            });
            
            setClients(clientsData);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error fetching clients:', error.message);
            }
        } finally {
            setClientsLoading(false);
        }
    };

    const addClient = async (clientData: Omit<Client, 'id' | 'userId' | 'addedDate'>) => {
        if (!user?.uid) return;
        
        setClientsLoading(true);
        try {
            const newClient = {
                ...clientData,
                userId: user.uid,
                addedDate: new Date().toISOString(),
            };
            
            const docRef = await addDoc(collection(db, 'clients'), newClient);
            setClients(prev => [...prev, { id: docRef.id, ...newClient }]);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error adding client:', error.message);
                throw error;
            }
        } finally {
            setClientsLoading(false);
        }
    };

    const updateClient = async (id: string, updates: Partial<Client>) => {
        setClientsLoading(true);
        try {
            const clientRef = doc(db, 'clients', id);
            await updateDoc(clientRef, updates);
            
            setClients(prev =>
                prev.map(client =>
                    client.id === id ? { ...client, ...updates } : client
                )
            );
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error updating client:', error.message);
                throw error;
            }
        } finally {
            setClientsLoading(false);
        }
    };

    const deleteClient = async (id: string) => {
        if (!user?.uid) return;
        
        setClientsLoading(true);
        try {
            const clientRef = doc(db, 'clients', id);
            await deleteDoc(clientRef);
            
            setClients(prev => prev.filter(client => client.id !== id));
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error deleting client:', error.message);
                throw error;
            }
        } finally {
            setClientsLoading(false);
        }
    };

    // ==================== PROJECTS ====================
    
    const refreshProjects = async () => {
        if (!user?.uid) return;
        
        setProjectsLoading(true);
        try {
            const q = query(
                collection(db, 'projects'),
                where('userId', '==', user.uid)
            );
            
            const querySnapshot = await getDocs(q);
            const projectsData: Project[] = [];
            
            querySnapshot.forEach((doc) => {
                projectsData.push({ id: doc.id, ...doc.data() } as Project);
            });
            
            setProjects(projectsData);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error fetching projects:', error.message);
            }
        } finally {
            setProjectsLoading(false);
        }
    };

    const addProject = async (projectData: Omit<Project, 'id' | 'userId' | 'createdDate'>) => {
        if (!user?.uid) return;
        
        setProjectsLoading(true);
        try {
            const newProject = {
                ...projectData,
                userId: user.uid,
                createdDate: new Date().toISOString(),
            };
            
            const docRef = await addDoc(collection(db, 'projects'), newProject);
            setProjects(prev => [...prev, { id: docRef.id, ...newProject }]);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error adding project:', error.message);
                throw error;
            }
        } finally {
            setProjectsLoading(false);
        }
    };

    const updateProject = async (id: string, updates: Partial<Project>) => {
        setProjectsLoading(true);
        try {
            const projectRef = doc(db, 'projects', id);
            await updateDoc(projectRef, updates);
            
            setProjects(prev =>
                prev.map(project =>
                    project.id === id ? { ...project, ...updates } : project
                )
            );
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error updating project:', error.message);
                throw error;
            }
        } finally {
            setProjectsLoading(false);
        }
    };

    const deleteProject = async (id: string) => {
        setProjectsLoading(true);
        try {
            const projectRef = doc(db, 'projects', id);
            await deleteDoc(projectRef);
            
            setProjects(prev => prev.filter(project => project.id !== id));
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error deleting project:', error.message);
                throw error;
            }
        } finally {
            setProjectsLoading(false);
        }
    };

    const getClientProjects = (clientId: string): Project[] => {
        return projects.filter(project => project.clientId === clientId);
    };

    // ==================== MILESTONES ====================
    
    const refreshMilestones = async () => {
        if (!user?.uid) return;
        
        setMilestonesLoading(true);
        try {
            const q = query(
                collection(db, 'milestones'),
                where('userId', '==', user.uid)
            );
            
            const querySnapshot = await getDocs(q);
            const milestonesData: Milestone[] = [];
            
            querySnapshot.forEach((doc) => {
                milestonesData.push({ id: doc.id, ...doc.data() } as Milestone);
            });
            
            setMilestones(milestonesData);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error fetching milestones:', error.message);
            }
        } finally {
            setMilestonesLoading(false);
        }
    };

    const addMilestone = async (milestoneData: Omit<Milestone, 'id' | 'userId' | 'createdDate'>) => {
        if (!user?.uid) return;
        
        setMilestonesLoading(true);
        try {
            const newMilestone = {
                ...milestoneData,
                userId: user.uid,
                createdDate: new Date().toISOString(),
            };
            
            const docRef = await addDoc(collection(db, 'milestones'), newMilestone);
            setMilestones(prev => [...prev, { id: docRef.id, ...newMilestone }]);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error adding milestone:', error.message);
                throw error;
            }
        } finally {
            setMilestonesLoading(false);
        }
    };

    const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
        setMilestonesLoading(true);
        try {
            const milestoneRef = doc(db, 'milestones', id);
            await updateDoc(milestoneRef, updates);
            
            setMilestones(prev =>
                prev.map(milestone =>
                    milestone.id === id ? { ...milestone, ...updates } : milestone
                )
            );
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error updating milestone:', error.message);
                throw error;
            }
        } finally {
            setMilestonesLoading(false);
        }
    };

    const deleteMilestone = async (id: string) => {
        setMilestonesLoading(true);
        try {
            const milestoneRef = doc(db, 'milestones', id);
            await deleteDoc(milestoneRef);
            
            setMilestones(prev => prev.filter(milestone => milestone.id !== id));
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error deleting milestone:', error.message);
                throw error;
            }
        } finally {
            setMilestonesLoading(false);
        }
    };

    const getProjectMilestones = (projectId: string): Milestone[] => {
        return milestones.filter(milestone => milestone.projectId === projectId);
    };

    // ==================== INVOICES ====================
    
    const refreshInvoices = async () => {
        if (!user?.uid) return;
        
        setInvoicesLoading(true);
        try {
            const q = query(
                collection(db, 'invoices'),
                where('userId', '==', user.uid)
            );
            
            const querySnapshot = await getDocs(q);
            const invoicesData: Invoice[] = [];
            
            querySnapshot.forEach((doc) => {
                invoicesData.push({ id: doc.id, ...doc.data() } as Invoice);
            });
            
            setInvoices(invoicesData);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error fetching invoices:', error.message);
            }
        } finally {
            setInvoicesLoading(false);
        }
    };

    const addInvoice = async (invoiceData: Omit<Invoice, 'id' | 'userId' | 'createdDate'>) => {
        if (!user?.uid) return;
        
        setInvoicesLoading(true);
        try {
            const newInvoice = {
                ...invoiceData,
                userId: user.uid,
                createdDate: new Date().toISOString(),
            };
            
            const docRef = await addDoc(collection(db, 'invoices'), newInvoice);
            setInvoices(prev => [...prev, { id: docRef.id, ...newInvoice }]);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error adding invoice:', error.message);
                throw error;
            }
        } finally {
            setInvoicesLoading(false);
        }
    };

    const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
        setInvoicesLoading(true);
        try {
            const invoiceRef = doc(db, 'invoices', id);
            await updateDoc(invoiceRef, updates);
            
            setInvoices(prev =>
                prev.map(invoice =>
                    invoice.id === id ? { ...invoice, ...updates } : invoice
                )
            );
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error updating invoice:', error.message);
                throw error;
            }
        } finally {
            setInvoicesLoading(false);
        }
    };

    const deleteInvoice = async (id: string) => {
        setInvoicesLoading(true);
        try {
            const invoiceRef = doc(db, 'invoices', id);
            await deleteDoc(invoiceRef);
            
            setInvoices(prev => prev.filter(invoice => invoice.id !== id));
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error deleting invoice:', error.message);
                throw error;
            }
        } finally {
            setInvoicesLoading(false);
        }
    };

    const getClientInvoices = (clientId: string): Invoice[] => {
        return invoices.filter(invoice => invoice.clientId === clientId);
    };

    // ==================== ESTIMATES ====================
    
    const refreshEstimates = async () => {
        if (!user?.uid) return;
        
        setEstimatesLoading(true);
        try {
            const q = query(
                collection(db, 'estimates'),
                where('userId', '==', user.uid)
            );
            
            const querySnapshot = await getDocs(q);
            const estimatesData: Estimate[] = [];
            
            querySnapshot.forEach((doc) => {
                estimatesData.push({ id: doc.id, ...doc.data() } as Estimate);
            });
            
            setEstimates(estimatesData);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error fetching estimates:', error.message);
            }
        } finally {
            setEstimatesLoading(false);
        }
    };

    const addEstimate = async (estimateData: Omit<Estimate, 'id' | 'userId' | 'createdDate'>) => {
        if (!user?.uid) return;
        
        setEstimatesLoading(true);
        try {
            const newEstimate = {
                ...estimateData,
                userId: user.uid,
                createdDate: new Date().toISOString(),
            };
            
            const docRef = await addDoc(collection(db, 'estimates'), newEstimate);
            setEstimates(prev => [...prev, { id: docRef.id, ...newEstimate }]);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error adding estimate:', error.message);
                throw error;
            }
        } finally {
            setEstimatesLoading(false);
        }
    };

    const updateEstimate = async (id: string, updates: Partial<Estimate>) => {
        setEstimatesLoading(true);
        try {
            const estimateRef = doc(db, 'estimates', id);
            await updateDoc(estimateRef, updates);
            
            setEstimates(prev =>
                prev.map(estimate =>
                    estimate.id === id ? { ...estimate, ...updates } : estimate
                )
            );
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error updating estimate:', error.message);
                throw error;
            }
        } finally {
            setEstimatesLoading(false);
        }
    };

    const deleteEstimate = async (id: string) => {
        setEstimatesLoading(true);
        try {
            const estimateRef = doc(db, 'estimates', id);
            await deleteDoc(estimateRef);
            
            setEstimates(prev => prev.filter(estimate => estimate.id !== id));
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error deleting estimate:', error.message);
                throw error;
            }
        } finally {
            setEstimatesLoading(false);
        }
    };

    const getClientEstimates = (clientId: string): Estimate[] => {
        return estimates.filter(estimate => estimate.clientId === clientId);
    };

    // ==================== EMAILS ====================
    
    const refreshEmails = async () => {
        if (!user?.uid) return;
        
        setEmailsLoading(true);
        try {
            const q = query(
                collection(db, 'client_emails'),
                where('userId', '==', user.uid)
            );
            
            const querySnapshot = await getDocs(q);
            const emailsData: Email[] = [];
            
            querySnapshot.forEach((doc) => {
                emailsData.push({ id: doc.id, ...doc.data() } as Email);
            });
            
            setEmails(emailsData);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error fetching emails:', error.message);
            }
        } finally {
            setEmailsLoading(false);
        }
    };

    const sendEmail = async (emailData: Omit<Email, 'id' | 'userId' | 'sentDate'>) => {
        if (!user?.uid) return;
        
        setEmailsLoading(true);
        try {
            const newEmail = {
                ...emailData,
                userId: user.uid,
                sentDate: new Date().toISOString(),
            };
            
            // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
            
            const docRef = await addDoc(collection(db, 'client_emails'), newEmail);
            setEmails(prev => [...prev, { id: docRef.id, ...newEmail }]);
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error('Error sending email:', error.message);
                throw error;
            }
        } finally {
            setEmailsLoading(false);
        }
    };

    const getClientEmails = (clientId: string): Email[] => {
        return emails.filter(email => email.clientId === clientId);
    };

    // ==================== UTILITY ====================
    
    const refreshAll = useCallback(async () => {
        await Promise.all([
            refreshClients(),
            refreshProjects(),
            refreshMilestones(),
            refreshInvoices(),
            refreshEstimates(),
            refreshEmails(),
        ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Initial data fetch
    useEffect(() => {
        if (user?.uid) {
            refreshAll();
        }
    }, [user?.uid, refreshAll]);

    const value: ClientsContextValue = {
        clients,
        clientsLoading,
        addClient,
        updateClient,
        deleteClient,
        
        projects,
        projectsLoading,
        addProject,
        updateProject,
        deleteProject,
        getClientProjects,
        
        milestones,
        milestonesLoading,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        getProjectMilestones,
        
        invoices,
        invoicesLoading,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getClientInvoices,
        
        estimates,
        estimatesLoading,
        addEstimate,
        updateEstimate,
        deleteEstimate,
        getClientEstimates,
        
        emails,
        emailsLoading,
        sendEmail,
        getClientEmails,
        
        refreshAll,
    };

    return (
        <ClientsContext.Provider value={value}>
            {children}
        </ClientsContext.Provider>
    );
};

export default ClientsProvider;
