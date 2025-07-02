// const express = require('express');
// const router = express.Router();
// const { authenticate } = require('../middleware/auth');
// const {
//   getLecturerRequests,
//   addLecturerRequest,
//   updateLecturerRequest,
//   deleteLecturerRequest,
//   getLecturerRequestById
// } = require('../controllers/lecturer-requests');

// router.get('/', authenticate, getLecturerRequests);
// router.post('/', authenticate, addLecturerRequest);
// router.put('/:request_id', authenticate, updateLecturerRequest);
// router.delete('/:request_id', authenticate, deleteLecturerRequest);
// router.get('/request', authenticate, getLecturerRequestById);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const lecturerRequestsController = require('../controllers/lecturer-requests');

console.log('Lecturer requests controller:', lecturerRequestsController);

router.get('/', authenticate, authorize(['lecturer']), lecturerRequestsController.getRequests);
router.post('/', authenticate, authorize(['lecturer']), lecturerRequestsController.addRequest);

module.exports = router;