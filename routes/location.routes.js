const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getAllLocations,
	getLocation,
	createLocation,
	updateLocation,
	deleteLocation,
	paginateLocations
} = require("../controllers/location.controller");
const { validateLocation } = require("../validators/location.validator");
const { runValidation } = require("../validators");

router.get("/all", verifyToken, getAllLocations);
router.get("/s/:id", verifyToken, getLocation);
router.post("/new", verifyToken, validateLocation, runValidation, createLocation);
router.put("/s/:id", verifyToken, validateLocation, runValidation, updateLocation);
router.delete("/s/:id", verifyToken, deleteLocation);
router.get("/paginate", verifyToken, paginateLocations);

module.exports = router;
