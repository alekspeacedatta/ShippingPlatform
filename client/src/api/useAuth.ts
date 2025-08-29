import { useMutation } from "@tanstack/react-query";
import { BASE_URL, type Company, type User } from "../types/Types";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
export const registerCompany = async (companyInfo: Company) => {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/company/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(companyInfo)
        })
        if(!res.ok) throw new Error("Error: registered company res is not ok");
        const data = await res.json();
        return data.company;
    } catch (error) {
        console.error(error);
    }
}
export const register = async (registerInfo: User) => {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/client/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerInfo)
        })
        if(!res.ok) throw new Error("Error: registered Res Is Not Ok");
        const data = await res.json();
        return data.newUser; 
    } catch (error) {
        console.error(error);        
    }
}
const login = async (user: { email: string, password: string }) => {
    try {
        const res = await fetch(`${BASE_URL}/api/auth/client/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        if(!res.ok) throw new Error("Error: Login Res Is Not Ok");
        const data = await res.json();
        localStorage.setItem('token', data.token);
        return data.checkUser;
    } catch (error) {
        console.error(error);
    }
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
    })
}
export const useRegisterCompany = () => {
    const { mutate } = useLogin();
    return useMutation({
        mutationFn: registerCompany,
        onSuccess: (_data, variables) => {
            mutate({ email: variables.contactEmail, password: variables.password });
        }
    })
}