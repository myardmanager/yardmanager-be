const express = require('express');
const router = express.Router();
const { getAllRoles, createRole, getRole, updateRole, deleteRole, paginateRoles } = require('../controllers/role.controller');
const { verifyToken } = require('../middlewares/authorization');
const { runValidation } = require('../validators');
const { validateRole, validateUpdateRole } = require('../validators/roles.validator');

router.get('/all', verifyToken, getAllRoles);
router.get('/s/:id', verifyToken, getRole);
router.get('/paginate', verifyToken, paginateRoles);
router.post('/new', verifyToken, validateRole, runValidation, createRole);
router.put('/s/:id', verifyToken, validateUpdateRole, runValidation, updateRole);
router.delete('/s/:id', verifyToken, deleteRole);

module.exports = router;
