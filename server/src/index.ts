import logger from './utils/logger';
import app from './app';
import { connectToDatabase } from './database/database';
import { port } from './config';

const startServer = async () => {
  logger.info(`Starting server with node env ${process.env.NODE_ENV}.`);

  const { isConnectionSuccessful } = await connectToDatabase();

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
