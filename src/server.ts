import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import artistsRouter from './routers/artists-router';
import artistRolesRouter from './routers/artist-roles-router';
import config from './config';
import authRouter from './routers/auth-router';
import favoredArtistsRouter from './routers/favored-artists-router';
import genresRouter from './routers/genres-router';
import movieRouter from './routers/movies-router';

const server = express();

server.use(cors());
server.use(morgan(':method :url :status'));
server.use(express.static('public'));
server.use(express.json());
server.use('/api/artists', artistsRouter);
server.use('/api/artist-roles', artistRolesRouter);
server.use('/api/auth', authRouter);
server.use('/api/fav-artists', favoredArtistsRouter);
server.use('/api/movies', movieRouter);
server.use('/api/genres', genresRouter);

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
