import { Router } from "express";
import { AddItem, DeleteItem, CheckItemIdFound } from "../database/database_handler";

const router = Router();

router.post("/", (req, res) => {
	const { id, data } = req.body;
	console.log(id, data);

	if (!id || !data) {
		console.error("invalid request, missing name or data");
		res.status(500).json({ error: "category id or item data missing!" });
		return;
	}

	AddItem(id, data)
		.then((data) => res.json(data))
		.catch((error) => {
			console.error("Error adding item:", error);
			res.status(500).json({ error: "Internal server error" });
		});
});


router.delete("/:id", (req, res) => {
	const id = req.params.id;

	if (!CheckItemIdFound(id)) {
		console.error("did not find the item by ID");
		res.status(400).json({ error: "did not find the item by ID" });
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
