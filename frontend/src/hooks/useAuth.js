// src/hooks/useAuth.js
import { useMutation, useQuery } from '@apollo/client';
import { LOGIN, REGISTER, ME } from '@/api/auth';

export const useLogin = () => {
  const [login, { data, loading, error }] = useMutation(LOGIN);
  return { login, data, loading, error };
};

export const useRegister = () => {
  const [register, { data, loading, error }] = useMutation(REGISTER);
  return { register, data, loading, error };
};

export const useCurrentUser = () => {
  const { data, loading, error } = useQuery(ME);
  return { user: data?.me, loading, error };
};
