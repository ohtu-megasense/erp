import express from 'express';
import cors from 'cors';
import pingRouter from './routers/pingRouter';
import { requestLogger } from './utils/middleware';

const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/ping', pingRouter);

app.get('/api/reports/inventory', (req, res) => {
  res.json({
    total_sensors: 150,
    active_sensors: 130,
    inactive_sensors: 20,
    total_cloud_resources: 50,
    monthly_api_usage: 25000
  });
});

app.get('/*', (req, res) => {
  res.status(404).json({ message: 'Unknown endpoint!' });
});

export default app;
