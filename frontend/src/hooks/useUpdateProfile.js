// src/hooks/useUpdateProfile.js
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE} from '../api/user';

export const useUpdateProfile = () => {
  const [updateProfile, { data, loading, error }] = useMutation(UPDATE_PROFILE);
  return { updateProfile, data, loading, error };
};
