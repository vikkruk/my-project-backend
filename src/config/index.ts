import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { DB_CONNECTION_URL, TOKEN_SECRET } = process.env;

if (DB_CONNECTION_URL === undefined || TOKEN_SECRET === undefined) {
  throw new Error('Set up environment variables in src/config/.env file');
}

const config = {
  token: {
    secret: TOKEN_SECRET,
  },
  db: {
    connectionURL: DB_CONNECTION_URL,
  },
};

export default config;
