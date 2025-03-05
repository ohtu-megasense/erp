import { Router } from "express";
import { AddCategory } from "../database/database_handler";

const router = Router();

router.post("/", (req, res) => {
	const { category_name, item_shape } = req.body; // extracting name from request body as string
	console.log(category_name, item_shape);

	if (!category_name || !item_shape) {
		console.error("Category needs name or item needs shape");
		res
			.status(500)
			.json({ error: "Category needs a name or item needs shape" });
		return;
	}

	AddCategory(category_name, item_shape)
		.then((data) => res.json(data)) // sending back confirmation message to client/frontend that category has been added
		.catch((error) => {
			console.error("Error adding category:", error); // adding error message to console
			res.status(500).json({ error: "Internal server error" }); // adding error message so that client/frontend can display it
		});
});

export default router;
