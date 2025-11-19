import * as Yup from 'yup';

export const loginSchema = Yup.object({
    email: Yup.string().required('Email is required').email("Invalid email address"),
    password: Yup.string().required("Password is required"),
})

export const signupSchema = Yup.object({
    fullname: Yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
    email: Yup.string().required('Work email is required').email("Invalid email address"),
    companyName: Yup.string().required('Company name is required').min(2, 'Company name must be at least 2 characters'),
    password: Yup.string()
        .required("Password is required")
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number'),
})

export const forgotPasswordSchema = Yup.object({
    email: Yup.string().required('Email is required').email("Invalid email address"),
})

export const verifyOtpSchema = Yup.object({
    otp: Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
})

export const resetPasswordSchema = Yup.object({
    password: Yup.string()
        .required("Password is required")
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref('password')], 'Passwords must match'),
})