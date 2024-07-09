// routes\analytics.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const { getDashboardAnalytics, getInventoryData } = require("../controllers/analytics.controller");

router.get("/count", verifyToken, getDashboardAnalytics);
router.get("/inventory", verifyToken, getInventoryData);

module.exports = router;
