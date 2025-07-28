import { makeExecutableSchema } from '@graphql-tools/schema';
import GraphQLJSON from 'graphql-type-json';
import typeDefs from './typedefs/index.js';
import resolvers from './resolvers/index.js';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    JSON: GraphQLJSON, // Add the JSON scalar here
    ...resolvers, // Spread your existing resolvers
  },
});

export default schema;
