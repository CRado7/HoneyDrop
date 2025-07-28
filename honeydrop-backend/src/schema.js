import { makeExecutableSchema } from '@graphql-tools/schema';
import GraphQLJSON from 'graphql-type-json';
import typeDefs from './graphql/typedefs/index.js';
import resolvers from './graphql/resolvers/index.js';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    JSON: GraphQLJSON, // Add the JSON scalar here
    ...resolvers, // Spread your existing resolvers
  },
});

export default schema;
