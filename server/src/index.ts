import express from "express";
import cors from "cors";
import pingRouter from "./routers/pingRouter";
import { requestLogger } from './utils/middleware';
import logger from './utils/logger';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(requestLogger)
app.use("/api/ping", pingRouter);
app.get("/*", (req, res) => {
  res.status(404).json({ message: "Unknown endpoint." });
});

app.listen(port, () => {
  logger.info(
    `Server is running on port ${port} with node env ${process.env.NODE_ENV}`
  );
});

export default app;
