const express = require('express');
const router = express.Router();
const lecturerSchedulesController = require('../controllers/lecturer-schedules');
const authMiddleware = require('../middleware/auth');

console.log('Lecturer schedules controller:', lecturerSchedulesController);
console.log('Auth middleware:', authMiddleware);

router.get('/', authMiddleware.authenticate, lecturerSchedulesController.getSchedules);

module.exports = router;