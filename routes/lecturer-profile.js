const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/lecturer-profile');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', authenticate, authorize(['lecturer']), getProfile);
router.put('/', authenticate, authorize(['lecturer']), updateProfile);

module.exports = router;