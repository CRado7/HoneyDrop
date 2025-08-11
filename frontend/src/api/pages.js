// src/api/pages.js
import { gql } from '@apollo/client';
import client from '../graphql/client';

export const GET_PAGES_BY_SITE = gql`
  query GetPagesBySite($siteId: ID!) {
    getPagesBySite(siteId: $siteId) {
      id
      title
      slug
      path
      isHomepage
      isPublished
      seo {
        title
        description
      }
      body
      sections {
        id
        type
        settings
        content {
          id
          type
          tag
          text
          src
          alt
          styles
        }
      }
    }
  }
`;

export const GET_PAGE_BY_ID = gql`
  query GetPageById($id: ID!) {
    getPageById(id: $id) {
      id
      title
      slug
      path
      isHomepage
      isPublished
      seo {
        title
        description
      }
      body
      sections {
        id
        type
        settings
        content {
          id
          type
          tag
          text
          src
          alt
          styles
        }
      }
    }
  }
`;

export const CREATE_PAGE = gql`
  mutation CreatePage($input: CreatePageInput!) {
    createPage(input: $input) {
      id
      title
      slug
      body
    }
  }
`;

export const UPDATE_PAGE = gql`
  mutation UpdatePage($id: ID!, $input: UpdatePageInput!) {
    updatePage(id: $id, input: $input) {
      id
      title
      slug
      body
    }
  }
`;

export const DELETE_PAGE = gql`
  mutation DeletePage($id: ID!) {
    deletePage(id: $id)
  }
`;

// Direct calls (optional - can use these in hooks or independently)
export const fetchPagesBySite = async (siteId) => {
  const { data } = await client.query({
    query: GET_PAGES_BY_SITE,
    variables: { siteId },
    fetchPolicy: 'network-only',
  });
  return data.getPagesBySite;
};

export const fetchPageById = async (id) => {
  const { data } = await client.query({
    query: GET_PAGE_BY_ID,
    variables: { id },
    fetchPolicy: 'network-only',
  });
  return data.getPageById;
};
