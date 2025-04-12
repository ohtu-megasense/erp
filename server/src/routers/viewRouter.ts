import { Router } from 'express';
import logger from '../utils/logger';
import { ViewsService } from '../services/viewsService';
import { isValidModule } from '../utils/parsers';

const router = Router();
const viewsService = new ViewsService();

router.get('/:module', async (req, res) => {
  try {
    const module = req.params.module;
    if (!isValidModule(module)) {
      res.status(400).json({ error: 'Invalid module parameter' });
      return;
    }
    const views = viewsService.getViewsForModule(module);
    res.json(views);
  } catch (error) {
    logger.error('Error when getting views:', error);
    res.status(500).json({ error: 'internal server error' });
  }
});

export default router
