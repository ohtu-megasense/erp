import express from "express";
import cors from "cors";
import pingRouter from "./routers/pingRouter";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/ping", pingRouter);
app.get("/*", (req, res) => {
  res.status(404).json({ message: "Unknown endpoint." });
});

app.listen(port, () => {
  console.log(
    `Server is running on port ${port} with node env ${process.env.NODE_ENV}`
  );
});

export default app;
