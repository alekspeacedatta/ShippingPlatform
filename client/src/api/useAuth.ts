import { useMutation } from "@tanstack/react-query";
import { BASE_URL, type Company, type User } from "../types/Types";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
export const registerCompany = async (companyInfo: Company) => {
    const res = await fetch(`${BASE_URL}/api/auth/company/register`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyInfo)
    })
    if(!res.ok) throw new Error("Register failed, make sure that all fields are filled correctly");
    return await res.json();
}
export const register = async (registerInfo: User) => {
    const res = await fetch(`${BASE_URL}/api/auth/client/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerInfo)
    })
    const data = await res.json();
    if(!res.ok) throw new Error("Register failed. make sure that all fields are filled correctly");
    return data.newUser; 
}
const login = async (user: { email: string, password: string }) => {
    const res = await fetch(`${BASE_URL}/api/auth/client/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    if(!res.ok) throw new Error("incorrect email or password");
    const data = await res.json();
    localStorage.setItem('token', data.token);
    return data.checkUser;
}

export const useLogin = () => {
    const setUser = useAuthStore(state => state.setUser);
    const navigate = useNavigate();
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setUser(data);
            data.role === 'USER' ? navigate('/client/dashboard') : navigate('/company/dashboard')
        },
        onError: (e) => {
            console.error('Login Failed', e.message);            
        }
    })
}
export const useRegister = () => {
    const { mutate } = useLogin();
    return useMutation({
        mutationFn: register,
        onSuccess: (_data, variables) => {
            mutate({ email: variables.email, password: variables.password });
        },
        onError: (e) => {
            console.error(e.message);            
        }
    })
}
export const useRegisterCompany = () => {
    const { mutate } = useLogin();
    return useMutation({
        mutationFn: registerCompany,
        onSuccess: (_data, variables) => {
            mutate({ email: variables.contactEmail, password: variables.password });
        },
        onError: (e) => {
            console.error('Company registering failed', e.message);            
        }
    })
}