const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getProfile = async (req, res) => {
  console.log('Get student profile request:', { userId: req.user.userId, role: req.user.role });
  try {
    const query = 'SELECT student_id, full_name, email, batch FROM students WHERE student_id = ?';
    console.log('Executing query:', query, 'with params:', [req.user.userId]);
    const [student] = await pool.query(query, [req.user.userId]).catch(err => {
      console.error('Database query error:', err.message, err.stack);
      throw new Error('Database error: ' + err.message);
    });

    console.log('Query result:', student);

    if (!student || student.length === 0) {
      console.log('Student not found:', req.user.userId);
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('Profile fetched:', student[0]);
    res.status(200).json(student[0]);
  } catch (err) {
    console.error('Get profile error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.updateProfile = async (req, res) => {
  console.log('Raw req.body:', req.body);
  const { full_name, email, batch, currentPassword, newPassword, profile_picture } = req.body;

  console.log('Parsed profile update:', {
    userId: req.user.userId,
    full_name,
    email,
    batch,
    currentPassword: currentPassword ? '[Provided]' : '[Not provided]',
    newPassword: newPassword ? '[Provided]' : '[Not provided]',
    profile_picture: profile_picture ? '[Provided]' : '[Not provided]'
  });

  try {
    if (!full_name || !email || !batch) {
      console.log('Validation failed: Full name, email, or batch missing');
      return res.status(400).json({ message: 'Full name, email, and batch are required' });
    }

    const [student] = await pool.query('SELECT * FROM students WHERE student_id = ?', [req.user.userId]);
    if (student.length === 0) {
      console.log('Student not found:', req.user.userId);
      return res.status(404).json({ message: 'Student not found' });
    }

    let hashedPassword = student[0].password;
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, student[0].password);
      if (!isMatch) {
        console.log('Incorrect current password for:', req.user.userId);
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      hashedPassword = await bcrypt.hash(newPassword, 10);
    } else if (currentPassword || newPassword) {
      console.log('Validation failed: Both current and new password required');
      return res.status(400).json({ message: 'Both current and new password are required when updating password' });
    }

    if (profile_picture) {
      console.log('Profile picture received but not stored:', profile_picture);
    }

    const [result] = await pool.query(
      `UPDATE students SET
        full_name = ?, email = ?, batch = ?, password = ?
      WHERE student_id = ?`,
      [
        full_name,
        email,
        batch,
        hashedPassword,
        req.user.userId
      ]
    );

    if (result.affectedRows === 0) {
      console.log('No changes made for:', req.user.userId);
      return res.status(400).json({ message: 'No changes made' });
    }

    console.log('Update profile result:', result);
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err.message, err.stack);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};