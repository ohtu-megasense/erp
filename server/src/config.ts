import 'dotenv/config';
import logger from './utils/logger';

const getDatabaseUrl = (): string | undefined => {
  switch (process.env.NODE_ENV) {
    case 'development':
      logger.info('Using local postgres as database url.');
      return 'postgres://postgres:postgres@postgres:5432/postgres';
    // NOTE: Should the test database be different?
    case 'test':
      // NOTE: Logger does not log with NODE_ENV=test
      logger.info('Using local postgres as database url.');
      return 'postgres://postgres:postgres@postgres:5432/postgres';
    case 'production':
      logger.info('Using database url from process env.');
      return process.env.DATABASE_URL;
    default:
      logger.info(
        'Process env NODE_ENV is not defined. Cant determine which database url to use.'
      );
      return undefined;
  }
};

const database_URL = getDatabaseUrl();
const port = process.env.PORT || 3000;

if (!database_URL) {
  logger.error(
    `Database url is not set. Did you forget to determine it in env?`
  );
}

export { database_URL, port };
