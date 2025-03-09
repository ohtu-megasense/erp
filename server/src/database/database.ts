import { Client } from 'pg';
import { database_URL } from '../config';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';

const getCaPath = (): string | undefined => {
  const env = process.env.NODE_ENV;

  if (env === 'production') {
    return process.env.CA_PATH || path.join(__dirname, '../../ca.pem');
  }

  return undefined;
};

const getDatabaseClient = (): Client => {
  if (process.env.NODE_ENV === 'production') {
    const caPath = getCaPath();
    logger.info(
      `Database certificate authority file is using path: ${caPath}.`
    );

    if (!caPath) {
      throw new Error(
        'Certificate authority path is undefined. Is the process node env in production mode?'
      );
    }

    logger.info(
      'Certificate file content: ',
      fs.readFileSync(caPath).toString()
    );

    return new Client({
      connectionString: database_URL,
      ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(caPath).toString()
      }
    });
  }

  return new Client({
    connectionString: database_URL
  });
};

export const client = getDatabaseClient();

export const connectToDatabase = async (): Promise<{
  isConnectionSuccessful: boolean;
}> => {
  try {
    await client.connect();
    logger.info('Connected to database.');

    return {
      isConnectionSuccessful: true
    };
  } catch (error) {
    let logMessage = '';

    if (error instanceof Error) {
      logMessage += error.message;
    }

    await client.end();
    logger.error(`Database connection failed. Error message: ${logMessage}`);

    return {
      isConnectionSuccessful: false
    };
  }
};

const loadSchema = async () => {
  try {
    await client.connect();
    console.log('Connected to the database');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const SQLschema = fs.readFileSync(schemaPath, 'utf-8');

    await client.query(SQLschema);
    console.log('Schema loaded successfully');
  } finally {
    await client.end();
    console.log('Disconnected from the database');
  }
};

if (require.main == module) {
  loadSchema();
}
