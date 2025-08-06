// src/hooks/useComponentLibrary.js
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_COMPONENT_LIBRARY,
  CREATE_COMPONENT,
  UPDATE_COMPONENT,
  DELETE_COMPONENT,
} from '../api/components';

// 📦 Get all components from the library
export const useComponentLibrary = () => {
  return useQuery(GET_COMPONENT_LIBRARY);
};

// ➕ Create component
export const useCreateComponent = () => useMutation(CREATE_COMPONENT);

// ✏️ Update component
export const useUpdateComponent = () => useMutation(UPDATE_COMPONENT);

// ❌ Delete component
export const useDeleteComponent = () => useMutation(DELETE_COMPONENT);
