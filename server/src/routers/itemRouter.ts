import { Router } from 'express';
import { AddItem, DeleteItem, UpdateItem } from '../database/database_handler';
import logger from '../utils/logger';

const router = Router();

router.post('/', async (req, res) => {
  const { id, data } = req.body;

  if (!id || !data) {
    logger.error('Item creation failed: missing category ID or item data');
    res.status(400).json({ error: 'Category ID and item data are required' });
    return;
  }

  try {
    const result = await AddItem(id, data);
    res.json(result);
  } catch (error) {
    logger.error('Error adding item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const deleteItemResponse = await DeleteItem(id);
    if (deleteItemResponse.rowsDeleted === 1) {
      res.json({ message: `Item with ID ${id} deleted successfully` });
    } else if (deleteItemResponse?.rowsDeleted === 0) {
      res.status(404).json({ error: `Item with ID ${id} not found` });
    } else {
      logger.error('Multiple items with same ID deleted');
      res.json({
        message: `${deleteItemResponse.rowsDeleted} items with ID ${id} deleted`
      });
    }
  } catch (error) {
    logger.error(`Error deleting item with ID ${id}:`, error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { categoryId, data } = req.body;

  console.log('data', data);

  if (!data) {
    logger.error('Item update failed: missing item data');
    res.status(400).json({ error: 'Item data is required for update' });
    return;
  }
  try {
    await UpdateItem(id, data);
    res.json({
      id: Number(id),
      categoryId: Number(categoryId),
      data
    });
  } catch (error) {
    logger.error('error updating item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
