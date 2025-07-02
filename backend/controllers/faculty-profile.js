const pool = require('../config/db');
const path = require('path');

exports.getProfile = async (req, res) => {
  console.log('Entering getProfile:', {
    userId: req.user.userId,
    timestamp: new Date().toISOString()
  });

  try {
    console.log('Executing query for admin_id:', req.user.userId);
    const [rows] = await pool.query(
      `SELECT admin_id, full_name, email, phone_number, address, profile_picture
       FROM faculty_admins
       WHERE admin_id = ?`,
      [req.user.userId]
    );

    console.log('Query result:', { rows: rows ? rows.length : 'undefined' });

    if (!rows || rows.length === 0) {
      console.warn('Profile not found:', { userId: req.user.userId });
      return res.status(404).json({ message: 'Profile not found' });
    }

    const profile = {
      admin_id: rows[0].admin_id,
      full_name: rows[0].full_name,
      email: rows[0].email,
      phone_number: rows[0].phone_number || '',
      address: rows[0].address || '',
      profile_picture: rows[0].profile_picture
        ? `/Uploads/${rows[0].profile_picture}`
        : '/assets/images/default-profile.jpg'
    };

    console.log('Profile fetched:', { admin_id: profile.admin_id });
    res.json(profile);
  } catch (err) {
    console.error('Error in getProfile:', {
      message: err.message,
      stack: err.stack,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = exports;