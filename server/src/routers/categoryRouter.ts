import { Router } from "express";
import { AddingCategoryFunction } from "../database/database_handler";

const router = Router();

router.post("/", (req, res) => {
	const { name, ...rest } = req.body; // extracting name from request body as string
	if (!name) {
		console.error("Category needs name");
		res.status(500).json({ error: "Category needs a name" });
		return;
	}

	AddingCategoryFunction(name)
		.then((data) => res.json(data)) // sending back confirmation message to client/frontend that category has been added
		.catch((error) => {
			console.error("Error adding category:", error); // adding error message to console
			res.status(500).json({ error: "Internal server error" }); // adding error message so that client/frontend can display it
		});
});

export default router;
