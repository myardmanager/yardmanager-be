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

router.get("/all", verifyToken, checkRole({companyId: true}), getAllLocations);
router.get("/s/:id", verifyToken, checkRole({companyId: true}), getLocation);
router.post("/new", verifyToken, checkRole({companyId: true}), validateLocation, runValidation, createLocation);
router.put("/s/:id", verifyToken, checkRole({companyId: true}), validateLocation, runValidation, updateLocation);
router.delete("/s/:id", verifyToken, checkRole({companyId: true}), deleteLocation);
router.get("/paginate", verifyToken, checkRole({companyId: true}), paginateLocations);
router.get("/search", verifyToken, checkRole({companyId: true}), searchLocations);

module.exports = router;
