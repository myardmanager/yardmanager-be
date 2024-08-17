// routes\company.routes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getAllCompanies,
	getCompany,
	createCompany,
	updateCompany,
	deleteCompany,
    pagination
} = require("../controllers/company.controller");
// const { validateCompany } = require("../validators/company.validator");
const { runValidation } = require("../validators");
const uploadMulter = require("../middlewares/upload");
const checkRole = require("../middlewares/permission");

router.get("/all", verifyToken, getAllCompanies);
router.get("/s/:id", verifyToken, getCompany);
router.post("/new", verifyToken, uploadMulter.any(), runValidation, createCompany);
router.put("/s/:id", verifyToken, checkRole(true), uploadMulter.any(), runValidation, updateCompany);
router.delete("/s/:id", verifyToken, deleteCompany);
router.get("/paginate", verifyToken, pagination);

module.exports = router;
