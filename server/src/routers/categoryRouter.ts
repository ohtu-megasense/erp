import { Router, Response, Request } from 'express';
import {
  AlterCategory,
  renameCategory,
  addCategory,
  getCategories,
  deleteCategory
} from '../database/database_handler';
import { toAddCategoryRequest, isValidModule } from '../utils/parsers';
import logger from '../utils/logger';
import {
  AddCategoryResponse,
  GetCategoriesResponse,
  DeleteCategoryResponse
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
      logger.error('ww', error.message);

      if (error.name === 'PARSING_ERROR') {
        res.status(400).json({ error: error.message });
        return;
      }
    }

    logger.error(error);
    res.status(500).json({ error: 'Something went wrong_post' });
  }
});

router.get(
  '/:module',
  async (req: Request<{ module: string }>, res: Response): Promise<void> => {
    try {
      const module = req.params.module;
      if (!isValidModule(module)) {
        res.status(400).json({ error: 'Invalid module parameter' });
        return;
      }
      const categories: GetCategoriesResponse = await getCategories(module);
      res.status(200).json(categories);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Something went wrong_get' });
    }
  }
);

router.delete('/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    console.error('Category ID required for deletion');
    res.status(400).json({ error: 'Category ID required for deletion' });
    return;
  } else {
    const deleted_category: DeleteCategoryResponse =
      await deleteCategory(categoryId);
    res.status(200).json(deleted_category);
  }
});

router.put('/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const { itemShape, categoryName } = req.body;

  if (!categoryId || !itemShape) {
    console.error('Category ID and new item shape are required');
    res.status(400).json({ error: 'Category ID and item shape are required' });
    return;
  }

  if (!categoryName) {
    console.error('Category name required');
    res.status(400).json({ error: 'Category name required' });
    return;
  } else {
    renameCategory(categoryName, Number(categoryId));
    console.log('renamed');
  }

  AlterCategory(categoryId, itemShape)
    .then(() =>
      res
        .status(200)
        .json({ message: `Category ${categoryId} updated successfully` })
    )
    .catch((error) => {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

export default router;
