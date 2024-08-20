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
	getCompaniesByName,
	pagination
} = require("../controllers/company.controller");
// const { validateCompany } = require("../validators/company.validator");
const { runValidation } = require("../validators");
const uploadMulter = require("../middlewares/upload");

router.get("/all", verifyToken, getAllCompanies);
router.get("/s/:id", verifyToken, getCompany);
router.post("/new", verifyToken, uploadMulter.any(), runValidation, createCompany);
router.put("/s/:id", verifyToken, runValidation, updateCompany);
router.delete("/s/:id", verifyToken, deleteCompany);
router.get("/paginate", verifyToken, pagination);
router.get("/name/:id", verifyToken, getCompaniesByName);

module.exports = router;
