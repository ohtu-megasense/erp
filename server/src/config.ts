import 'dotenv/config';

const database_URL =
  process.env.NODE_ENV === 'dev'
    ? 'postgres://postgres:postgres@postgres:5432/postgres'
    : process.env.DATABASE_URL;

if (!database_URL) {
  throw new Error('DATABASE_URL must be set in production environment');
}

export { database_URL };
