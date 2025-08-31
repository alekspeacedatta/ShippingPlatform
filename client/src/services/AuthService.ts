import type { Company, User } from "../types/Types";
import { BASE_URL } from "../types/Types";

type LoginPayload = {email: string, password: string};
type LoginResponse = { user: User, token: string, message?: string };
type RegisterClientResponse = { user: User, message: string };
type RegisterCompanyResponse = { company: Company, message: string };

export class Authentication {    
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
        return { user: data.checkUser, token: data.token, message: data.message };
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
        return { user: data.newUse, message: data.message };
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
        return { company: data.newCompany, message: data.message };
    }
}