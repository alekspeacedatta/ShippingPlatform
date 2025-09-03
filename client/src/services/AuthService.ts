import type { Company, User } from "../types/Types";
import { BASE_URL } from "../types/Types";

type LoginPayload = {email: string, password: string};
type LoginResponse = { user: User, token: string, message?: string , company?: Company};
type RegisterClientResponse = { user: User, message: string };
type RegisterCompanyResponse = { company: Company, message: string };

export class Authentication {    
    static async getUser (token: string, signal: AbortSignal) {

        const res = await fetch(`${BASE_URL}/api/auth/client/get`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
            signal
        })
        if(!res.ok) throw new Error("Error getUser is not possible ");

        return res.json();
    }
    static async login(user: LoginPayload) : Promise<LoginResponse> {
        const res = await fetch(`${BASE_URL}/api/auth/client/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
        })
        if(!res.ok) throw new Error("incorrect email or password");
        const data = await res.json();
        return { message: data.message, user: data.user, token: data.token, company: data.company };
    };
    static async register(registerInfo: User) : Promise<RegisterClientResponse> {
        const res = await fetch(`${BASE_URL}/api/auth/client/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerInfo)
        })
        const data = await res.json();
        if(!res.ok) throw new Error("Register failed. make sure that all fields are filled correctly");
        return { user: data.newUser, message: data.message };
    };
    static async registerCompany(companyInfo: Company) : Promise<RegisterCompanyResponse>{
        const res = await fetch(`${BASE_URL}/api/auth/company/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyInfo)
        })
        if(!res.ok) throw new Error("Register failed, make sure that all fields are filled correctly");
        const data = await res.json();
        return { message: data.message, company: data.company};
    }
}