import { makeExecutableSchema } from '@graphql-tools/schema';
import GraphQLJSON from 'graphql-type-json';
import typeDefs from './graphql/typedefs/index.js';
import resolvers from './graphql/resolvers/index.js';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...resolvers,       // spread your existing resolvers first
    JSON: GraphQLJSON,  // then add the JSON scalar resolver
  },
});

export default schema;

