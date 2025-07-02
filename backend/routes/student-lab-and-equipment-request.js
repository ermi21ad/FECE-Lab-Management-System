const express = require('express');
const router = express.Router();
const { submitBookingRequest, getBookingRequests } = require('../controllers/student-lab-and-equipment-request');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['student']), submitBookingRequest);
router.get('/', authenticate, authorize(['student']), getBookingRequests);

module.exports = router;