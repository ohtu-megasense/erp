import { Router } from "express";
import { AddItem } from "../database/database_handler";
import { DeleteItem } from "../database/database_handler";

const router = Router();

router.post("/", (req, res) => {
	const { category_id, item_data } = req.body;
	console.log(category_id, item_data);

	if (!category_id || !item_data) {
		console.error("invalid request, missing name or data");
		res.status(500).json({ error: "category id or item data missing!" });
		return;
	}

	AddItem(category_id, item_data)
		.then((data) => res.json(data))
		.catch((error) => {
			console.error("Error adding item:", error);
			res.status(500).json({ error: "Internal server error" });
		});
});


router.delete("/:id", (req, res) => {
	const id = req.params.id;
	console.log(id)

	if (!id) {
		console.error("invalid request, missing name or data");
		res.status(400).json({ error: "item_id is required" });
		return;
	}

	DeleteItem(id)
	.then((data) => res.json(data))
	.catch((error) => {
		console.error("Error deleting item:", error);
		res.status(500).json({ error: "Internal server error" });
	});
});

export default router;
