export type Role = 'USER' | "COMPANY_ADMIN";
export interface Address {
    country: string;
    city: string;
    line1: string;
    postalCode: string;
}
export interface User {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    addresses: Address[];
    role: Role;
}