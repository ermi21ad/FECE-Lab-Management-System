const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/lab-technician-profile');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['lab-technician']), getProfile);
router.put('/', authenticate, authorize(['lab-technician']), updateProfile);

module.exports = router;