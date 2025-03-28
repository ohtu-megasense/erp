import { Router } from "express";
import {
	AlterCategory,
	renameCategory,
	addCategory,
	getCategories,
} from "../database/database_handler";
import { toAddCategoryRequest } from "../utils/parsers";
import logger from "../utils/logger";
import {
	AddCategoryResponse,
	GetCategoriesResponse,
} from "../../../shared/types";

const router = Router();

router.post("/", async (req, res) => {
	try {
		const addCategoryRequest = toAddCategoryRequest(req.body);
		const newCategory = await addCategory(addCategoryRequest);
		const response: AddCategoryResponse = newCategory;
		res.status(201).json(response);
	} catch (error) {
		if (error instanceof Error) {
			logger.error("ww", error.message);

			if (error.name === "PARSING_ERROR") {
				res.status(400).json({ error: error.message });
				return;
			}
		}

		logger.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
});

router.get("/", async (_, res) => {
	try {
		const categories: GetCategoriesResponse = await getCategories();
		res.status(200).json(categories);
	} catch (error) {
		logger.error(error);
		res.status(500).json({ error: "Something went wrong" });
	}
});

router.put("/:categoryId", (req, res) => {
	const { categoryId } = req.params;
	const { itemShape, categoryName } = req.body;

	if (!categoryId || !itemShape) {
		console.error("Category ID and new item shape are required");
		res.status(400).json({ error: "Category ID and item shape are required" });
		return;
	}

	if (!categoryName) {
		console.error("Category name required");
		res.status(400).json({ error: "Category name required" });
		return;
	} else {
		renameCategory(categoryName, Number(categoryId));
		console.log("renamed");
	}

	AlterCategory(categoryId, itemShape)
		.then(() =>
			res
				.status(200)
				.json({ message: `Category ${categoryId} updated successfully` }),
		)
		.catch((error) => {
			console.error("Error updating category:", error);
			res.status(500).json({ error: "Internal server error" });
		});
});

export default router;
