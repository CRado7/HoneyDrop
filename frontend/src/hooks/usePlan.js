// src/hooks/usePlans.js
import { useQuery } from '@apollo/client';
import { GET_PLAN_PACKAGES, GET_PLAN_PACKAGE } from '../api/plan';

// 📦 All plans
export const usePlanPackages = () => {
  return useQuery(GET_PLAN_PACKAGES);
};

// 📦 One plan by ID
export const usePlanPackage = (id) => {
  return useQuery(GET_PLAN_PACKAGE, {
    variables: { id },
    skip: !id,
  });
};
