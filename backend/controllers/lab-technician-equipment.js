// const pool = require('../config/db');
// const path = require('path');

// exports.getAllEquipment = async (req, res) => {
//   console.log('Fetching all equipment for lab technician:', {
//     userId: req.user.userId,
//     role: req.user.role,
//     query: req.query,
//     timestamp: new Date().toISOString()
//   });

//   const { page = 1, limit = 5, search = '' } = req.query;
//   const offset = (page - 1) * limit;
//   const searchTerm = `%${search}%`;

//   try {
//     const [equipment] = await pool.query(`
//       SELECT 
//         equipment_id,
//         name,
//         category,
//         assigned_lab,
//         quantity,
//         status,
//         condition
//       FROM equipment
//       WHERE name LIKE ? OR category LIKE ? OR assigned_lab LIKE ?
//       LIMIT ? OFFSET ?
//     `, [searchTerm, searchTerm, searchTerm, parseInt(limit), parseInt(offset)]);

//     const [[{ total }]] = await pool.query(`
//       SELECT COUNT(*) as total
//       FROM equipment
//       WHERE name LIKE ? OR category LIKE ? OR assigned_lab LIKE ?
//     `, [searchTerm, searchTerm, searchTerm]);

//     console.log('Equipment fetched:', {
//       count: equipment.length,
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sample: equipment.length > 0 ? equipment[0] : null,
//       timestamp: new Date().toISOString()
//     });

//     res.status(200).json({ equipment, total, page: parseInt(page), limit: parseInt(limit) });
//   } catch (err) {
//     console.error('Error fetching equipment:', {
//       message: err.message,
//       sql: err.sql || 'N/A',
//       code: err.code || 'N/A',
//       errno: err.errno || 'N/A',
//       stack: err.stack,
//       timestamp: new Date().toISOString()
//     });
//     res.status(500).json({ message: 'Server error: Unable to fetch equipment' });
//   }
// };

// exports.updateEquipment = async (req, res) => {
//   console.log('Updating equipment for lab technician:', {
//     userId: req.user.userId,
//     role: req.user.role,
//     equipmentId: req.params.id,
//     timestamp: new Date().toISOString()
//   });

//   const { id } = req.params;
//   const { condition, status, assigned_lab, notes } = req.body;

//   if (!condition || !status || !assigned_lab) {
//     console.warn('Validation failed for equipment update:', { condition, status, assigned_lab });
//     return res.status(400).json({ message: 'Condition, status, and assigned lab are required' });
//   }

//   try {
//     const [result] = await pool.query(`
//       UPDATE equipment
//       SET 
//         condition = ?,
//         status = ?,
//         assigned_lab = ?,
//         notes = ?,
//         updated_at = CURRENT_TIMESTAMP
//       WHERE equipment_id = ?
//     `, [condition, status, assigned_lab, notes || null, id]);

//     if (result.affectedRows === 0) {
//       console.warn('Equipment not found:', { equipmentId: id });
//       return res.status(404).json({ message: 'Equipment not found' });
//     }

//     console.log('Equipment updated:', { equipmentId: id, timestamp: new Date().toISOString() });

//     res.status(200).json({ message: 'Equipment updated successfully' });
//   } catch (err) {
//     console.error('Error updating equipment:', {
//       message: err.message,
//       sql: err.sql || 'N/A',
//       code: err.code,
//       errno: err.errno,
//       stack: err.stack,
//       timestamp: new Date().toISOString()
//     });
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// };

// exports.uploadImage = async (req, res) => {
//   console.log('Uploading equipment image for lab technician:', {
//     userId: req.user.userId,
//     role: req.user.role,
//     equipmentId: req.params.id,
//     timestamp: new Date().toISOString()
//   });

//   const { id } = req.params;
//   const file = req.files && req.files[0];

//   if (!file) {
//     console.warn('No file uploaded for equipment:', { equipmentId: id });
//     return res.status(400).json({ message: 'No file uploaded' });
//   }

//   const filePath = `/Uploads/${file.filename}`;

//   try {
//     const [result] = await pool.query(`
//       UPDATE equipment
//       SET 
//         attachment = ?,
//         updated_at = CURRENT_TIMESTAMP
//       WHERE equipment_id = ?
//     `, [filePath, id]);

//     if (result.affectedRows === 0) {
//       console.warn('Equipment not found:', { equipmentId: id });
//       return res.status(404).json({ message: 'Equipment not found' });
//     }

