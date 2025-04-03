import { Paper, Stack } from "@mui/material";
import { CategoryManager } from "./CategoryManager";
import { useGetCategoriesQuery } from "../../../features/apiSlice";
import { Module } from "../../../../../shared/types";

export const ManageCategoriesSection = ({ module }: Module) => {
	const { data: categoriesData = [], refetch } = useGetCategoriesQuery(module);
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
						<CategoryManager category={category} refetchCategories={refetch} />
					</Paper>
				);
			})}
		</Stack>
	);
};
