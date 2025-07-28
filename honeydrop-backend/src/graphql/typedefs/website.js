import gql from 'graphql-tag';

const websiteTypeDefs = gql`
  type Website {
    id: ID!
    name: String!
    user: User!
    domain: String
    isPublished: Boolean
    createdAt: String
    updatedAt: String
  }

  input CreateWebsiteInput {
    name: String!
    domain: String
  }

  type Query {
    getUserWebsites: [Website!]!
    getWebsiteById(id: ID!): Website
  }

  type Mutation {
    createWebsite(input: CreateWebsiteInput!): Website!
    deleteWebsite(id: ID!): Boolean!
  }
`;

export default websiteTypeDefs;
