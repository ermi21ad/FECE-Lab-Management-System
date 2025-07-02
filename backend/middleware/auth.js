
// // // // const jwt = require('jsonwebtoken');
// // // // const pool = require('../config/db');

// // // // const authenticate = async (req, res, next) => {
// // // //   const authHeader = req.header('Authorization');
// // // //   console.log('Auth middleware: Received token:', authHeader ? 'Present' : 'Missing');

// // // //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// // // //     console.log('Auth middleware: No valid token provided');
// // // //     return res.status(401).json({ message: 'No token provided' });
// // // //   }

// // // //   const token = authHeader.replace('Bearer ', '');

// // // //   try {
// // // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // // //     console.log('Auth middleware: Decoded token:', decoded);

// // // //     const [rows] = await pool.query('SELECT admin_id, full_name FROM faculty_admins WHERE admin_id = ?', [decoded.id_number]);
// // // //     if (rows.length === 0) {
// // // //       console.log('Auth middleware: User not found in faculty_admins:', decoded.id_number);
// // // //       return res.status(401).json({ message: 'Invalid token: User not found' });
// // // //     }

// // // //     req.user = {
// // // //       userId: rows[0].admin_id,
// // // //       name: rows[0].full_name,
// // // //       role: decoded.role // 'faculty-admin'
// // // //     };
// // // //     console.log('Auth middleware: User authenticated:', req.user);
// // // //     next();
// // // //   } catch (err) {
// // // //     console.error('Auth middleware error:', err.message, err.stack);
// // // //     res.status(401).json({ message: 'Token verification failed: ' + err.message });
// // // //   }
// // // // };

// // // // const authorize = (roles) => {
// // // //   return (req, res, next) => {
// // // //     console.log('Authorize middleware: Checking role:', req.user.role, 'against', roles);
// // // //     if (!roles.includes(req.user.role)) {
// // // //       console.log('Authorize middleware: Unauthorized role:', req.user.role);
// // // //       return res.status(403).json({ message: 'Unauthorized: Insufficient role' });
// // // //     }
// // // //     next();
// // // //   };
// // // // };

// // // // module.exports = { authenticate, authorize };
// // // // const jwt = require('jsonwebtoken');
// // // // const pool = require('../config/db');

// // // // exports.authenticate = async (req, res, next) => {
// // // //   const token = req.header('Authorization')?.replace('Bearer ', '');
// // // //   console.log('Authenticate middleware - Token:', token ? '[Present]' : '[Missing]');

// // // //   if (!token) {
// // // //     console.log('Authenticate failed: No token provided');
// // // //     return res.status(401).json({ message: 'No token provided' });
// // // //   }

// // // //   try {
// // // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // // //     console.log('Token decoded:', decoded);

// // // //     // Check if user exists
// // // //     const [user] = await pool.query(
// // // //       'SELECT lecturer_id FROM lecturers WHERE lecturer_id = ?',
// // // //       [decoded.id_number]
// // // //     );
// // // //     console.log('User lookup:', user);

// // // //     if (user.length === 0) {
// // // //       console.log('Authenticate failed: User not found:', decoded.id_number);
// // // //       return res.status(401).json({ message: 'Invalid token: User not found' });
// // // //     }

// // // //     req.user = { userId: decoded.id_number, role: decoded.role };
// // // //     console.log('Authenticate success:', req.user);
// // // //     next();
// // // //   } catch (err) {
// // // //     console.error('Authenticate error:', err.message, err.stack);
// // // //     return res.status(401).json({ message: 'Invalid token: ' + err.message });
// // // //   }
// // // // };

// // // // exports.authorize = (roles) => {
// // // //   return (req, res, next) => {
// // // //     console.log('Authorize middleware - User role:', req.user.role, 'Allowed roles:', roles);
// // // //     if (!roles.includes(req.user.role)) {
// // // //       console.log('Authorize failed: Role not authorized:', req.user.role);
// // // //       return res.status(403).json({ message: 'Access denied' });
// // // //     }
// // // //     console.log('Authorize success:', req.user.role);
// // // //     next();
// // // //   };
// // // // };
// // // const jwt = require('jsonwebtoken');
// // // const pool = require('../config/db');

// // // exports.authenticate = async (req, res, next) => {
// // //   const token = req.header('Authorization')?.replace('Bearer ', '');
// // //   console.log('Authenticate middleware - Token:', token ? '[Present]' : '[Missing]');

// // //   if (!token) {
// // //     console.log('Authenticate failed: No token provided');
// // //     return res.status(401).json({ message: 'No token provided' });
// // //   }

// // //   try {
// // //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// // //     console.log('Token decoded:', { id_number: decoded.id_number, role: decoded.role });

