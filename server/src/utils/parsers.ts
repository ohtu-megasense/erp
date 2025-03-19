import { AddCategoryRequest } from '../../../shared/types';

const isStringRecord = (obj: unknown): obj is Record<string, string> => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  if (Array.isArray(obj)) {
    return false;
  }

  if (Object.keys(obj).length === 0) {
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

  if (!isStringRecord(body.itemShape)) {
    const error = new Error(
      'Item shape must be of type Record<string, string>'
    );
    error.name = 'PARSING_ERROR';
    throw error;
  }

  return {
    name: body.name,
    itemShape: body.itemShape
  };
};
