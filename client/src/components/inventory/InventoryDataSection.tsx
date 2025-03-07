import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import { useGetCategoriesQuery } from "../../features/apiSlice";

export const InventoryDataSection = () => {
	const { data } = useGetCategoriesQuery();

	if (!data) {
		return null;
	}

	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableCell>ID</TableCell>
					<TableCell>Category Name</TableCell>
					<TableCell>Item Shape</TableCell>
				</TableRow>
			</TableHead>
			<TableBody>
				{data.item_shape.map((item) => (
					<TableRow key={item.id}>
						<TableCell>{item.id}</TableCell>
						<TableCell>{item.category_name}</TableCell>
						<TableCell>
							{Object.entries(item.item_shape).map(([key, val]) => (
								<Typography key={key}>{`${key}: ${val}`}</Typography>
							))}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
