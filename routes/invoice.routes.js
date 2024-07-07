const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authorization');
const { getInvoice, createInvoice, getAllInvoices, updateInvoice, deleteInvoice, paginateInvoices } = require('../controllers/invoice.controller');

router.get('/s/:id', verifyToken, getInvoice);
router.post('/new', verifyToken, createInvoice);
router.get('/all', verifyToken, getAllInvoices);
router.put('/s/:id', verifyToken, updateInvoice);
router.delete('/s/:id', verifyToken, deleteInvoice);
router.get('/paginate', verifyToken, paginateInvoices);

module.exports = router;
