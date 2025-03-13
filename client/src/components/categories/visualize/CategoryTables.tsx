import { Paper, Stack, Typography } from "@mui/material";
import { CategoryTable } from "./CategoryTable";
import { useGetCategoriesQuery } from "../../../features/apiSlice";

export const CategoryTables = () => {
	const { data } = useGetCategoriesQuery();

	const categoriesData = data === undefined ? [] : data;
	return (
		<Stack gap={4}>
			{categoriesData.map((category) => {
				return (
					<Paper
						sx={{
							p: 2,
						}}
					>
						<Typography
							sx={{
								mb: 2,
							}}
						>
							{category.name}
						</Typography>
						<CategoryTable
							key={category.id}
							category={category}
							isEditing={false}
						/>
					</Paper>
				);
			})}
		</Stack>
	);
};
