import { FormEvent, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useAppDispatch } from "../../../app/hooks";
import { addedItem, Category } from "../../../features/categoryDataSlice";

interface AddCategoryItemFormProps {
	category: Category;
}

export const AddCategoryItemForm = ({ category }: AddCategoryItemFormProps) => {
	const [formValues, setFormValues] = useState<Record<string, string>>({});
	const dispatch = useAppDispatch();

	const shapeKeys = Object.keys(category.itemShape);

	const handleInputChange = (key: string, value: string) => {
		setFormValues((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSubmit = (event: FormEvent) => {
		event.preventDefault();

		const newItem = shapeKeys.reduce(
			(acc, key) => ({
				...acc,
				[key]: formValues[key] || "",
			}),
			{} as Record<string, string>,
		);

		dispatch(
			addedItem({
				categoryId: category.id,
				item: newItem,
			}),
		);

		setFormValues({});
	};

	return (
		<Box>
			<Typography variant="subtitle2" mb={1} sx={{ fontSize: "0.8125rem" }}>
				Add Item to {category.name}
			</Typography>
			{shapeKeys.length === 0 ? (
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ fontSize: "0.8125rem" }}
				>
					No shape defined for this category yet
				</Typography>
			) : (
				<Box component="form" onSubmit={handleSubmit} sx={{ p: 0 }}>
					<Stack spacing={1}>
						{shapeKeys.map((key) => (
							<TextField
								key={key}
								label={key}
								value={formValues[key] || ""}
								onChange={(e) => handleInputChange(key, e.target.value)}
								variant="outlined"
								size="small"
								fullWidth
								sx={{
									"& .MuiInputBase-root": {
										height: "28px",
										fontSize: "0.8125rem",
									},
									"& .MuiInputLabel-root": {
										fontSize: "0.8125rem",
										transform: "translate(14px, 6px) scale(1)",
										"&.MuiInputLabel-shrink": {
											transform: "translate(14px, -6px) scale(0.75)",
										},
									},
									"& .MuiOutlinedInput-notchedOutline": {
										borderWidth: "1px",
									},
								}}
							/>
						))}
						<Box>
							<Button
								type="submit"
								variant="outlined"
								color="primary"
								size="small"
								sx={{ py: 0.5, fontSize: "0.8125rem" }}
							>
								+ Add
							</Button>
						</Box>
					</Stack>
				</Box>
			)}
		</Box>
	);
};
