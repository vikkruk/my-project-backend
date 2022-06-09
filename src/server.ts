import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import artistsRouter from './routers/artists-router';
import artistRolesRouter from './routers/artist-roles-router';
import config from './config';
import authRouter from './routers/auth-router';
import favoredActorsRouter from './routers/favored-actors-router';

const server = express();

server.use(morgan(':method :url :status'));
server.use(express.static('public'));
server.use(express.json());
server.use('/api/artists', artistsRouter);
server.use('/api/artist-roles', artistRolesRouter);
server.use('/api/auth', authRouter);
server.use('/api/fav-actors', favoredActorsRouter);

mongoose.connect(
  config.db.connectionURL,
  {
    retryWrites: true,
    w: 'majority',
  },
  (error) => {
    if (error) {
      console.log(`Couldn't connect:\n${error.message}`);
      return;
    }
    console.log('Successfully connected to MongoDB');
    server.listen(1337, () => console.log('Application server is running on: http://localhost:1337'));
  },

);

// "json-server -p 8000 -w ./database/db.json",
