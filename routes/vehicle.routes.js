const express = require("express");
const router = express.Router();
const {
	getAllVehicles,
	getVehicle,
	createVehicle,
	updateVehicle,
	deleteVehicle,
	paginateVehicles
} = require("../controllers/vehicle.controller");
const { runValidation } = require("../validators");
const { validateVehicle, validateVehicleUpdate } = require("../validators/vehicle.validator");
const { verifyToken } = require("../middlewares/authorization");

router.get("/all", verifyToken, getAllVehicles);
router.get("/s/:id", verifyToken, getVehicle);
router.post("/new", verifyToken, validateVehicle, runValidation, createVehicle);
router.put("/s/:id", verifyToken, validateVehicleUpdate, runValidation, updateVehicle);
router.delete("/s/:id", verifyToken, deleteVehicle);
router.get("/paginate", verifyToken, paginateVehicles);

module.exports = router;
