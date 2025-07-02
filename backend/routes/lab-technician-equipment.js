const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const equipmentController = require('../controllers/lab-technician-equipment');

// Routes for lab technician equipment management
router.get('/', authenticate, authorize(['lab-technician']), equipmentController.getAllEquipment);
router.put('/:id', authenticate, authorize(['lab-technician']), equipmentController.updateEquipment);
router.post('/:id/image', authenticate, authorize(['lab-technician']), equipmentController.uploadImage);

module.exports = router;