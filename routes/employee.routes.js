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
  paginateEmployees
} = require("../controllers/employee.controller");
const { runValidation } = require("../validators");
const { validateEmployee, validateEmployeeUpdate } = require("../validators/employee.validator");

router.get("/all", verifyToken, getAllEmployees);
router.get("/s/:id", verifyToken, getEmployee);
router.post("/new", verifyToken, validateEmployee, runValidation, createEmployee);
router.put("/s/:id", verifyToken, validateEmployeeUpdate, runValidation, updateEmployee);
router.delete("/s/:id", verifyToken, deleteEmployee);
router.get("/paginate", verifyToken, paginateEmployees);

module.exports = router;
