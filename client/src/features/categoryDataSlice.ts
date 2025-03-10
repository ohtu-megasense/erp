import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Item {
	id: number;
	data: Record<string, string>;
}

export interface Category {
	id: number;
	name: string;
	itemShape: Record<string, string>;
	items: Item[];
}

interface State {
	categoriesData: Category[];
}

const initialState: State = {
	categoriesData: [],
};

interface ValidateShapeParams {
	requiredShape: Record<string, string>;
	newItem: Record<string, string>;
}

const isNewItemValid = (params: ValidateShapeParams): boolean => {
	const { requiredShape, newItem } = params;

	const requiredKeys = Object.keys(requiredShape);
	const newItemKeys = Object.keys(newItem);

	const hasAllRequiredKeys = requiredKeys.every((key) =>
		newItemKeys.includes(key),
	);

	const hasNoExtraKeys = newItemKeys.every((key) => requiredKeys.includes(key));

	const allValuesAreStrings = Object.values(newItem).every(
		(value) => typeof value === "string" && value,
	);

	return hasAllRequiredKeys && hasNoExtraKeys && allValuesAreStrings;
};

const slice = createSlice({
	name: "categoryData",
	initialState,
	reducers: {
		addedCategory: (
			state,
			action: PayloadAction<{ category: Omit<Category, "id" | "items"> }>,
		) => {
			state.categoriesData.push({
				id: state.categoriesData.length + 1,
				items: [],
				...action.payload.category,
			});
		},
		addedItem: (
			state,
			action: PayloadAction<{
				categoryId: number;
				item: Record<string, string>;
			}>,
		) => {
			const category = state.categoriesData.find(
				(p) => p.id === action.payload.categoryId,
			);

			if (
				category === undefined ||
				!isNewItemValid({
					newItem: action.payload.item,
					requiredShape: category.itemShape,
				})
			) {
				return;
			}

			const maxId = Math.max(
				...state.categoriesData.flatMap((c) => c.items.map((i) => i.id)),
				0,
			);

			category.items.push({
				id: maxId + 1,
				data: action.payload.item,
			});
		},
		updateItem: (
			state,
			action: PayloadAction<{
				categoryId: number;
				itemId: number;
				updatedItem: Record<string, string>;
			}>,
		) => {
			const { categoryId, itemId, updatedItem } = action.payload;
			const category = state.categoriesData.find((p) => p.id === categoryId);

			if (category === undefined) {
				return;
			}

			const item = category.items.find((i) => i.id === itemId);
			if (
				item === undefined ||
				!isNewItemValid({
					newItem: updatedItem,
					requiredShape: category.itemShape,
				})
			) {
				return;
			}

			item.data = updatedItem;
		},
	},
});

export default slice.reducer;
export const { addedCategory, addedItem, updateItem } = slice.actions;
