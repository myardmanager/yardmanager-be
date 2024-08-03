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

router.get("/count", verifyToken, checkRole({companyId: true}), getDashboardAnalytics);
router.get("/inventory", verifyToken, checkRole({companyId: true}), getInventoryData);
router.get("/part", verifyToken, checkRole({companyId: true}), getPartData);

module.exports = router;
