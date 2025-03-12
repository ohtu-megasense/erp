import { Router } from "express";
import {
	AddCategory,
	GetCategories,
	AlterCategory,
} from "../database/database_handler";

const router = Router();

router.post("/", (req, res) => {
	const { name, itemShape } = req.body; // extracting name from request body as string
	console.log("routerissa:", name, itemShape);

	if (!name || !itemShape) {
		console.error("Category needs name or item needs shape");
		res
			.status(500)
			.json({ error: "Category needs a name or item needs shape" });
		return;
	}

	AddCategory(name, itemShape)
		.then((data) => res.json(data)) // sending back confirmation message to client/frontend that category has been added
		.catch((error) => {
			console.error("Error adding category:", error); // adding error message to console
			res.status(500).json({ error: "Internal server error" }); // adding error message so that client/frontend can display it
		});
});

router.get("/", (req, res) => {
	GetCategories()
		.then((data) => res.json(data))
		.catch((error) => console.error("Error getting data: ", error));
});

router.put("/:categoryId", (req, res) => {
	const { categoryId } = req.params;
	const { itemShape } = req.body;

	if (!categoryId || !itemShape) {
		console.error("Category ID and new item shape are required");
		res.status(400).json({ error: "Category ID and item shape are required" });
		return;
	}

	AlterCategory(categoryId, itemShape)
		.then(() =>
			res.json({ message: `Category ${categoryId} updated successfully` }),
		)
		.catch((error) => {
			console.error("Error updating category:", error);
			res.status(500).json({ error: "Internal server error" });
		});
});

export default router;
