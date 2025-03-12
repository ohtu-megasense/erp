import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
	categoriesData: Category[];
}

const initialState: State = {
	categoriesData: [
		{
			id: 0,
			name: "Hardware Sensors",
			itemShape: {
				Name: "string",
				Location: "string",
				Status: "string",
				"Last Updated": "string",
			},
			items: Array.from({ length: 300 }, (_, index) => ({
				id: index + 1,
				data: {
					Name: `R1-D${index + 1}`,
					Location: index % 2 === 0 ? "London" : "Riyadh",
					Status: index % 3 === 0 ? "Offline" : "Online",
					"Last Updated": new Date().toISOString(),
				},
			})),
		},
		{
			id: 1,
			name: "AWS",
			itemShape: {
				"Service Name": "string",
				"Monthly Cost": "string",
			},
			items: [
				{
					id: 3,
					data: {
						"Service Name": "Bedrock Knowledge Base",
						"Monthly Cost": "2500",
					},
				},
				{
					id: 4,
					data: {
						"Service Name": "Elasticsearch",
						"Monthly Cost": "2500",
					},
				},
			],
		},
		// {
		//   id: 3,
		//   name: 'Empty Category',
		//   itemShape: {},
		//   items: []
		// },
		// {
		//   id: 4,
		//   name: 'Empty Category With Shape',
		//   itemShape: {
		//     Random: 'string'
		//   },
		//   items: []
		// }
	],
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
