const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const assignmentController = require('../controllers/lecturer-assignment');

// Routes for lecturer assignment management
router.get('/', authenticate, authorize(['lecturer']), assignmentController.getAllAssignments);
router.get('/:assignmentId/submissions', authenticate, authorize(['lecturer']), assignmentController.getSubmissions);
router.put('/submissions/:submissionId', authenticate, authorize(['lecturer']), assignmentController.updateSubmission);
router.get('/submissions/:submissionId/download', authenticate, authorize(['lecturer']), assignmentController.downloadSubmission);
router.get('/:assignmentId/download-all', authenticate, authorize(['lecturer']), assignmentController.downloadAllSubmissions);

module.exports = router;