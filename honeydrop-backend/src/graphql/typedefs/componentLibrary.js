import gql from 'graphql-tag';

const componentLibraryTypeDefs = gql`

  scalar JSON

  type Component {
    id: ID!
    category: String!
    label: String!
    type: String!
    tag: String
    defaults: JSON
    inspectorFields: [InspectorField!]!
  }

  type InspectorField {
    key: String!
    label: String!
    type: String!
    options: [String]
    config: InspectorFieldConfig
  }

  type InspectorFieldConfig {
    min: Float
    max: Float
    step: Float
    units: [String]
    defaultUnit: String
    defaultValue: JSON
  }

  input InspectorFieldInput {
    key: String!
    label: String!
    type: String!
    options: [String]
    config: InspectorFieldConfigInput
  }

  input InspectorFieldConfigInput {
    min: Float
    max: Float
    step: Float
    units: [String]
    defaultUnit: String
    defaultValue: JSON
  }

  input ComponentInput {
    category: String!
    label: String!
    type: String!
    tag: String
    defaults: JSON
    inspectorFields: [InspectorFieldInput!]!
  }

  type Query {
    getComponentLibrary: [Component!]!
    getComponentById(id: ID!): Component
  }

  type Mutation {
    createComponent(input: ComponentInput!): Component!
    updateComponent(id: ID!, input: ComponentInput!): Component!
    deleteComponent(id: ID!): Boolean!
  }  
`;

export default componentLibraryTypeDefs;
