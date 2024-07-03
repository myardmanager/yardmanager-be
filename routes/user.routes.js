const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authorization");
const {
	getAllUsers,
	getUser,
	updateInfo,
	deleteUser,
	login,
	register
} = require("../controllers/user.controller");
const uploadMulter = require("../middlewares/upload");
const { validateUserWithCompany } = require("../validators/user.validator");
const { runValidation } = require("../validators");

router.get("/all", getAllUsers);
router.get("/s/:id", getUser);
router.put("/s/:id", updateInfo);
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

module.exports = router;
