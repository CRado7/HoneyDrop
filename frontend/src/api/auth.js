// src/api/auth.js
import { gql } from '@apollo/client';
import client from '../graphql/client';

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        role
        planPackage {
          id
          name
        }
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        name
        email
        role
        planPackage {
          id
          name
        }
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      name
      email
      role
      planPackage {
        id
        name
      }
      websites {
        id
        name
      }
    }
  }
`;

// Optional fetch helpers
export const loginUser = async (input) => {
  const { data } = await client.mutate({
    mutation: LOGIN,
    variables: { input },
  });
  return data.login;
};

export const registerUser = async (input) => {
  const { data } = await client.mutate({
    mutation: REGISTER,
    variables: { input },
  });
  return data.register;
};

export const fetchCurrentUser = async () => {
  try {
    const { data } = await client.query({
      query: ME,
      fetchPolicy: 'network-only',
    });
    console.log('Fetched current user:', data.me);
    return data.me;
  } catch (err) {
    console.error('Failed to fetch current user:', err);
    throw err;
  }
};

