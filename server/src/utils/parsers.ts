import { AddCategoryRequest } from '../../../shared/types';

const isStringRecord = (obj: unknown): obj is Record<string, string> => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (Array.isArray(obj)) {
    return false;
  }

  const values = Object.values(obj);

  for (const value of values) {
    if (typeof value !== 'string') {
      return false;
    }
  }

  return true;
};

export const isValidModule = (module: string) => {
  if (!module || typeof module !== 'string') {
    return false;
  }
  if (module !== 'inventory' && module !== 'crm') {
    return false;
  }
  return true;
};

// NOTE: Currently only 'TEXT' value is allowed.
const isValidItemShape = (itemShape: Record<string, string>): boolean => {
  const values = Object.values(itemShape);
  const validTypes = ['TEXT', 'INTEGER', 'FLOAT'];

  for (const value of values) {
    if (!validTypes.includes(value)) {
      return false;
    }
  }

  return true;
};

export const toAddCategoryRequest = (body: unknown): AddCategoryRequest => {
  if (!body || typeof body !== 'object') {
    const error = new Error('Request body must be an object');
    error.name = 'PARSING_ERROR';
    throw error;
  }

  if (!('name' in body) || typeof body.name !== 'string') {
    const error = new Error('Property "name" must be a string');
    error.name = 'PARSING_ERROR';
    throw error;
  }

  if (
    !('itemShape' in body) ||
    !body.itemShape ||
    typeof body.itemShape !== 'object'
  ) {
    const error = new Error('Property "itemShape" must be an object');
    error.name = 'PARSING_ERROR';
    throw error;
  }

  if (!('module' in body) || typeof body.module !== 'string') {
    const error = new Error('Property "module" must be a string');
    error.name = 'PARSING_ERROR';
    throw error;
  }

  if (!isStringRecord(body.itemShape)) {
    const error = new Error(
      'Item shape must be of type Record<string, string>'
    );
    error.name = 'PARSING_ERROR';
    throw error;
  }

  if (!isValidItemShape(body.itemShape)) {
    const error = new Error("Item shape can only contain 'TEXT' values");
    error.name = 'PARSING_ERROR';
    throw error;
  }

  if (Object.keys(body.itemShape).length === 0) {
    const error = new Error('Item shape must have at least one property');
    error.name = 'PARSING_ERROR';
    throw error;
  }

  return {
    name: body.name,
    module: body.module,
    itemShape: body.itemShape
  };
};
