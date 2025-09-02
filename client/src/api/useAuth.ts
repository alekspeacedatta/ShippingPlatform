import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { AuthenticationService } from "../services/AuthService";
import { useCompanyStore } from "../store/useCompanyStore";
import { useClientStore } from "../store/useClientStore";
import type { User } from "../types/Types";
import { useEffect } from "react";

export const useUser = () => {
  const token = useAuthStore((s) => s.authInfo?.token);
  const setUser = useClientStore((s) => s.setUser);
  const setUserHydrated = useClientStore((s) => s.setUserHydrated);

  const q = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: () => AuthenticationService.getUser(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: (count, err: any) => {
      const s = err?.status ?? 0;
      if (s === 401 || s === 403) return false;
      return count < 1;
    },
  });

  useEffect(() => {
    if (q.isSuccess) {
      setUser(q.data!);
      setUserHydrated(true);
    } else if (q.isError) {
      setUser(null);
      setUserHydrated(true);
    }
  }, [q.isSuccess, q.isError, q.data, setUser, setUserHydrated]);

  return q; // status can be used for logging; UI shouldn't rely on it
};

export const useLogin = () => {
    const setUser = useClientStore(state => state.setUser);
    const setAuthInfo = useAuthStore(state => state.setAuthInfo);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: AuthenticationService.login,
        onSuccess: (data) => {
            setAuthInfo({ token: data.token, userID: data.user._id, role: data.user.role });
            setUser(data.user);
            if(data.user.role === "USER"){
                navigate('/client/dashboard', {replace: true})
            } else{
                navigate('/company/dashboard', {replace: true})
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
        mutationFn: AuthenticationService.register,
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
    const setCompany = useCompanyStore(state => state.setCompanies);
    return useMutation({
        mutationFn: AuthenticationService.registerCompany,
        onSuccess: (data, variables) => {
            setCompany([data.company]);
            mutate({ email: variables.contactEmail, password: variables.password });
        },
        onError: (e) => {
            console.error('Company registering failed', e.message);            
        }
    })
}