//     console.log('Equipment image uploaded:', { equipmentId: id, filePath, timestamp: new Date().toISOString() });

//     res.status(200).json({ message: 'Image uploaded successfully', attachment: filePath });
//   } catch (err) {
//     console.error('Error uploading equipment image:', {
//       message: err.message,
//       sql: err.sql || 'N/A',
//       code: err.code,
//       errno: err.errno,
//       stack: err.stack,
//       timestamp: new Date().toISOString()
//     });
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// };
const pool = require('../config/db');
const path = require('path');

exports.getAllEquipment = async (req, res) => {
  console.log('Fetching all equipment for lab technician:', {
    userId: req.user.userId,
    role: req.user.role,
    query: req.query,
    timestamp: new Date().toISOString()
  });

  const { page = 1, limit = 5, search = '' } = req.query;
  const offset = (page - 1) * limit;
  const searchTerm = `%${search}%`;

  try {
    const [equipment] = await pool.query(`
      SELECT 
        equipment_id,
        name,
        category,
        assigned_lab,
        quantity,
        status,
        \`condition\`
      FROM equipment
      WHERE name LIKE ? OR category LIKE ? OR assigned_lab LIKE ?
      LIMIT ? OFFSET ?
    `, [searchTerm, searchTerm, searchTerm, parseInt(limit), parseInt(offset)]);

    const [[{ total }]] = await pool.query(`
      SELECT COUNT(*) as total
      FROM equipment
      WHERE name LIKE ? OR category LIKE ? OR assigned_lab LIKE ?
    `, [searchTerm, searchTerm, searchTerm]);

    console.log('Equipment fetched:', {
      count: equipment.length,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      sample: equipment.length > 0 ? equipment[0] : null,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ equipment, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('Error fetching equipment:', {
      message: err.message,
      sql: err.sql || 'N/A',
      code: err.code || 'N/A',
      errno: err.errno || 'N/A',
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: Unable to fetch equipment' });
  }
};

exports.updateEquipment = async (req, res) => {
  console.log('Updating equipment for lab technician:', {
    userId: req.user.userId,
    role: req.user.role,
    equipmentId: req.params.id,
    timestamp: new Date().toISOString()
  });

  const { id } = req.params;
  const { condition, status, assigned_lab, notes } = req.body;

  if (!condition || !status || !assigned_lab) {
    console.warn('Validation failed for equipment update:', { condition, status, assigned_lab });
    return res.status(400).json({ message: 'Condition, status, and assigned lab are required' });
  }

  try {
    const [result] = await pool.query(`
      UPDATE equipment
      SET 
        \`condition\` = ?,
        status = ?,
        assigned_lab = ?,
        notes = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE equipment_id = ?
    `, [condition, status, assigned_lab, notes || null, id]);

    if (result.affectedRows === 0) {
      console.warn('Equipment not found:', { equipmentId: id });
      return res.status(404).json({ message: 'Equipment not found' });
    }

    console.log('Equipment updated:', { equipmentId: id, timestamp: new Date().toISOString() });

    res.status(200).json({ message: 'Equipment updated successfully' });
  } catch (err) {
    console.error('Error updating equipment:', {
      message: err.message,
      sql: err.sql || 'N/A',
      code: err.code,
      errno: err.errno,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.uploadImage = async (req, res) => {
  console.log('Uploading equipment image for lab technician:', {
    userId: req.user.userId,
    role: req.user.role,
    equipmentId: req.params.id,
    timestamp: new Date().toISOString()
  });

  const { id } = req.params;
  const file = req.files && req.files[0];

  if (!file) {
    console.warn('No file uploaded for equipment:', { equipmentId: id });
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = `/Uploads/${file.filename}`;

  try {
    const [result] = await pool.query(`
      UPDATE equipment
      SET 
        attachment = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE equipment_id = ?
    `, [filePath, id]);

    if (result.affectedRows === 0) {
      console.warn('Equipment not found:', { equipmentId: id });
      return res.status(404).json({ message: 'Equipment not found' });
    }

    console.log('Equipment image uploaded:', { equipmentId: id, filePath, timestamp: new Date().toISOString() });

    res.status(200).json({ message: 'Image uploaded successfully', attachment: filePath });
  } catch (err) {
    console.error('Error uploading equipment image:', {
      message: err.message,
      sql: err.sql || 'N/A',
      code: err.code,
      errno: err.errno,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};