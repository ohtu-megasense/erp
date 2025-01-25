import { Router } from "express";

interface PingResponse {
  message: string;
}

const router = Router();

router.get("/", (req, res) => {
  const response: PingResponse = {
    message: "pong",
  };

  res.json(response);
});

export default router;
