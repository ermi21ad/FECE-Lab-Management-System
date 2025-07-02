const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../assets/attachments');
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Upload directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeId = req.body.equipment_id.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `attachment-${safeId}-${Date.now()}${ext}`;
    console.log('Generated filename:', filename);
    cb(null, filename);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file) {
      cb(null, true);
    } else {
      cb(new Error('No file provided'), false);
    }
  },
}).single('attachment');

const getEquipment = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT equipment_id, name, category, assigned_lab, quantity, status, `condition`, manufacturer, date_added, attachment, notes FROM equipment'
    );
    console.log('Equipment query result:', rows);
    res.json({ equipment: rows });
  } catch (err) {
    console.error('Get equipment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addEquipment = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      console.error('Upload validation error:', err);
      return res.status(400).json({ message: err.message });
    }

    const { equipment_id, name, category, assigned_lab, quantity, status, condition, manufacturer, date_added, notes } = req.body;
    const { admin_id } = req.user;

    if (!equipment_id || !name) {
      return res.status(400).json({ message: 'Equipment ID and name are required' });
    }

    try {
      const attachmentPath = req.file ? `/assets/attachments/${req.file.filename}` : null;
      const [result] = await pool.query(
        'INSERT INTO equipment (equipment_id, name, category, assigned_lab, quantity, status, `condition`, manufacturer, date_added, attachment, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          equipment_id,
          name,
          category || null,
          assigned_lab || null,
          quantity || 1,
          status || 'Available',
          condition || 'Good',
          manufacturer || null,
          date_added || null,
          attachmentPath,
          notes || null,
        ]
      );
      console.log('Add equipment result:', result);

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (user_id, user_role, action, timestamp) VALUES (?, ?, ?, NOW())',
        [admin_id, 'faculty-admin', `Added equipment ${equipment_id}`]
      );

      res.status(201).json({ message: 'Equipment added successfully' });
    } catch (err) {
      console.error('Add equipment error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

const updateEquipment = async (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      console.error('Upload validation error:', err);
      return res.status(400).json({ message: err.message });
    }

    const { equipment_id } = req.params;
    const { name, category, assigned_lab, quantity, status, condition, manufacturer, date_added, notes } = req.body;
    const { admin_id } = req.user;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    try {
      const [existing] = await pool.query('SELECT attachment FROM equipment WHERE equipment_id = ?', [equipment_id]);
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Equipment not found' });
      }

      const attachmentPath = req.file ? `/assets/attachments/${req.file.filename}` : existing[0].attachment;
      if (req.file && existing[0].attachment) {
        fs.unlink(path.join(__dirname, '../../', existing[0].attachment), (err) => {
          if (err) console.error('Failed to delete old attachment:', err);
        });
      }

      const [result] = await pool.query(
        'UPDATE equipment SET name = ?, category = ?, assigned_lab = ?, quantity = ?, status = ?, `condition` = ?, manufacturer = ?, date_added = ?, attachment = ?, notes = ? WHERE equipment_id = ?',
        [
          name,
          category || null,
          assigned_lab || null,
          quantity || 1,
          status || 'Available',
          condition || 'Good',
          manufacturer || null,
          date_added || null,
          attachmentPath,
          notes || null,
          equipment_id,
        ]
      );
      console.log('Update equipment result:', result);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Equipment not found' });
      }

      // Log activity
      await pool.query(
        'INSERT INTO activity_logs (user_id, user_role, action, timestamp) VALUES (?, ?, ?, NOW())',
        [admin_id, 'faculty-admin', `Updated equipment ${equipment_id}`]
      );

      res.json({ message: 'Equipment updated successfully' });
    } catch (err) {
      console.error('Update equipment error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

const deleteEquipment = async (req, res) => {
  const { equipment_id } = req.params;
  const { admin_id } = req.user;

  try {
    const [existing] = await pool.query('SELECT attachment FROM equipment WHERE equipment_id = ?', [equipment_id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (existing[0].attachment) {
      fs.unlink(path.join(__dirname, '../../', existing[0].attachment), (err) => {
        if (err) console.error('Failed to delete attachment:', err);
      });
    }

    const [result] = await pool.query('DELETE FROM equipment WHERE equipment_id = ?', [equipment_id]);
    console.log('Delete equipment result:', result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    // Log activity
    await pool.query(
      'INSERT INTO activity_logs (user_id, user_role, action, timestamp) VALUES (?, ?, ?, NOW())',
      [admin_id, 'faculty-admin', `Deleted equipment ${equipment_id}`]
    );

    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    console.error('Delete equipment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getEquipment, addEquipment, updateEquipment, deleteEquipment };