const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const facultyIssueController = require('../controllers/faculty-issue');

// Routes
console.log('Loading faculty-issue routes:', {
  routes: ['GET /', 'PUT /:issue_id'],
  timestamp: new Date().toISOString()
});

router.get('/', authenticate, authorize(['faculty-admin']), facultyIssueController.getIssues);
router.put('/:issue_id', authenticate, authorize(['faculty-admin']), facultyIssueController.updateIssue);

module.exports = router;