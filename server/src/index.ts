import logger from './utils/logger';
import app from './app';

const port = 3000;

app.listen(port, () => {
  logger.info(
    `Server is running on port ${port} with node env ${process.env.NODE_ENV}`
  );
});

export default app;
