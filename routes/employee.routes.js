// routes\employee.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authorization");
const {
	getAllEmployees,
	getEmployee,
	createEmployee,
	updateEmployee,
	deleteEmployee,
	paginateEmployees,
	login
} = require("../controllers/employee.controller");
const { runValidation } = require("../validators");
const { validateEmployee, validateUpdateEmployee } = require("../validators/employee.validator");
const uploadMulter = require("../middlewares/upload");
const checkRole = require("../middlewares/permission");

router.get("/all", verifyToken, checkRole(true), getAllEmployees);
router.get("/s/:id", verifyToken, checkRole(true), getEmployee);
router.post(
	"/new",
	verifyToken, checkRole(true),
	uploadMulter.any(),
	validateEmployee,
	runValidation,
	createEmployee
);
router.put(
	"/s/:id",
	verifyToken, checkRole(true),
	uploadMulter.any(),
	validateUpdateEmployee,
	runValidation,
	updateEmployee
);
router.delete("/s/:id", verifyToken, checkRole(true), deleteEmployee);
router.get("/paginate", verifyToken, checkRole(true), paginateEmployees);
// router.post("/login", login);

module.exports = router;
