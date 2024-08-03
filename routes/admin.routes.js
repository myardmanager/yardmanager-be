const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/authorization");
const {
  register,
  login,
  getInfo,
  updateInfo,
  updateImages,
} = require("../controllers/admin.controller");
const uploadMulter = require("../middlewares/upload");

router.post("/register", uploadMulter.any(), register);
router.post("/login", login);
router.get("/info", verifyToken, getInfo);
router.put("/update", verifyToken, updateInfo);
router.put(
  "/update/images",
  verifyToken,
  uploadMulter.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  updateImages
);

module.exports = router;
