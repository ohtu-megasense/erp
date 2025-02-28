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
});
