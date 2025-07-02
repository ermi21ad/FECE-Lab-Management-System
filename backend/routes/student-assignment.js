const express = require('express');
const router = express.Router();
const { submitAssignment } = require('../controllers/student-assignment');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize(['student']), submitAssignment);

module.exports = router;