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

router.get("/all", verifyToken, checkRole({companyId: true}), getAllRoles);
router.get("/s/:id", verifyToken, checkRole({companyId: true}), getRole);
router.get("/paginate", verifyToken, checkRole({companyId: true}), paginateRoles);
router.post("/new", verifyToken, checkRole({companyId: true}), validateRole, runValidation, createRole);
router.put("/s/:id", verifyToken, checkRole({companyId: true}), validateUpdateRole, runValidation, updateRole);
router.delete("/s/:id", verifyToken, checkRole({companyId: true}), deleteRole);
router.get("/search", verifyToken, checkRole({companyId: true}), searchRoles);

module.exports = router;
