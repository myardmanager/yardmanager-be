const express = require('express');
const router = express.Router();
const { getAllRoles, createRole, getRole, updateRole, deleteRole } = require('../controllers/role.controller');

router.get('/all', getAllRoles);
router.post('/new', createRole);
router.get('/s/:id', getRole);
router.put('/s/:id', updateRole);
router.delete('/s/:id', deleteRole);

module.exports = router;
