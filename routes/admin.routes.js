const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authorization');
const { register, login, getInfo } = require('../controllers/admin.controller');
const uploadMulter = require('../middlewares/upload');

router.post('/register', uploadMulter.any(), register);
router.post('/login', login);
router.get('/info', verifyToken, getInfo);

module.exports = router;
