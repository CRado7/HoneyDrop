// src/api/websites.js
import { gql } from '@apollo/client';
import client from '../graphql/client';

export const GET_USER_WEBSITES = gql`
  query GetUserWebsites {
    getUserWebsites {
      id
      name
      domain
      isPublished
      createdAt
      updatedAt
    }
  }
`;

export const GET_WEBSITE_BY_ID = gql`
  query GetWebsiteById($id: ID!) {
    getWebsiteById(id: $id) {
      id
      name
      domain
      isPublished
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_WEBSITE = gql`
  mutation CreateWebsite($input: CreateWebsiteInput!) {
    createWebsite(input: $input) {
      id
      name
      domain
      isPublished
    }
  }
`;

export const DELETE_WEBSITE = gql`
  mutation DeleteWebsite($id: ID!) {
    deleteWebsite(id: $id)
  }
`;

// Optional helpers if using manual fetches
export const fetchUserWebsites = async () => {
  const { data } = await client.query({
    query: GET_USER_WEBSITES,
    fetchPolicy: 'network-only',
  });
  return data.getUserWebsites;
};

export const createWebsite = async (input) => {
  const { data } = await client.mutate({
    mutation: CREATE_WEBSITE,
    variables: { input },
  });
  return data.createWebsite;
};

export const deleteWebsite = async (id) => {
  const { data } = await client.mutate({
    mutation: DELETE_WEBSITE,
    variables: { id },
  });
  return data.deleteWebsite;
};