// // //     let user;
// // //     if (decoded.role === 'lecturer') {
// // //       [user] = await pool.query(
// // //         'SELECT lecturer_id, full_name FROM lecturers WHERE lecturer_id = ?',
// // //         [decoded.id_number]
// // //       );
// // //       console.log('Lecturer lookup:', user);
// // //     } else if (decoded.role === 'faculty-admin') {
// // //       [user] = await pool.query(
// // //         'SELECT admin_id, full_name FROM faculty_admins WHERE admin_id = ?',
// // //         [decoded.id_number]
// // //       );
// // //       console.log('Faculty admin lookup:', user);
// // //     } else {
// // //       console.log('Authenticate failed: Invalid role:', decoded.role);
// // //       return res.status(401).json({ message: 'Invalid role' });
// // //     }

// // //     if (!user || user.length === 0) {
// // //       console.log('Authenticate failed: User not found:', decoded.id_number);
// // //       return res.status(401).json({ message: 'Invalid token: User not found' });
// // //     }

// // //     req.user = {
// // //       userId: decoded.role === 'lecturer' ? user[0].lecturer_id : user[0].admin_id,
// // //       name: user[0].full_name || 'Unknown',
// // //       role: decoded.role
// // //     };
// // //     console.log('Authenticate success:', req.user);
// // //     next();
// // //   } catch (err) {
// // //     console.error('Authenticate error:', err.message, err.stack);
// // //     return res.status(401).json({ message: 'Invalid token: ' + err.message });
// // //   }
// // // };

// // // exports.authorize = (roles) => {
// // //   return (req, res, next) => {
// // //     console.log('Authorize middleware - User role:', req.user.role, 'Allowed roles:', roles);
// // //     if (!roles.includes(req.user.role)) {
// // //       console.log('Authorize failed: Role not authorized:', req.user.role);
// // //       return res.status(403).json({ message: 'Access denied' });
// // //     }
// // //     console.log('Authorize success:', req.user.role);
// // //     next();
// // //   };
// // // };
// // const jwt = require('jsonwebtoken');
// // const pool = require('../config/db');

// // exports.authenticate = async (req, res, next) => {
// //   const token = req.header('Authorization')?.replace('Bearer ', '');
// //   console.log('Authenticate middleware - Token:', token ? '[Present]' : '[Missing]');

// //   if (!token) {
// //     console.log('Authenticate failed: No token provided');
// //     return res.status(401).json({ message: 'No token provided' });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     console.log('Token decoded:', { id_number: decoded.id_number, role: decoded.role });

// //     let user;
// //     if (decoded.role === 'lecturer') {
// //       [user] = await pool.query(
// //         'SELECT lecturer_id, full_name FROM lecturers WHERE lecturer_id = ?',
// //         [decoded.id_number]
// //       );
// //       console.log('Lecturer lookup:', user);
// //     } else if (decoded.role === 'faculty-admin') {
// //       [user] = await pool.query(
// //         'SELECT admin_id, full_name FROM faculty_admins WHERE admin_id = ?',
// //         [decoded.id_number]
// //       );
// //       console.log('Faculty admin lookup:', user);
// //     } else if (decoded.role === 'student') {
// //       [user] = await pool.query(
// //         'SELECT student_id, full_name FROM students WHERE student_id = ?',
// //         [decoded.id_number]
// //       );
// //       console.log('Student lookup:', user);
// //     } else {
// //       console.log('Authenticate failed: Invalid role:', decoded.role);
// //       return res.status(401).json({ message: 'Invalid role' });
// //     }

// //     if (!user || user.length === 0) {
// //       console.log('Authenticate failed: User not found:', decoded.id_number);
// //       return res.status(401).json({ message: 'Invalid token: User not found' });
// //     }

// //     req.user = {
// //       userId: decoded.role === 'lecturer' ? user[0].lecturer_id : 
// //               decoded.role === 'faculty-admin' ? user[0].admin_id : user[0].student_id,
// //       name: user[0].full_name || 'Unknown',
// //       role: decoded.role
// //     };
// //     console.log('Authenticate success:', req.user);
// //     next();
// //   } catch (err) {
// //     console.error('Authenticate error:', err.message, err.stack);
// //     return res.status(401).json({ message: 'Invalid token: ' + err.message });
// //   }
// // };

// // exports.authorize = (roles) => {
// //   return (req, res, next) => {
// //     console.log('Authorize middleware - User role:', req.user.role, 'Allowed roles:', roles);
// //     if (!roles.includes(req.user.role)) {
// //       console.log('Authorize failed: Role not authorized:', req.user.role);
// //       return res.status(403).json({ message: 'Access denied' });
// //     }
// //     console.log('Authorize success:', req.user.role);
// //     next();
// //   };
// // };
// const jwt = require('jsonwebtoken');
// const pool = require('../config/db');

// exports.authenticate = async (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   console.log('Authenticate middleware - Token:', token ? '[Present]' : '[Missing]');

//   if (!token) {
//     console.log('Authenticate failed: No token provided');
//     return res.status(401).json({ message: 'No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Token decoded:', { id_number: decoded.id_number, role: decoded.role });

