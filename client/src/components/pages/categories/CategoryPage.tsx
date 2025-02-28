import { Box } from "@mui/material";
import { HeadingSection } from "./HeadingSection";
import { CategoriesDataSection } from "../../rides/sections/CategoriesDataSection";

export const CategoryPage = () => {
	return (
		<>
			<Box mt={2}>
				<HeadingSection />
			</Box>
			<Box mt={2}>
				<CategoriesDataSection />
			</Box>
		</>
	);
};
