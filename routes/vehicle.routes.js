const express = require("express");
const router = express.Router();
const {
	getAllVehicles,
	getVehicle,
	createVehicle,
	updateVehicle,
	deleteVehicle,
  paginateVehicles,
  decodeVin,
  addVehicleToInventory
} = require("../controllers/vehicle.controller");
const { runValidation } = require("../validators");
const { validateVehicle, validateVehicleUpdate } = require("../validators/vehicle.validator");
const { verifyToken } = require("../middlewares/authorization");
const uploadMulter = require("../middlewares/upload");
const checkRole = require("../middlewares/permission");

router.get("/all", verifyToken, checkRole(true), getAllVehicles);
router.get("/s/:id", verifyToken, checkRole(true), getVehicle);
router.post("/new", verifyToken, checkRole(true), uploadMulter.any(), validateVehicle, runValidation, createVehicle);
router.put("/s/:id", verifyToken, checkRole(true), uploadMulter.any(), validateVehicleUpdate, runValidation, updateVehicle);
router.delete("/s/:id", verifyToken, checkRole(true), deleteVehicle);
router.get("/paginate", verifyToken, checkRole(true), paginateVehicles);
router.get("/decode/:vin", verifyToken, checkRole(true), decodeVin);
router.get("/s/:id/inventory", verifyToken, checkRole(true), addVehicleToInventory);

module.exports = router;
