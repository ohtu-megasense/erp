import { Paper, Stack } from "@mui/material";
import { CategoryManager } from "./CategoryManager";
import { useGetCategoriesQuery } from "../../../features/apiSlice";

export const ManageCategoriesSection = () => {
	const { data: categoriesData = [] } = useGetCategoriesQuery();
	console.log(categoriesData);
	return (
		<Stack gap={4}>
			{categoriesData.map((category) => {
				return (
					<Paper
						key={category.id}
						sx={{
							p: 2,
						}}
					>
						<CategoryManager category={category} />
					</Paper>
				);
			})}
		</Stack>
	);
};