//     let user;
//     if (decoded.role === 'lecturer') {
//       [user] = await pool.query(
//         'SELECT lecturer_id, full_name FROM lecturers WHERE lecturer_id = ?',
//         [decoded.id_number]
//       );
//       console.log('Lecturer lookup:', user);
//     } else if (decoded.role === 'faculty-admin') {
//       [user] = await pool.query(
//         'SELECT admin_id, full_name FROM faculty_admins WHERE admin_id = ?',
//         [decoded.id_number]
//       );
//       console.log('Faculty admin lookup:', user);
//     } else if (decoded.role === 'student') {
//       [user] = await pool.query(
//         'SELECT student_id, full_name FROM students WHERE student_id = ?',
//         [decoded.id_number]
//       );
//       console.log('Student lookup:', user);
//     } else if (decoded.role === 'lab_technician') {
//       [user] = await pool.query(
//         'SELECT technician_id, full_name FROM lab_technicians WHERE technician_id = ?',
//         [decoded.id_number]
//       );
//       console.log('Lab technician lookup:', user);
//     } else {
//       console.log('Authenticate failed: Invalid role:', decoded.role);
//       return res.status(401).json({ message: 'Invalid role' });
//     }

//     if (!user || user.length === 0) {
//       console.log('Authenticate failed: User not found:', decoded.id_number);
//       return res.status(401).json({ message: 'Invalid token: User not found' });
//     }

//     req.user = {
//       userId: decoded.role === 'lecturer' ? user[0].lecturer_id : 
//               decoded.role === 'faculty-admin' ? user[0].admin_id : 
//               decoded.role === 'student' ? user[0].student_id : user[0].technician_id,
//       name: user[0].full_name || 'Unknown',
//       role: decoded.role
//     };
//     console.log('Authenticate success:', req.user);
//     next();
//   } catch (err) {
//     console.error('Authenticate error:', err.message, err.stack);
//     return res.status(401).json({ message: 'Invalid token: ' + err.message });
//   }
// };

// exports.authorize = (roles) => {
//   return (req, res, next) => {
//     console.log('Authorize middleware - User role:', req.user.role, 'Allowed roles:', roles);
//     if (!roles.includes(req.user.role)) {
//       console.log('Authorize failed: Role not authorized:', req.user.role);
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     console.log('Authorize success:', req.user.role);
//     next();
//   };
// };
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Authenticate middleware - Token:', token ? '[Present]' : '[Missing]');

  if (!token) {
    console.log('Authenticate failed: No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', { id_number: decoded.id_number, role: decoded.role, roleLength: decoded.role ? decoded.role.length : 0 });

    let user;
    if (decoded.role === 'lecturer') {
      [user] = await pool.query(
        'SELECT lecturer_id, full_name FROM lecturers WHERE lecturer_id = ?',
        [decoded.id_number]
      );
      console.log('Lecturer lookup:', user);
    } else if (decoded.role === 'faculty-admin') {
      [user] = await pool.query(
        'SELECT admin_id, full_name FROM faculty_admins WHERE admin_id = ?',
        [decoded.id_number]
      );
      console.log('Faculty admin lookup:', user);
    } else if (decoded.role === 'student') {
      [user] = await pool.query(
        'SELECT student_id, full_name FROM students WHERE student_id = ?',
        [decoded.id_number]
      );
      console.log('Student lookup:', user);
    } else if (decoded.role === 'lab-technician') {
      [user] = await pool.query(
        'SELECT technician_id, full_name FROM lab_technicians WHERE technician_id = ?',
        [decoded.id_number]
      );
      console.log('Lab technician lookup:', user);
    } else {
      console.log('Authenticate failed: Invalid role:', decoded.role);
      return res.status(401).json({ message: 'Invalid role' });
    }

    if (!user || user.length === 0) {
      console.log('Authenticate failed: User not found:', decoded.id_number);
      return res.status(401).json({ message: 'Invalid token: User not found' });
    }

    req.user = {
      userId: decoded.role === 'lecturer' ? user[0].lecturer_id : 
              decoded.role === 'faculty-admin' ? user[0].admin_id : 
              decoded.role === 'student' ? user[0].student_id : user[0].technician_id,
      name: user[0].full_name || 'Unknown',
      role: decoded.role
    };
    console.log('Authenticate success:', req.user);
    next();
  } catch (err) {
    console.error('Authenticate error:', err.message, err.stack);
    return res.status(401).json({ message: 'Invalid token: ' + err.message });
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    console.log('Authorize middleware - User role:', req.user.role, 'Allowed roles:', roles);
    if (!roles.includes(req.user.role)) {
      console.log('Authorize failed: Role not authorized:', req.user.role);
      return res.status(403).json({ message: 'Access denied' });
    }
    console.log('Authorize success:', req.user.role);
    next();
  };
};