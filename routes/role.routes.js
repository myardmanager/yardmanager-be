const express = require("express");
const router = express.Router();
const {
	getAllRoles,
	createRole,
	getRole,
	updateRole,
	deleteRole,
	paginateRoles,
	searchRoles
} = require("../controllers/role.controller");
const { verifyToken } = require("../middlewares/authorization");
const { runValidation } = require("../validators");
const { validateRole, validateUpdateRole } = require("../validators/roles.validator");
const checkRole = require("../middlewares/permission");

router.get("/all", verifyToken, checkRole(true), getAllRoles);
router.get("/s/:id", verifyToken, checkRole(true), getRole);
router.get("/paginate", verifyToken, checkRole(true), paginateRoles);
router.post("/new", verifyToken, checkRole(true), validateRole, runValidation, createRole);
router.put("/s/:id", verifyToken, checkRole(true), validateUpdateRole, runValidation, updateRole);
router.delete("/s/:id", verifyToken, checkRole(true), deleteRole);
router.get("/search", verifyToken, checkRole(true), searchRoles);

module.exports = router;
