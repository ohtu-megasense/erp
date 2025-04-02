import { Box } from "@mui/material";
import { HeadingSection } from "./HeadingSection";
import { ManageCategoriesSection } from "../../../categories/manage/ManageCategoriesSection";
import { AddCategorySection } from "../../../categories/manage/AddCategorySection";

export const ManageCategoriesPage = () => {
	return (
		<>
			<Box mt={2}>
				<HeadingSection />
			</Box>
			<Box mt={4}>
				<AddCategorySection module="inventory" />
			</Box>
			<Box mt={4}>
				<ManageCategoriesSection module="inventory" />
			</Box>
		</>
	);
};
