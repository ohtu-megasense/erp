import { Router } from "express";
import { createInventoryItem } from "../database/database_handler";

const router = Router();

router.post("/", (req, res) => {
	const { item_name, item_values } = req.body;

	if (!item_name) {
		console.error("Item needs a name");
		res.status(500).json({ error: "Item needs a name" });
		return;
	}
	if (item_values.len != 3) {
		console.error("Three values required");
		res.status(500).json({ error: "Three values required" });
		return;
	}

	createInventoryItem(item_name, item_values)
		.then((data) => res.json(data))
		.catch((error) => {
			console.error("Error adding item:", error);
			res.status(500).json({ error: "Internal server error" });
		});
});

export default router;
