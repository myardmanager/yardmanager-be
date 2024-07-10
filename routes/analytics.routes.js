// routes\analytics.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getDashboardAnalytics,
	getInventoryData,
	getPartData
} = require("../controllers/analytics.controller");

router.get("/count", verifyToken, getDashboardAnalytics);
router.get("/inventory", verifyToken, getInventoryData);
router.get("/part", verifyToken, getPartData);

module.exports = router;
