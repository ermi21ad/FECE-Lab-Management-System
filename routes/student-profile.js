const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/student-profile');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['student']), getProfile);
router.put('/', authenticate, authorize(['student']), updateProfile);

module.exports = router;