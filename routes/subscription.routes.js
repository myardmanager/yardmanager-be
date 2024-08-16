// routes\subscription.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	subscribeCustomer,
	getSubscriptions,
	getSubscription,
  getInvoices,
	// updateSubscription,
	cancelSubscription,
    // resumeSubscription,
    // getSubscriptionInvoices
} = require("../controllers/subscription.controller");
const checkRole = require("../middlewares/permission");

router.post("/new", subscribeCustomer);
// router.post("/subscription", verifyToken, subscribeCustomer);
router.get("/all", verifyToken, checkRole(false, true), getSubscriptions);
router.get("/invoices", verifyToken, getInvoices);
router.get("/subscription", verifyToken, checkRole(false, true), getSubscription);
router.get("/subscription/:plan", verifyToken, checkRole(false, true), getSubscription);
// router.put("/s/:id", verifyToken, checkRole(false, true), updateSubscription);
router.get("/cancel/:id", verifyToken, checkRole(false, true), cancelSubscription);
// router.put("/resume/:id", verifyToken, checkRole(false, true), resumeSubscription);
// router.get("/invoices/:id", verifyToken, checkRole(false, true), getSubscriptionInvoices);

module.exports = router;
