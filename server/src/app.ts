import express from "express";
import cors from "cors";
import pingRouter from "./routers/pingRouter";
import { requestLogger } from "./utils/middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/api/ping", pingRouter);
app.get("/*", (req, res) => {
  res.status(404).json({ message: "Unknown endpoint." });
});

export default app;
