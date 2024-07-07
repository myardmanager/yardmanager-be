const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getInventory,
	getInventoryById,
	updateInventory,
	createInventory,
	deleteInventory,
	getInventoryPagination,
	setInventoryDeleteMark,
	getInventoryByName
} = require("../controllers/inventory.controller");
const uploadMulter = require("../middlewares/upload");

router.get("/all", verifyToken, getInventory);
router.get("/s/:id", verifyToken, getInventoryById);
router.get("/paginate", verifyToken, getInventoryPagination);
router.put("/s/:id", verifyToken, uploadMulter.any(), updateInventory);
router.post("/new", verifyToken, uploadMulter.any(), createInventory);
router.delete("/s/:id", verifyToken, deleteInventory);
router.get("/name", verifyToken, getInventoryByName);

// Delete and restore inventory
router.get(
	"/delete/:id",
	verifyToken,
	(req, res, next) => {
		req.delete = true;
		next();
	},
	setInventoryDeleteMark
);
router.get(
	"/restore/:id",
	verifyToken,
	(req, res, next) => {
		req.delete = false;
		next();
	},
	setInventoryDeleteMark
);

module.exports = router;
