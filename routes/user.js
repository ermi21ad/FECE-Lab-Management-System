const express = require('express');
const multer = require('multer');
const { registerUser, bulkRegisterUsers, listUsers, deleteUser, editUser } = require('../controllers/user');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post(
  '/register',
  authenticate,
  authorize(['faculty-admin']),
  registerUser
);

router.post(
  '/bulk-register',
  authenticate,
  authorize(['faculty-admin']),
  upload.single('file'),
  bulkRegisterUsers
);

router.get(
  '/list',
  authenticate,
  authorize(['faculty-admin']),
  listUsers
);

router.delete(
  '/delete',
  authenticate,
  authorize(['faculty-admin']),
  deleteUser
);

router.put(
  '/edit',
  authenticate,
  authorize(['faculty-admin']),
  editUser
);

module.exports = router;