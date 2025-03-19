import { Router } from 'express';
import { resetDatabase } from '../database/database';

const router = Router();

router.post('/reset', async (req, res) => {
  try {
    await resetDatabase();
    res.sendStatus(200);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Something went wrong.' });
  }
});

export default router;
