const express = require('express');
const router = express.Router();
const { getSchedules } = require('../controllers/student-schedule');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['student']), getSchedules);

module.exports = router;