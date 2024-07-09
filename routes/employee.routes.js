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

router.get("/all", verifyToken, getAllEmployees);
router.get("/s/:id", verifyToken, getEmployee);
router.post(
	"/new",
	verifyToken,
	uploadMulter.any(),
	validateEmployee,
	runValidation,
	createEmployee
);
router.put(
	"/s/:id",
	verifyToken,
	uploadMulter.any(),
	validateUpdateEmployee,
	runValidation,
	updateEmployee
);
router.delete("/s/:id", verifyToken, deleteEmployee);
router.get("/paginate", verifyToken, paginateEmployees);
// router.post("/login", login);

module.exports = router;
