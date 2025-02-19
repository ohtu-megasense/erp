import { Router } from 'express';

interface PingResponse {
  message: string;
}

interface InventoryModule {
  message: string;
}

const router = Router();

router.get('/', (req, res) => {
  const response: PingResponse = {
    message: 'pong'
  };

  res.json(response);
});

router.get("/inventorymodule", (req, res) => {
  const response: InventoryModule = {
    message: "testi"
  }

  res.json(response);
});



export default router;
