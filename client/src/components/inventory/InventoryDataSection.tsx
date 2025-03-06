import { Box, Typography } from "@mui/material";
import { useGetCategoriesQuery } from "../../features/apiSlice";

export const InventoryDataSection = () => {
	const { data } = useGetCategoriesQuery();

	if (!data) {
		return null;
	}

	return (
		<Box>
			<Typography variant="h6">Categories Data</Typography>
			<Typography>Total categories: {data.count}</Typography>
			<Typography>Total categories: {data.name}</Typography>
			<Typography>Total categories: {data.item_shape.category_name}</Typography>
		</Box>
	);
};
/*{data.map((category) => (
				<Typography key={category.item_shape}>
					Category name:{category.item_shape}
				</Typography>
			))}*/
