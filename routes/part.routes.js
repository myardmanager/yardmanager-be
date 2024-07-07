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

router.get("/all", verifyToken, getAllParts);
router.get("/s/:id", verifyToken, getPart);
router.post("/new", verifyToken, validatePart, runValidation, createPart);
router.put("/s/:id", verifyToken, validatePartUpdate, runValidation, updatePart);
router.delete("/s/:id", verifyToken, deletePart);
router.get("/paginate", verifyToken, paginateParts);
router.get("/search", verifyToken, searchPartsByName);

module.exports = router;
