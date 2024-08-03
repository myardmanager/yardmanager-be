const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getAllLocations,
	getLocation,
	createLocation,
	updateLocation,
	deleteLocation,
	paginateLocations,
	searchLocations
} = require("../controllers/location.controller");
const { validateLocation } = require("../validators/location.validator");
const { runValidation } = require("../validators");
const checkRole = require("../middlewares/permission");

router.get("/all", verifyToken, checkRole(true), getAllLocations);
router.get("/s/:id", verifyToken, checkRole(true), getLocation);
router.post("/new", verifyToken, checkRole(true), validateLocation, runValidation, createLocation);
router.put("/s/:id", verifyToken, checkRole(true), validateLocation, runValidation, updateLocation);
router.delete("/s/:id", verifyToken, checkRole(true), deleteLocation);
router.get("/paginate", verifyToken, checkRole(true), paginateLocations);
router.get("/search", verifyToken, checkRole(true), searchLocations);

module.exports = router;
