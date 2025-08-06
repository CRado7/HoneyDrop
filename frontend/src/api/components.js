import { gql } from '@apollo/client';

export const GET_COMPONENT_LIBRARY = gql`
  query GetComponentLibrary {
    getComponentLibrary {
      id
      category
      label
      type
      tag
      defaults
      inspectorFields {
        key
        label
        type
        options
        config {
          min
          max
          step
          units
          defaultUnit
          defaultValue
        }
      }
    }
  }
`;

export const CREATE_COMPONENT = gql`
  mutation CreateComponent($input: ComponentInput!) {
    createComponent(input: $input) {
      id
      category
      label
      type
      tag
      defaults
      inspectorFields {
        key
        label
        type
        options
        config {
          min
          max
          step
          units
          defaultUnit
          defaultValue
        }
      }
    }
  }
`;

export const UPDATE_COMPONENT = gql`
  mutation UpdateComponent($id: ID!, $input: ComponentInput!) {
    updateComponent(id: $id, input: $input) {
      id
      category
      label
      type
      tag
      defaults
      inspectorFields {
        key
        label
        type
        options
        config {
          min
          max
          step
          units
          defaultUnit
          defaultValue
        }
      }
    }
  }
`;

export const DELETE_COMPONENT = gql`
  mutation DeleteComponent($id: ID!) {
    deleteComponent(id: $id)
  }
`;
