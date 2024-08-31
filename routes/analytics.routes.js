// routes\analytics.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getDashboardAnalytics,
	getInventoryData,
	getVehicleData,
	getPartData,
	getUserData
} = require("../controllers/analytics.controller");
const checkRole = require("../middlewares/permission");

router.get("/count", verifyToken, checkRole(), getDashboardAnalytics);
router.get("/inventory", verifyToken, checkRole(), getInventoryData);
router.get("/part", verifyToken, checkRole(), getPartData);
router.get("/vehicle", verifyToken, checkRole(), getVehicleData);
router.get("/user", verifyToken, checkRole(), getUserData);

module.exports = router;
