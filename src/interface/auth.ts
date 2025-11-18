export interface IUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    isEmailVerified: boolean;
    createdAt?: string;
    updatedAt?: string;
}