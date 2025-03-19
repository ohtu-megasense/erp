// Not yet in use. Added as an example.
// Would be used on client in apiSlice
// and on server when parsing the request.

export interface AddCategoryRequest {
  name: string;
  itemShape: Record<string, string>;
}

export interface AddCategoryResponse {
  id: number;
  name: string;
  itemShape: Record<string, string>;
}
