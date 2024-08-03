const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authorization");
const {
	getAllParts,
	getPart,
	createPart,
	updatePart,
	deletePart,
	paginateParts,
	searchPartsByName
} = require("../controllers/part.controller");
const { runValidation } = require("../validators");
const { validatePart, validatePartUpdate } = require("../validators/part.validator");
const checkRole = require("../middlewares/permission");

router.get("/all", verifyToken, checkRole(true), getAllParts);
router.get("/s/:id", verifyToken, checkRole(true), getPart);
router.post("/new", verifyToken, checkRole(true), validatePart, runValidation, createPart);
router.put("/s/:id", verifyToken, checkRole(true), validatePartUpdate, runValidation, updatePart);
router.delete("/s/:id", verifyToken, checkRole(true), deletePart);
router.get("/paginate", verifyToken, checkRole(true), paginateParts);
router.get("/search", verifyToken, checkRole(true), searchPartsByName);

module.exports = router;
