// src/api/plans.js
import { gql } from '@apollo/client';
import client from '@/lib/apolloClient';

export const GET_PLAN_PACKAGES = gql`
  query GetPlanPackages {
    planPackages {
      id
      name
      description
      pricePerMonth
      maxWebsites
      siteTypesAllowed
      features
    }
  }
`;

export const GET_PLAN_PACKAGE = gql`
  query GetPlanPackage($id: ID!) {
    planPackage(id: $id) {
      id
      name
      description
      pricePerMonth
      maxWebsites
      siteTypesAllowed
      features
    }
  }
`;

// Optional: Direct call helpers
export const fetchPlanPackages = async () => {
  const { data } = await client.query({
    query: GET_PLAN_PACKAGES,
    fetchPolicy: 'cache-first',
  });
  return data.planPackages;
};

export const fetchPlanPackageById = async (id) => {
  const { data } = await client.query({
    query: GET_PLAN_PACKAGE,
    variables: { id },
    fetchPolicy: 'network-only',
  });
  return data.planPackage;
};
