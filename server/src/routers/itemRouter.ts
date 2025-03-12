import { Router } from "express";
import { AddItem } from "../database/database_handler";

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

export default router;
