const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const facultyProfileController = require('../controllers/faculty-profile');

// Routes
console.log('Loading faculty-profile routes:', {
  routes: ['GET /'],
  timestamp: new Date().toISOString()
});

router.get('/', authenticate, authorize(['faculty-admin']), facultyProfileController.getProfile);

module.exports = router;