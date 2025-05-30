import logger from './utils/logger';
import app from './app';
import { testDatabaseConnection } from './database/database';
import { port } from './config';
import { testLogCategories } from './database/database_handler';

const startServer = async () => {
  logger.info(`Starting server with node env ${process.env.NODE_ENV}.`);

  const { isConnectionSuccessful } = await testDatabaseConnection();

  // NOTE: Just for testing if categories can be queried.
  try {
    await testLogCategories();
  } catch (error) {
    let logMessage = '';

    if (error instanceof Error) {
      logMessage += error.message;
    }

    logger.info(
      'Could not query category table successfully. Error: ',
      logMessage
    );
  }

  if (!isConnectionSuccessful) {
    logger.info(`Exiting server process because database connection failed.`);

    // NOTE: Leaves the terminal "hanging"? Is this an issue?
    process.exit(1);
  }

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}.`);
  });
};

startServer();
