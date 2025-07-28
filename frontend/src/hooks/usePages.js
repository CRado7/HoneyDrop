// src/hooks/usePages.js
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_PAGES_BY_SITE,
  GET_PAGE_BY_ID,
  CREATE_PAGE,
  UPDATE_PAGE,
  DELETE_PAGE,
} from '@/api/pages';

// 📄 Get all pages for a site
export const usePagesBySite = (siteId) => {
  return useQuery(GET_PAGES_BY_SITE, {
    variables: { siteId },
    skip: !siteId,
  });
};

// 📄 Get one page by ID
export const usePageById = (id) => {
  return useQuery(GET_PAGE_BY_ID, {
    variables: { id },
    skip: !id,
  });
};

// ➕ Create page
export const useCreatePage = () => useMutation(CREATE_PAGE);

// ✏️ Update page
export const useUpdatePage = () => useMutation(UPDATE_PAGE);

// ❌ Delete page
export const useDeletePage = () => useMutation(DELETE_PAGE);
