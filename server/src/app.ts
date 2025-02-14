import express from 'express';
import cors from 'cors';
import path from 'path';
import pingRouter from './routers/pingRouter';
import { requestLogger } from './utils/middleware';

const app = express();

const getBuildPath = () => {
  // Server is ran from index.js at dist folder
  if (process.env.NODE_ENV === 'production') {
    return path.join(__dirname, '../../build');
  }

  // Server is ran from index.ts at src folder
  if (process.env.NODE_ENV === 'development') {
    return path.join(__dirname, '../build');
  }

  console.log(
    `NODE_ENV is ${process.env.NODE_ENV}. Persuming server is ran from index.ts at src folder.`
  );

  return path.join(__dirname, '../build');
};

app.use(express.static(getBuildPath()));

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use('/api/ping', pingRouter);
app.get('/*', (req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(404).json({ message: 'Unknown endpoint.' });
  } else {
    const buildPath = getBuildPath();
    const filepath = buildPath + '/index.html';
    res.sendFile(filepath);
  }
});

export default app;
