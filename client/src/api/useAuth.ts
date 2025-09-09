import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { AuthenticationService } from '../services/AuthService';
import { useCompanyStore } from '../store/useCompanyStore';

export const useGetUser = () => {
  const token = useAuthStore((state) => state.authInfo?.token);
  return useQuery({
    queryKey: ['user', token],
    enabled: !!token,
    queryFn: () => AuthenticationService.getUser(token!),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuthInfo = useAuthStore((state) => state.setAuthInfo);
  const setCompanyInfo = useCompanyStore((state) => state.setCompanyInfo);

  return useMutation({
    mutationFn: AuthenticationService.login,
    onSuccess: (data) => {
      setAuthInfo({ token: data.token, userId: data.user._id, role: data.user.role });
      if (data.user.role === 'USER') {
        navigate('/client/dashboard', { replace: true });
      } else {
        // @ts-ignore
        setCompanyInfo({ companyId: data.company?._id, email: data.company?.contactEmail });
        navigate('/company/dashboard', { replace: true });
      }
    },
    onError: (e) => {
      console.error('Login Failed', e.message);
    },
  });
};
export const useRegister = () => {
  const { mutate } = useLogin();
  return useMutation({
    mutationFn: AuthenticationService.register,
    onSuccess: (_data, variables) => {
      mutate({ email: variables.email, password: variables.password });
    },
    onError: (e) => {
      console.error(e.message);
    },
  });
};
export const useRegisterCompany = () => {
  const { mutate } = useLogin();
  const setCompanyInfo = useCompanyStore((state) => state.setCompanyInfo);
  return useMutation({
    mutationFn: AuthenticationService.registerCompany,
    onSuccess: (data, variables) => {
      setCompanyInfo({ companyId: data.company._id, email: data.company.contactEmail });
      mutate({ email: variables.contactEmail, password: variables.password });
    },
    onError: (e) => {
      console.error('Company registering failed', e.message);
    },
  });
};
