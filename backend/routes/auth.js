
// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const pool = require('../config/db');

// router.post('/login', async (req, res) => {
//   const { id_number, password } = req.body;
//   console.log('Login attempt:', { id_number });

//   try {
//     if (!id_number || !password) {
//       console.log('Login failed: Missing credentials');
//       return res.status(400).json({ message: 'ID number and password are required' });
//     }

//     let user, role;
//     console.log('Checking faculty_admins');
//     let [rows] = await pool.query('SELECT admin_id, full_name, password FROM faculty_admins WHERE admin_id = ?', [id_number]);
//     if (rows.length > 0) {
//       user = rows[0];
//       role = 'faculty-admin';
//     } else {
//       console.log('Checking lecturers');
//       [rows] = await pool.query('SELECT lecturer_id, full_name, password FROM lecturers WHERE lecturer_id = ?', [id_number]);
//       if (rows.length > 0) {
//         user = rows[0];
//         role = 'lecturer';
//       } else {
//         console.log('Checking students');
//         [rows] = await pool.query('SELECT student_id, full_name, password FROM students WHERE student_id = ?', [id_number]);
//         if (rows.length > 0) {
//           user = rows[0];
//           role = 'student';
//         } else {
//           console.log('Checking lab_technicians');
//           [rows] = await pool.query('SELECT technician_id, full_name, password FROM lab_technicians WHERE technician_id = ?', [id_number]);
//           if (rows.length > 0) {
//             user = rows[0];
//             role = 'lab-technician';
//           }
//         }
//       }
//     }

//     if (!user) {
//       console.log('Login failed: User not found:', id_number);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     console.log('Verifying password for:', id_number);
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log('Login failed: Incorrect password for:', id_number);
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id_number, role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     console.log('Login successful:', { id_number, role });
//     res.status(200).json({ token, role });
//   } catch (err) {
//     console.error('Login error:', err.message, err.stack);
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

router.post('/login', async (req, res) => {
  const { id_number, password } = req.body;
  console.log('Login attempt:', { id_number });

  try {
    if (!id_number || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({ message: 'ID number and password are required' });
    }

    let user, role;
    console.log('Checking faculty_admins');
    let [rows] = await pool.query('SELECT admin_id, full_name, password FROM faculty_admins WHERE admin_id = ?', [id_number]);
    if (rows.length > 0) {
      user = rows[0];
      role = 'faculty-admin';
    } else {
      console.log('Checking lecturers');
      [rows] = await pool.query('SELECT lecturer_id, full_name, password FROM lecturers WHERE lecturer_id = ?', [id_number]);
      if (rows.length > 0) {
        user = rows[0];
        role = 'lecturer';
      } else {
        console.log('Checking students');
        [rows] = await pool.query('SELECT student_id, full_name, password FROM students WHERE student_id = ?', [id_number]);
        if (rows.length > 0) {
          user = rows[0];
          role = 'student';
        } else {
          console.log('Checking lab_technicians');
          [rows] = await pool.query('SELECT technician_id, full_name, password FROM lab_technicians WHERE technician_id = ?', [id_number]);
          if (rows.length > 0) {
            user = rows[0];
            role = 'lab-technician';
          }
        }
      }
    }

    if (!user) {
      console.log('Login failed: User not found:', id_number);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Verifying password for:', id_number);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login failed: Incorrect password for:', id_number);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id_number, role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1h' }
    );

    console.log('Login successful:', { id_number, role, token: token ? '[Present]' : '[Missing]' });
    res.status(200).json({ token, role });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

module.exports = router;