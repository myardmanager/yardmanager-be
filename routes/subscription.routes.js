// routes\subscription.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	subscribeCustomer,
	getSubscriptions,
	getSubscription,
  getInvoices,
	getCards,
	newCard,
	deleteCard,
	// updateSubscription,
	cancelSubscription,
	newCustomerSubscription,
    // resumeSubscription,
    // getSubscriptionInvoices
} = require("../controllers/subscription.controller");
const checkRole = require("../middlewares/permission");
const { runValidation } = require("../validators");
const { validateCard } = require("../validators/subscription.validator");

router.post("/new", subscribeCustomer);
// router.post("/subscription", verifyToken, subscribeCustomer);
router.get("/all", verifyToken, checkRole(false, true), getSubscriptions);
router.get("/invoices", verifyToken, getInvoices);
router.get("/subscription", verifyToken, checkRole(true), getSubscription);
router.get("/subscription/:plan", verifyToken, checkRole(true), getSubscription);
router.post("/new-subscription", verifyToken, newCustomerSubscription);
router.get("/cards", verifyToken, checkRole(false, true), getCards);
router.post("/new-card", validateCard, runValidation, verifyToken, newCard);
router.delete("/delete-card/:id", verifyToken, checkRole(false, true), deleteCard);
// router.put("/s/:id", verifyToken, checkRole(false, true), updateSubscription);
router.get("/cancel/:id", verifyToken, checkRole(false, true), cancelSubscription);
// router.put("/resume/:id", verifyToken, checkRole(false, true), resumeSubscription);
// router.get("/invoices/:id", verifyToken, checkRole(false, true), getSubscriptionInvoices);

module.exports = router;
