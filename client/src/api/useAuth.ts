import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Authentication } from "../services/AuthService";
import { useCompanyStore } from "../store/useCompanyStore";

export const useLogin = () => {
    const setUser = useAuthStore(state => state.setUser);
    const setCompany = useCompanyStore(state => state.setCompany);
    const navigate = useNavigate();
    return useMutation({
        mutationFn: Authentication.login,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            setUser(data.user);
            if(data.user.role === "USER"){
                navigate('/client/dashboard')
            } else {
                setCompany(data.company)
                navigate('/company/dashboard')
            }
        },
        onError: (e) => {
            console.error('Login Failed', e.message);            
        }
    })
}
export const useRegister = () => {
    const { mutate } = useLogin();
    return useMutation({
        mutationFn: Authentication.register,
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
    const setCompany = useCompanyStore(state => state.setCompany);
    return useMutation({
        mutationFn: Authentication.registerCompany,
        onSuccess: (data, variables) => {
            setCompany(data.company);
            mutate({ email: variables.contactEmail, password: variables.password });
        },
        onError: (e) => {
            console.error('Company registering failed', e.message);            
        }
    })
}