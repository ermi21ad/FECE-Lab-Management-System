const pool = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;

exports.getProfile = async (req, res) => {
  console.log('Get lab technician profile:', { userId: req.user.userId });

  try {
    const technician_id = req.user.userId;
    const query = `
      SELECT technician_id, full_name, email, assigned_lab_id, profile_picture
      FROM lab_technicians
      WHERE technician_id = ?
    `;
    const [rows] = await pool.query(query, [technician_id]);

    if (rows.length === 0) {
      console.log('Technician not found:', technician_id);
      return res.status(404).json({ message: 'Technician not found' });
    }

    const profile = rows[0];
    // Convert profile_picture to base64 if present
    if (profile.profile_picture) {
      profile.profile_picture = Buffer.from(profile.profile_picture).toString('base64');
    }

    console.log('Profile fetched:', { technician_id });
    res.status(200).json(profile);
  } catch (err) {
    console.error('Get profile error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.updateProfile = async (req, res) => {
  console.log('Update lab technician profile:', { userId: req.user.userId, body: req.body, files: req.files });

  try {
    const technician_id = req.user.userId;
    const { full_name, email, current_password, new_password, confirm_password } = req.body;

    // Validate input
    if (!full_name || !email) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    // Fetch current profile
    const [rows] = await pool.query('SELECT password, email FROM lab_technicians WHERE technician_id = ?', [technician_id]);
    if (rows.length === 0) {
      console.log('Technician not found:', technician_id);
      return res.status(404).json({ message: 'Technician not found' });
    }

    const technician = rows[0];

    // Handle password change
    let passwordUpdate = null;
    if (current_password || new_password || confirm_password) {
      if (!current_password || !new_password || !confirm_password) {
        console.log('Missing password fields');
        return res.status(400).json({ message: 'Current password, new password, and confirm password are required' });
      }
      if (new_password !== confirm_password) {
        console.log('Password mismatch');
        return res.status(400).json({ message: 'New password and confirm password do not match' });
      }
      const isMatch = await bcrypt.compare(current_password, technician.password);
      if (!isMatch) {
        console.log('Invalid current password');
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      passwordUpdate = await bcrypt.hash(new_password, 10);
    }

    // Handle profile picture
    let profilePicture = null;
    if (req.files && req.files.length > 0) {
      const file = req.files[0];
      if (!file.mimetype.startsWith('image/')) {
        console.log('Invalid file type:', file.mimetype);
        return res.status(400).json({ message: 'Only image files are allowed' });
      }
      profilePicture = await fs.readFile(file.path);
      await fs.unlink(file.path).catch(err => console.warn('Failed to delete temp file:', err.message));
    }

    // Update profile
    const query = `
      UPDATE lab_technicians
      SET full_name = ?, email = ?, ${passwordUpdate ? 'password = ?,' : ''} ${profilePicture ? 'profile_picture = ?' : 'profile_picture = profile_picture'}
      WHERE technician_id = ?
    `;
    const params = [full_name, email];
    if (passwordUpdate) params.push(passwordUpdate);
    if (profilePicture) params.push(profilePicture);
    params.push(technician_id);

    await pool.query(query, params);

    console.log('Profile updated:', { technician_id });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};