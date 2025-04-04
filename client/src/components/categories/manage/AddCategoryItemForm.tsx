import { FormEvent, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useAddItemMutation } from "../../../features/apiSlice";
import { Category } from "../../../../../shared/types";

interface AddCategoryItemFormProps {
	category: Category;
}

export const AddCategoryItemForm = ({ category }: AddCategoryItemFormProps) => {
	const [error, setError] = useState<string | null>(null);
	const [formValues, setFormValues] = useState<Record<string, string | number>>(
		{},
	);
	const [addItem] = useAddItemMutation();
	const shapeKeys = Object.keys(category.itemShape);

	const handleInputChange = (key: string, value: string) => {
		const type = category.itemShape[key];
		let parsed: string | number = value;
		if (type === "INTEGER") parsed = parseInt(value, 10);
		else if (type === "FLOAT") parsed = parseFloat(value);

		setFormValues((prev) => ({
			...prev,
			[key]: parsed,
		}));
	};

	const validateInputs = (key: string): boolean => {
		const type = category.itemShape[key]; // "TEXT", "INTEGER", "FLOAT"
		const value = formValues[key] ?? "";

		const actualType = typeof value;

		console.log(type, actualType, value);
		if (
			(type === "TEXT" && actualType !== "string") ||
			(type === "INTEGER" && actualType !== "number") ||
			(type === "FLOAT" && actualType !== "number")
		) {
			setError("Please enter value with valid type");
			return false;
		}

		return true;
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		const newItem = shapeKeys.reduce(
			(acc, key) => {
				if (!validateInputs(key)) {
					return;
				}
				const raw = formValues[key] ?? "";
				const type = category.itemShape[key];

				switch (type) {
					case "INTEGER":
						acc[key] = parseInt(String(raw), 10);
						break;
					case "FLOAT":
						acc[key] = parseFloat(String(raw));
						break;
					case "TEXT":
					default:
						acc[key] = raw;
						break;
				}
				return acc;
			},
			{} as Record<string, string | number>,
		);
		try {
			await addItem({
				id: category.id,
				data: newItem,
			}).unwrap();
		} catch (error) {
			console.log("error: ", error);
		}
		//		dispatch(
		//		addedItem({
		//		categoryId: category.id,
		//	item: newItem,
		//	}),
		//	);

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
								error={!!error}
								helperText={error || ""}
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
