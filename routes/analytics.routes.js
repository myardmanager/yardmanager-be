// routes\analytics.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getDashboardAnalytics,
	getInventoryData,
	getPartData
} = require("../controllers/analytics.controller");
const checkRole = require("../middlewares/permission");

router.get("/count", verifyToken, checkRole(), getDashboardAnalytics);
router.get("/inventory", verifyToken, checkRole(), getInventoryData);
router.get("/part", verifyToken, checkRole(), getPartData);

module.exports = router;
