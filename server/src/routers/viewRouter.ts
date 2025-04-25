import { Router } from 'express';
import logger from '../utils/logger';
import { ViewsService } from '../services/viewsService';
import { isValidModule } from '../utils/parsers';
import { ViewConfig } from '../../../shared/types';
import { supportedFilterTypes } from '../filters/filters';

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

    if (!supportedFilterTypes.includes(viewConfig.filterConfig.type)) {
      res.status(400).json({ error: 'Filter type not supported' });
      return;
    }
    const module = viewConfig.module;
    if (!isValidModule(module)) {
      res.status(400).json({ error: 'Invalid module parameter' });
      return;
    }
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

router.put('/:id', async (req, res) => {
  try {
    const viewId = parseInt(req.params.id);
    if (isNaN(viewId)) {
      res.status(400).json({ error: 'Filter type not supported' });
      return;
    }

    const viewConfig: ViewConfig = req.body;
    if (!supportedFilterTypes.includes(viewConfig.filterConfig.type)) {
      res.status(400).json({ error: 'Filter type not supported' });
      return;
    }

    const module = viewConfig.module;
    if (!isValidModule(module)) {
      res.status(400).json({ error: 'Invalid module parameter' });
      return;
    }
    if (!viewConfig.name || !viewConfig.filterConfig) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const updatedView = await viewsService.updateView(viewId, viewConfig);
    res.status(200).json(updatedView);
  } catch (error) {
    logger.error('Error when updating view:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const viewId = parseInt(req.params.id);
    if (isNaN(viewId)) {
      res.status(400).json({ error: 'Filter type not supported' });
      return;
    }

    const result = await viewsService.deleteView(viewId);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error when deleting view:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
