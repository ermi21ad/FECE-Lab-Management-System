// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const pool = require('../config/db');

// console.log('Auth controller loaded');

// const login = async (req, res) => {
//   const { id_number, password } = req.body;

//   console.log('Login attempt:', req.body);

//   if (!id_number || !password) {
//     return res.status(400).json({ message: 'ID Number and password are required' });
//   }

//   try {
//     let user = null;
//     let role = null;

//     if (id_number.startsWith('FA/')) {
//       const [rows] = await pool.query('SELECT * FROM faculty_admins WHERE admin_id = ?', [id_number]);
//       user = rows[0];
//       role = 'faculty-admin';
//     } else if (id_number.startsWith('NSR/')) {
//       const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [id_number]);
//       user = rows[0];
//       role = 'student';
//     } else if (id_number.startsWith('LEC/')) {
//       const [rows] = await pool.query('SELECT * FROM lecturers WHERE lecturer_id = ?', [id_number]);
//       user = rows[0];
//       role = 'lecturer';
//     } else if (id_number.startsWith('LAB/')) {
//       const [rows] = await pool.query('SELECT * FROM lab_technicians WHERE technician_id = ?', [id_number]);
//       user = rows[0];
//       role = 'lab-technician';
//     } else {
//       return res.status(400).json({ message: 'Invalid ID Number format' });
//     }

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: id_number, role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.json({ token, role });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { login };
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

console.log('Auth controller loaded');

const login = async (req, res) => {
  const { id_number, password } = req.body;

  console.log('Login attempt:', req.body);

  if (!id_number || !password) {
    return res.status(400).json({ message: 'ID Number and password are required' });
  }

  try {
    let user = null;
    let role = null;

    if (id_number.startsWith('FA/')) {
      const [rows] = await pool.query('SELECT * FROM faculty_admins WHERE admin_id = ?', [id_number]);
      user = rows[0];
      role = 'faculty-admin';
    } else if (id_number.startsWith('NSR/')) {
      const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [id_number]);
      user = rows[0];
      role = 'student';
    } else if (id_number.startsWith('LEC/')) {
      const [rows] = await pool.query('SELECT * FROM lecturers WHERE lecturer_id = ?', [id_number]);
      user = rows[0];
      role = 'lecturer';
    } else if (id_number.startsWith('LAB/')) {
      const [rows] = await pool.query('SELECT * FROM lab_technicians WHERE technician_id = ?', [id_number]);
      user = rows[0];
      role = 'lab-technician';
    } else {
      return res.status(400).json({ message: 'Invalid ID Number format' });
    }

    if (!user) {
      console.log('Login failed: User not found:', id_number);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login failed: Incorrect password for:', id_number);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id_number, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful:', { id_number, role, token: token.substring(0, 20) + '...' });
    res.json({ token, role });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login };