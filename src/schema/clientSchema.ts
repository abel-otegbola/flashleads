import * as Yup from 'yup';

export const clientSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
    phone: Yup.string()
        .matches(/^[+()0-9\s-]+$/, 'Invalid phone number format'),
    company: Yup.string()
        .required('Company is required')
        .min(2, 'Company must be at least 2 characters'),
    location: Yup.string(),
    industry: Yup.string().required('Industry is required'),
    status: Yup.string()
        .oneOf(['active', 'inactive', 'prospect', 'past'], 'Invalid status')
        .required('Status is required'),
    totalRevenue: Yup.number()
        .min(0, 'Revenue must be positive')
        .required('Total revenue is required'),
    linkedinUrl: Yup.string().url('Invalid URL'),
    website: Yup.string().url('Invalid URL'),
    notes: Yup.string(),
    tags: Yup.array().of(Yup.string()),
});

export const projectSchema = Yup.object().shape({
    clientId: Yup.string().required('Client is required'),
    name: Yup.string()
        .required('Project name is required')
        .min(3, 'Name must be at least 3 characters'),
    description: Yup.string().required('Description is required'),
    status: Yup.string()
        .oneOf(['planning', 'in-progress', 'on-hold', 'completed', 'cancelled'], 'Invalid status')
        .required('Status is required'),
    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string(),
    budget: Yup.number()
        .min(0, 'Budget must be positive')
        .required('Budget is required'),
    spent: Yup.number()
        .min(0, 'Spent must be positive')
        .required('Spent amount is required'),
    progress: Yup.number()
        .min(0, 'Progress must be at least 0')
        .max(100, 'Progress cannot exceed 100')
        .required('Progress is required'),
});

export const milestoneSchema = Yup.object().shape({
    projectId: Yup.string().required('Project is required'),
    title: Yup.string()
        .required('Title is required')
        .min(3, 'Title must be at least 3 characters'),
    description: Yup.string().required('Description is required'),
    dueDate: Yup.string().required('Due date is required'),
    completed: Yup.boolean(),
    amount: Yup.number().min(0, 'Amount must be positive'),
});

export const invoiceSchema = Yup.object().shape({
    clientId: Yup.string().required('Client is required'),
    projectId: Yup.string(),
    invoiceNumber: Yup.string()
        .required('Invoice number is required')
        .min(3, 'Invoice number must be at least 3 characters'),
    status: Yup.string()
        .oneOf(['draft', 'sent', 'paid', 'overdue', 'cancelled'], 'Invalid status')
        .required('Status is required'),
    issueDate: Yup.string().required('Issue date is required'),
    dueDate: Yup.string().required('Due date is required'),
    subtotal: Yup.number()
        .min(0, 'Subtotal must be positive')
        .required('Subtotal is required'),
    tax: Yup.number()
        .min(0, 'Tax must be positive')
        .required('Tax is required'),
    total: Yup.number()
        .min(0, 'Total must be positive')
        .required('Total is required'),
    items: Yup.array().of(
        Yup.object().shape({
            description: Yup.string().required('Description is required'),
            quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
            rate: Yup.number().min(0, 'Rate must be positive').required('Rate is required'),
            amount: Yup.number().min(0, 'Amount must be positive').required('Amount is required'),
        })
    ).min(1, 'At least one item is required'),
    notes: Yup.string(),
});

export const estimateSchema = Yup.object().shape({
    clientId: Yup.string().required('Client is required'),
    estimateNumber: Yup.string()
        .required('Estimate number is required')
        .min(3, 'Estimate number must be at least 3 characters'),
    status: Yup.string()
        .oneOf(['draft', 'sent', 'accepted', 'rejected', 'expired'], 'Invalid status')
        .required('Status is required'),
    issueDate: Yup.string().required('Issue date is required'),
    expiryDate: Yup.string().required('Expiry date is required'),
    subtotal: Yup.number()
        .min(0, 'Subtotal must be positive')
        .required('Subtotal is required'),
    tax: Yup.number()
        .min(0, 'Tax must be positive')
        .required('Tax is required'),
    total: Yup.number()
        .min(0, 'Total must be positive')
        .required('Total is required'),
    items: Yup.array().of(
        Yup.object().shape({
            description: Yup.string().required('Description is required'),
            quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
            rate: Yup.number().min(0, 'Rate must be positive').required('Rate is required'),
            amount: Yup.number().min(0, 'Amount must be positive').required('Amount is required'),
        })
    ).min(1, 'At least one item is required'),
    notes: Yup.string(),
});

export const emailSchema = Yup.object().shape({
    clientId: Yup.string().required('Client is required'),
    subject: Yup.string()
        .required('Subject is required')
        .min(3, 'Subject must be at least 3 characters'),
    body: Yup.string()
        .required('Email body is required')
        .min(10, 'Email body must be at least 10 characters'),
    type: Yup.string()
        .oneOf(['general', 'invoice', 'estimate', 'follow-up', 'milestone'], 'Invalid type')
        .required('Email type is required'),
    relatedId: Yup.string(),
});
