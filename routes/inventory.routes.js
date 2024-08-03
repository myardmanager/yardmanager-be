const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getInventory,
	getInventoryById,
	updateInventory,
	createInventory,
	deleteInventory,
	deleteAllInventory,
	getInventoryPagination,
	setInventoryDeleteMark,
	getInventoryByName
} = require("../controllers/inventory.controller");
const uploadMulter = require("../middlewares/upload");
const checkRole = require("../middlewares/permission");

router.get("/all", verifyToken, checkRole(true), getInventory);
router.get("/s/:id", verifyToken, checkRole(true), getInventoryById);
router.get("/paginate", verifyToken, checkRole(), getInventoryPagination);	
router.put("/s/:id", verifyToken, checkRole(true), uploadMulter.any(), updateInventory);
router.post("/new", verifyToken, checkRole(true), uploadMulter.any(), createInventory);
router.delete("/s/:id", verifyToken, checkRole(true), deleteInventory);
router.get("/name", verifyToken, checkRole(true), getInventoryByName);
router.delete("/all", verifyToken, checkRole(true), deleteAllInventory);

// Delete and restore inventory
router.get(
	"/delete/:id",
	verifyToken,
	checkRole(true),
	(req, res, next) => {
		req.delete = true;
		next();
	},
	setInventoryDeleteMark
);
router.get(
	"/restore/:id",
	verifyToken,
	checkRole(true),
	(req, res, next) => {
		req.delete = false;
		next();
	},
	setInventoryDeleteMark
);

module.exports = router;
