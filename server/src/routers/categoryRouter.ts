import { Router } from 'express';
import {
  AlterCategory,
  addCategory,
  getCategories
} from '../database/database_handler';
import { toAddCategoryRequest } from '../utils/parsers';
import logger from '../utils/logger';
import {
  AddCategoryResponse,
  GetCategoriesResponse
} from '../../../shared/types';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const addCategoryRequest = toAddCategoryRequest(req.body);
    const newCategory = await addCategory(addCategoryRequest);
    const response: AddCategoryResponse = newCategory;
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);

      if (error.name === 'PARSING_ERROR') {
        res.status(400).json({ error: error.message });
        return;
      }
    }

    logger.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/', async (_, res) => {
  try {
    const categories: GetCategoriesResponse = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
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

// DUMMY ROUTE FOR ADDING AND RENDERING COLUMN JUST TO VERIFY FUNCTIONALITY IN FRONTEND
router.post('/:categoryId/columns', async (req, res) => {
  const { categoryId } = req.params;
  const { columnName } = req.body;

  console.log(`Received request to add column "${columnName}" to category ${categoryId}`);

  try {
    const categories = await getCategories();
    const category = categories.find((cat) => cat.id === Number(categoryId));

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const updatedShape = {
      ...category.itemShape,
      [columnName]: 'string'
    };

    await AlterCategory(categoryId, updatedShape);

    res.status(200).json({
      success: true,
      updatedCategory: {
        ...category,
        itemShape: updatedShape
      }
    });
  } catch (error) {
    console.error('Error adding column:', error);
    res.status(500).json({ error: 'Failed to add column' });
  }
});

export default router;
