import { createContext } from "react";

export interface Client {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    location: string;
    industry: string;
    status: "active" | "inactive" | "prospect" | "past";
    totalRevenue: number;
    addedDate: string;
    lastContact?: string;
    // Social profiles
    linkedinUrl?: string;
    website?: string;
    // Notes and tags
    notes?: string;
    tags?: string[];
}

export interface Project {
    id: string;
    clientId: string;
    userId: string;
    name: string;
    description: string;
    status: "planning" | "in-progress" | "on-hold" | "completed" | "cancelled";
    startDate: string;
    endDate?: string;
    budget: number;
    spent: number;
    progress: number; // 0-100
    createdDate: string;
}

export interface Milestone {
    id: string;
    projectId: string;
    userId: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    completedDate?: string;
    amount?: number;
    createdDate: string;
}

export interface Invoice {
    id: string;
    clientId: string;
    projectId?: string;
    userId: string;
    invoiceNumber: string;
    status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
    issueDate: string;
    dueDate: string;
    paidDate?: string;
    subtotal: number;
    tax: number;
    total: number;
    items: InvoiceItem[];
    notes?: string;
    createdDate: string;
}

export interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Estimate {
    id: string;
    clientId: string;
    userId: string;
    estimateNumber: string;
    status: "draft" | "sent" | "accepted" | "rejected" | "expired";
    issueDate: string;
    expiryDate: string;
    subtotal: number;
    tax: number;
    total: number;
    items: InvoiceItem[];
    notes?: string;
    createdDate: string;
}

export interface Email {
    id: string;
    clientId: string;
    userId: string;
    subject: string;
    body: string;
    sentDate: string;
    type: "general" | "invoice" | "estimate" | "follow-up" | "milestone";
    relatedId?: string; // Invoice/Estimate/Milestone ID
}

export type ClientsContextValue = {
    // Clients
    clients: Client[];
    clientsLoading: boolean;
    addClient: (client: Omit<Client, 'id' | 'userId' | 'addedDate'>) => Promise<void>;
    updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
    deleteClient: (id: string) => Promise<void>;
    
    // Projects
    projects: Project[];
    projectsLoading: boolean;
    addProject: (project: Omit<Project, 'id' | 'userId' | 'createdDate'>) => Promise<void>;
    updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    getClientProjects: (clientId: string) => Project[];
    
    // Milestones
    milestones: Milestone[];
    milestonesLoading: boolean;
    addMilestone: (milestone: Omit<Milestone, 'id' | 'userId' | 'createdDate'>) => Promise<void>;
    updateMilestone: (id: string, updates: Partial<Milestone>) => Promise<void>;
    deleteMilestone: (id: string) => Promise<void>;
    getProjectMilestones: (projectId: string) => Milestone[];
    
    // Invoices
    invoices: Invoice[];
    invoicesLoading: boolean;
    addInvoice: (invoice: Omit<Invoice, 'id' | 'userId' | 'createdDate'>) => Promise<void>;
    updateInvoice: (id: string, updates: Partial<Invoice>) => Promise<void>;
    deleteInvoice: (id: string) => Promise<void>;
    getClientInvoices: (clientId: string) => Invoice[];
    
    // Estimates
    estimates: Estimate[];
    estimatesLoading: boolean;
    addEstimate: (estimate: Omit<Estimate, 'id' | 'userId' | 'createdDate'>) => Promise<void>;
    updateEstimate: (id: string, updates: Partial<Estimate>) => Promise<void>;
    deleteEstimate: (id: string) => Promise<void>;
    getClientEstimates: (clientId: string) => Estimate[];
    
    // Emails
    emails: Email[];
    emailsLoading: boolean;
    sendEmail: (email: Omit<Email, 'id' | 'userId' | 'sentDate'>) => Promise<void>;
    getClientEmails: (clientId: string) => Email[];
    
    // Utility
    refreshAll: () => Promise<void>;
}

export const ClientsContext = createContext({} as ClientsContextValue);
