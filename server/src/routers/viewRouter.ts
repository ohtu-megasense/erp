import { Router } from 'express';
import logger from '../utils/logger';
import { ViewsService } from '../services/viewsService';
import { isValidModule } from '../utils/parsers';
import { ViewConfig } from '../../../shared/types';

const router = Router();
const viewsService = new ViewsService();

router.get('/:module', async (req, res) => {
  try {
    const module = req.params.module;
    if (!isValidModule(module)) {
      res.status(400).json({ error: 'Invalid module parameter' });
      return;
    }
    const views = await viewsService.getViewsForModule(module);
    res.status(200).json(views);
  } catch (error) {
    logger.error('Error when getting views:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const viewConfig: ViewConfig = req.body;

    if (!viewConfig.name || !viewConfig.filterConfig) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    const savedView = await viewsService.saveView(viewConfig);
    res.status(201).json(savedView);
  } catch (error) {
    logger.error('Error when saving view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
