import { useState } from "react";
import {
	Box,
	Button,
	Collapse,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import {
	ExpandMore as ExpandMoreIcon,
	ExpandLess as ExpandLessIcon,
	Delete as DeleteIcon,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch } from "../../../app/hooks";
import { addedCategory } from "../../../features/categoryDataSlice";
// 1. Importoi mutaatiohook
import { useAddCategoryMutation } from "../../../features/apiSlice";

export const AddCategoryForm = () => {
	const [isOpen, setIsOpen] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [formValues, setFormValues] = useState<Record<string, string>>({
		name: "",
	});
	const [propertyCount, setPropertyCount] = useState(0);
	const dispatch = useAppDispatch();

	// 2. Kutsu mutaatiohook, josta saadaan funktio addCategoryMutation
	const [addCategoryMutation] = useAddCategoryMutation();

	const handleInputChange = (key: string, value: string) => {
		setFormValues((prev) => ({
			...prev,
			[key]: value,
		}));
		if (key === "name" && value.trim()) {
			setError(null);
		}
	};

	const validateInputs = () => {
		if (!formValues.name.trim()) {
			setError("Please enter a valid category name");
			return false;
		}
		return true;
	};

	// 3. Muuta onSubmit asynkroniseksi, kutsu addCategoryMutation ja dispatchaa vasta onnistumisen jälkeen
	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateInputs()) {
			return;
		}

		const propertyNames = Array.from(
			{ length: propertyCount },
			(_, i) => formValues[`property-${i}`] || "",
		).filter((name) => name.trim() !== "");

		const itemShape: Record<string, string> = propertyNames.reduce(
			(acc, propertyName) => {
				acc[propertyName] = "TEXT";
				return acc;
			},
			{} as Record<string, string>,
		);

		try {
			// Kutsu backendiä RTK Queryn kautta
			const response = await addCategoryMutation({
				// HUOM: jos backendi odottaa vain name + itemShape,
				// tämä riittää. Muussa tapauksessa säädä backendin rajapinnan mukaan.
				id: 1,
				name: formValues.name,
				itemShape,
				items: [],
			}).unwrap();
			console.log("täälllä", response);
			console.log("itemshape", Object.keys(itemShape).length);
			dispatch(
				addedCategory({
					category: {
						name: formValues.name,
						itemShape,
					},
				}),
			);

			// Tyhjennä lomake
			/*setFormValues({ name: "" });
			setPropertyCount(0);
			setIsOpen(false);
			setError(null);
		*/
		} catch (error) {
			console.log("Error adding new category", error);
		}
	};

	const onClickAddProperty = () => {
		setPropertyCount((prev) => prev + 1);
	};

	const onClickRemoveProperty = (index: number) => {
		setPropertyCount((prev) => prev - 1);
		setFormValues((prev) => {
			const newValues = { ...prev };
			delete newValues[`property-${index}`];
			for (let i = index + 1; i < propertyCount; i++) {
				if (newValues[`property-${i}`]) {
					newValues[`property-${i - 1}`] = newValues[`property-${i}`];
					delete newValues[`property-${i}`];
				}
			}
			return newValues;
		});
	};

	return (
		<Box>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<IconButton
					onClick={() => setIsOpen(!isOpen)}
					size="small"
					sx={{ mr: 1 }}
				>
					{isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</IconButton>
				<Typography variant="subtitle1">Add New Category</Typography>
			</Box>

			<Collapse in={isOpen}>
				<Box
					component="form"
					onSubmit={onSubmit}
					sx={{
						p: 2,
						bgcolor: "#f7f7f7ff",
						borderRadius: 1,
						mt: 2,
					}}
				>
					<Stack spacing={2}>
						<TextField
							label="Category Name"
							value={formValues.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							error={!!error}
							helperText={error || ""}
							variant="outlined"
							size="small"
							fullWidth
						/>
						<Stack spacing={1}>
							<Typography variant="subtitle2">Define Item Shape</Typography>
							<Typography variant="caption" color="text.secondary">
								Example: "Hardware Sensor" could have "Location" and "Online
								Status"
							</Typography>
							<Button
								onClick={onClickAddProperty}
								variant="outlined"
								size="small"
								startIcon={<AddIcon />}
								sx={{ alignSelf: "flex-start" }}
							>
								Add Property
							</Button>
							{Array.from({ length: propertyCount }, (_, i) => (
								<Stack key={i} direction="row" spacing={1} alignItems="center">
									<TextField
										label={`Property ${i + 1} Name`}
										value={formValues[`property-${i}`] || ""}
										onChange={(e) =>
											handleInputChange(`property-${i}`, e.target.value)
										}
										variant="outlined"
										size="small"
										fullWidth
									/>
									<IconButton
										onClick={() => onClickRemoveProperty(i)}
										size="small"
										color="error"
									>
										<DeleteIcon />
									</IconButton>
								</Stack>
							))}
						</Stack>
						<Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
							<Button
								variant="outlined"
								onClick={() => {
									setFormValues({ name: "" });
									setPropertyCount(0);
									setIsOpen(false);
									setError(null);
								}}
							>
								Cancel
							</Button>
							<Button type="submit" variant="contained">
								Create
							</Button>
						</Box>
					</Stack>
				</Box>
			</Collapse>
		</Box>
	);
};
