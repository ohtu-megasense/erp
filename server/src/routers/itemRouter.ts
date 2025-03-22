import { Router } from "express";
import { AddItem, DeleteItem } from "../database/database_handler";
import logger from "../utils/logger"

const router = Router();

router.post("/", async (req, res) => {
	const { id, data } = req.body;

	if (!id || !data) {
		logger.error("Item creation failed: missing category ID or item data");
		res.status(400).json({ error: "Category ID and item data are required" });
		return;
	}
  
  try {
    const result = await AddItem(id, data);
    res.json(result)
  } catch (error) {
    logger.error("Error adding item:", error);
    res.status(500).json({ error: "Internal server error"})
  }
});


router.delete("/:id", async (req, res) => {
	const id = req.params.id;

  try {
    await DeleteItem(id)
    res.json({ message: `Item with ID ${id} deleted successfully`})
  } catch (error) {
    logger.error(`Error deleting item with ID ${id}:`, error)
    res.status(500).json({ error: "Internal server error"})
  }
});

export default router;
