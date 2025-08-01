import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import schema from './schema.js';
import { getUserFromToken } from './utils/auth.js';

import cloudinaryUploadRoute from './routes/cloudinaryUpload.js';
import backblazeUploadRoute from './routes/backblazeUpload.js';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

console.log('JWT_SECRET from .env:', process.env.JWT_SECRET);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/cloudinary', cloudinaryUploadRoute);
app.use('/api/backblaze', backblazeUploadRoute);

const startServer = async () => {
  await connectDB();

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      const user = await getUserFromToken(token);
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
