const express = require('express');
const router = express.Router();
const { getAllRequests } = require('../controllers/lab-technician-request');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['lab-technician']), getAllRequests);

module.exports = router;