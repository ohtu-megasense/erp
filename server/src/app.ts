import express from 'express';
import cors from 'cors';
import pingRouter from './routers/pingRouter';
import categoryRouter from './routers/categoryRouter';
import itemRouter from './routers/itemRouter';
import viewRouter from './routers/viewRouter'
import { requestLogger } from './utils/middleware';
import path from 'path';

const app = express();

const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/ping', pingRouter);
app.use('/api/manage/categories', categoryRouter);
app.use('/api/items', itemRouter);
app.use('/api/views', viewRouter)

const env = process.env.NODE_ENV;

if (env === 'test' || env === 'development') {
  // https://typescript-eslint.io/rules/no-require-imports/
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const testingRouter = require('./routers/testingRouter');
  app.use('/api/testing', testingRouter.default);
}

app.get('/*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({ message: 'Unknown endpoint!' });
    return;
  }

  const filePath = `${distPath}/index.html`;
  res.sendFile(filePath);
});

export default app;
