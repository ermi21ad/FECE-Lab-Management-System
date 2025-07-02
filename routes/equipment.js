const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getEquipment, addEquipment, updateEquipment, deleteEquipment } = require('../controllers/equipment');

// Faculty Admin only routes
router.get('/', authenticate, authorize(['faculty-admin']), getEquipment);
router.post('/', authenticate, authorize(['faculty-admin']), addEquipment);
router.put('/:equipment_id', authenticate, authorize(['faculty-admin']), updateEquipment);
router.delete('/:equipment_id', authenticate, authorize(['faculty-admin']), deleteEquipment);

module.exports = router;