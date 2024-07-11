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

router.get("/all", verifyToken, getAllVehicles);
router.get("/s/:id", verifyToken, getVehicle);
router.post("/new", verifyToken, uploadMulter.any(), validateVehicle, runValidation, createVehicle);
router.put("/s/:id", verifyToken, uploadMulter.any(), validateVehicleUpdate, runValidation, updateVehicle);
router.delete("/s/:id", verifyToken, deleteVehicle);
router.get("/paginate", verifyToken, paginateVehicles);
router.get("/decode/:vin", verifyToken, decodeVin);
router.post("/s/:id/inventory", verifyToken, addVehicleToInventory);

module.exports = router;
