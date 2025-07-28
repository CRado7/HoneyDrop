const { gql } = require('apollo-server-express');

export default gql`
  type PlanPackage {
    id: ID!
    name: String!
    description: String
    pricePerMonth: Float!
    maxWebsites: Int!
    siteTypesAllowed: [String!]!
    features: [String!]!
  }

  type Query {
    planPackages: [PlanPackage!]!
    planPackage(id: ID!): PlanPackage
  }
`;
