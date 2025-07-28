import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';
import schema from './schema.js';
import cloudinaryUploadRoute from './routes/cloudinaryUpload.js';
import backblazeUploadRoute from './routes/backblazeUpload.js';

// Import the JSON scalar
import GraphQLJSON from 'graphql-type-json';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

const app = express();
app.use(cors());
app.use('/api/cloudinary', cloudinaryUploadRoute);
app.use('/api/backblaze', backblazeUploadRoute);

const startServer = async () => {
  await connectDB();

  const server = new ApolloServer({
    schema,
    resolvers: {
      JSON: GraphQLJSON, // Add JSON scalar resolver here
    },
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      try {
        const user = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        return { user };
      } catch {
        return {};
      }
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`),
  );
};

startServer();
