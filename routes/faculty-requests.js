const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const facultyRequestsController = require('../controllers/faculty-requests');

console.log('Loading faculty-requests routes:', {
  routes: ['GET /', 'PUT /:requestId/approve', 'PUT /:requestId/reject'],
  timestamp: new Date().toISOString()
});

// Decode requestId to handle encoded slashes (e.g., REQ%2F003)
router.param('requestId', (req, res, next, requestId) => {
  req.params.requestId = decodeURIComponent(requestId);
  console.log('Decoded requestId:', { requestId: req.params.requestId, timestamp: new Date().toISOString() });
  next();
});

// Routes
router.get('/', authenticate, authorize(['faculty-admin']), facultyRequestsController.getAllRequests);
router.put('/:requestId/approve', authenticate, authorize(['faculty-admin']), facultyRequestsController.approveRequest);
router.put('/:requestId/reject', authenticate, authorize(['faculty-admin']), facultyRequestsController.rejectRequest);

module.exports = router;