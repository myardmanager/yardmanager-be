const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authorization');
const { getInvoice, createInvoice, getAllInvoices, updateInvoice, deleteInvoice, paginateInvoices } = require('../controllers/invoice.controller');
const { validateInvoice, validateInvoiceUpdate } = require('../validators/invoice.validator');
const { runValidation } = require('../validators');
const checkRole = require('../middlewares/permission');

router.get('/s/:id', verifyToken, checkRole({companyId: true}), getInvoice);
router.post('/new', verifyToken, checkRole({companyId: true}), validateInvoice, runValidation, createInvoice);
router.get('/all', verifyToken, checkRole({companyId: true}), getAllInvoices);
router.put('/s/:id', verifyToken, checkRole({companyId: true}), validateInvoiceUpdate, runValidation, updateInvoice);
router.delete('/s/:id', verifyToken, checkRole({companyId: true}), deleteInvoice);
router.get('/paginate', verifyToken, checkRole({companyId: true}), paginateInvoices);

module.exports = router;
