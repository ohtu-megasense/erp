import { Router } from 'express';
import {
  GetCategories,
  AlterCategory,
  addCategory
} from '../database/database_handler';
import { toAddCategoryRequest } from '../utils/parsers';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const addCategoryRequest = toAddCategoryRequest(req.body);
    const newCategory = addCategory(addCategoryRequest);
    res.status(201).json(newCategory);
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);

      if (error.name === 'PARSING_ERROR') {
        res.status(404).json({ error: error.message });
        return;
      }
    }

    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/', (req, res) => {
  GetCategories()
    .then((data) => res.json(data))
    .catch((error) => console.error('Error getting data: ', error));
});

router.put('/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const { itemShape } = req.body;

  if (!categoryId || !itemShape) {
    console.error('Category ID and new item shape are required');
    res.status(400).json({ error: 'Category ID and item shape are required' });
    return;
  }

  AlterCategory(categoryId, itemShape)
    .then(() =>
      res.json({ message: `Category ${categoryId} updated successfully` })
    )
    .catch((error) => {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

export default router;
