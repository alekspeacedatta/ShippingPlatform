import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Authentication } from "../services/AuthService";

export const useLogin = () => {
    const setUser = useAuthStore(state => state.setUser);
    const navigate = useNavigate();
    return useMutation({
        mutationFn: Authentication.login,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            setUser(data.user);
            data.user.role === 'USER' ? navigate('/client/dashboard') : navigate('/company/dashboard')
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
    return useMutation({
        mutationFn: Authentication.registerCompany,
        onSuccess: (_data, variables) => {
            mutate({ email: variables.contactEmail, password: variables.password });
        },
        onError: (e) => {
            console.error('Company registering failed', e.message);            
        }
    })
}