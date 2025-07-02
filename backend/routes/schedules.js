const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedules');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware.authenticate, authMiddleware.authorize(['faculty-admin']), scheduleController.getSchedules);
router.post('/', authMiddleware.authenticate, authMiddleware.authorize(['faculty-admin']), scheduleController.addSchedule);
router.put('/:schedule_id', authMiddleware.authenticate, authMiddleware.authorize(['faculty-admin']), scheduleController.updateSchedule);

module.exports = router;