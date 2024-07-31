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

router.get("/all", verifyToken, checkRole({companyId: true}), getAllParts);
router.get("/s/:id", verifyToken, checkRole({companyId: true}), getPart);
router.post("/new", verifyToken, checkRole({companyId: true}), validatePart, runValidation, createPart);
router.put("/s/:id", verifyToken, checkRole({companyId: true}), validatePartUpdate, runValidation, updatePart);
router.delete("/s/:id", verifyToken, checkRole({companyId: true}), deletePart);
router.get("/paginate", verifyToken, checkRole({companyId: true}), paginateParts);
router.get("/search", verifyToken, checkRole({companyId: true}), searchPartsByName);

module.exports = router;
