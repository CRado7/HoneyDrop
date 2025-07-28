// src/hooks/useWebsites.js
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_USER_WEBSITES,
  GET_WEBSITE_BY_ID,
  CREATE_WEBSITE,
  DELETE_WEBSITE,
} from '@/api/websites';

export const useUserWebsites = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_WEBSITES);
  return {
    websites: data?.getUserWebsites || [],
    loading,
    error,
    refetch,
  };
};

export const useCreateWebsite = () => {
  const [create, { data, loading, error }] = useMutation(CREATE_WEBSITE, {
    refetchQueries: [{ query: GET_USER_WEBSITES }],
  });
  return { create, data, loading, error };
};

export const useDeleteWebsite = () => {
  const [del, { data, loading, error }] = useMutation(DELETE_WEBSITE, {
    refetchQueries: [{ query: GET_USER_WEBSITES }],
  });
  return { deleteWebsite: del, data, loading, error };
};

export const useWebsiteById = (id) => {
  const { data, loading, error } = useQuery(GET_WEBSITE_BY_ID, {
    variables: { id },
    skip: !id,
  });

  return {
    website: data?.getWebsiteById || null,
    loading,
    error,
  };
};
