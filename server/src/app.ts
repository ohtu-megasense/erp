import express from 'express';
import cors from 'cors';
import pingRouter from './routers/pingRouter';
import inventoryRouter from './routers/inventoryRouter';
import categoryRouter from './routers/categoryRouter';
import itemRouter from './routers/itemRouter';
import { requestLogger } from './utils/middleware';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '../dist')));

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/ping', pingRouter);
app.use('/api/reports/inventory', inventoryRouter);
app.use('/api/manage/categories', categoryRouter);
app.use('/api/items', itemRouter);

const env = process.env.NODE_ENV;

if (env === 'test' || env === 'development') {
  // https://typescript-eslint.io/rules/no-require-imports/
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const testingRouter = require('./routers/testingRouter');
  app.use('/api/testing', testingRouter.default);
}

app.get('/*', (req, res) => {
  res.status(404).json({ message: 'Unknown endpoint!' });
});

export default app;
