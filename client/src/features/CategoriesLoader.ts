import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetCategoriesQuery } from "./apiSlice";
import { addedCategory, addedItem, Category } from "./categoryDataSlice";

export const CategoriesLoader = () => {
	const dispatch = useDispatch();
	const { data, isLoading, error } = useGetCategoriesQuery();

	useEffect(() => {
		if (data) {
			data.item_shape.forEach((cat: any, index: number) => {
				const category: Omit<Category, "id" | "items"> = {
					name: cat.category_name,
					itemShape: cat.item_shape,
				};

				dispatch(addedCategory({ category }));

				// Jos backend palauttaa myös itemit
				cat.items?.forEach((item: any) => {
					dispatch(
						addedItem({
							categoryId: index + 1,
							item: item.data,
						}),
					);
				});
			});
		}
	}, [data, dispatch]);
};
