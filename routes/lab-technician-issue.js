const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const issueController = require('../controllers/lab-technician-issue');

// Routes for lab technician issue reporting
router.get('/', authenticate, authorize(['lab-technician']), issueController.getAllIssues);
router.post('/', authenticate, authorize(['lab-technician']), issueController.createIssue);

module.exports = router;