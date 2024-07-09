const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getAllUsers,
	getUser,
	getInfo,
	updateInfo,
	deleteUser,
	login,
	register
} = require("../controllers/user.controller");
const uploadMulter = require("../middlewares/upload");
const { validateUserWithCompany } = require("../validators/user.validator");
const { runValidation } = require("../validators");
const { sendOtp, verifyOtp } = require("../controllers/otp.controller");

router.get("/all", getAllUsers);
router.get("/info", verifyToken, getInfo);
router.get("/s/:id", getUser);
router.put("/s/:id", verifyToken, updateInfo);
router.delete("/s/:id", deleteUser);
router.post("/login", login);
router.post(
	"/register",
	uploadMulter.fields([
		{ name: "profile", maxCount: 1 },
		{ name: "cover", maxCount: 1 },
		{ name: "companyImage", maxCount: 1 }
	]),
	validateUserWithCompany,
	runValidation,
	register
);
router.post("/forgot-password", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
