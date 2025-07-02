// // const bcrypt = require('bcryptjs');
// // const csv = require('fast-csv');
// // const fs = require('fs');
// // const pool = require('../config/db');

// // const registerUser = async (req, res) => {
// //   const { role, full_name, id, email, password, extra } = req.body;

// //   if (!role || !id || !password) {
// //     return res.status(400).json({ message: 'Role, ID, and password are required' });
// //   }

// //   const tableMap = {
// //     student: 'students',
// //     'lab-technician': 'lab_technicians',
// //     lecturer: 'lecturers',
// //   };

// //   const idFieldMap = {
// //     student: 'student_id',
// //     'lab-technician': 'technician_id',
// //     lecturer: 'lecturer_id',
// //   };

// //   const table = tableMap[role];
// //   const idField = idFieldMap[role];

// //   if (!table) {
// //     return res.status(400).json({ message: 'Invalid role' });
// //   }

// //   try {
// //     const [existing] = await pool.query(`SELECT * FROM ${table} WHERE ${idField} = ?`, [id]);
// //     if (existing.length > 0) {
// //       return res.status(400).json({ message: `${idField} already exists` });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     if (role === 'student') {
// //       await pool.query(
// //         'INSERT INTO students (student_id, password, full_name, batch) VALUES (?, ?, ?, ?)',
// //         [id, hashedPassword, full_name || null, extra.batch || null]
// //       );
// //     } else if (role === 'lab-technician') {
// //       await pool.query(
// //         'INSERT INTO lab_technicians (technician_id, password, full_name, assigned_lab_id) VALUES (?, ?, ?, ?)',
// //         [id, hashedPassword, full_name || null, extra.assigned_lab_id || null]
// //       );
// //     } else if (role === 'lecturer') {
// //       await pool.query(
// //         'INSERT INTO lecturers (lecturer_id, password, full_name, assigned_courses) VALUES (?, ?, ?, ?)',
// //         [id, hashedPassword, full_name || null, extra.assigned_courses || null]
// //       );
// //     }

// //     res.status(201).json({ message: 'User registered successfully' });
// //   } catch (err) {
// //     console.error('Register error:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // const bulkRegisterUsers = async (req, res) => {
// //   const file = req.file;
// //   const role = req.body.role;

// //   if (!file || !role) {
// //     return res.status(400).json({ message: 'File and role are required' });
// //   }

// //   const tableMap = {
// //     student: { table: 'students', idField: 'student_id' },
// //     'lab-technician': { table: 'lab_technicians', idField: 'technician_id' },
// //     lecturer: { table: 'lecturers', idField: 'lecturer_id' },
// //   };

// //   const config = tableMap[role];
// //   if (!config) {
// //     return res.status(400).json({ message: 'Invalid role' });
// //   }

// //   const users = [];
// //   const errors = [];

// //   try {
// //     fs.createReadStream(file.path)
// //       .pipe(csv.parse({ headers: true }))
// //       .on('data', (row) => {
// //         users.push({
// //           id: row[config.idField],
// //           password: row.password || 'temp123',
// //           full_name: row.full_name || null,
// //           extra: {
// //             batch: row.batch || null,
// //             assigned_lab_id: row.assigned_lab_id || null,
// //             assigned_courses: row.assigned_courses || null,
// //           },
// //         });
// //       })
// //       .on('end', async () => {
// //         for (const user of users) {
// //           try {
// //             const [existing] = await pool.query(
// //               `SELECT * FROM ${config.table} WHERE ${config.idField} = ?`,
// //               [user.id]
// //             );
// //             if (existing.length > 0) {
// //               errors.push({ id: user.id, error: 'Duplicate ID' });
// //               continue;
// //             }

// //             const hashedPassword = await bcrypt.hash(user.password, 10);

// //             if (role === 'student') {
// //               await pool.query(
// //                 'INSERT INTO students (student_id, password, full_name, batch) VALUES (?, ?, ?, ?)',
// //                 [user.id, hashedPassword, user.full_name, user.extra.batch]
// //               );
// //             } else if (role === 'lab-technician') {
// //               await pool.query(
// //                 'INSERT INTO lab_technicians (technician_id, password, full_name, assigned_lab_id) VALUES (?, ?, ?, ?)',
// //                 [user.id, hashedPassword, user.full_name, user.extra.assigned_lab_id]
// //               );
// //             } else if (role === 'lecturer') {
// //               await pool.query(
// //                 'INSERT INTO lecturers (lecturer_id, password, full_name, assigned_courses) VALUES (?, ?, ?, ?)',
// //                 [user.id, hashedPassword, user.full_name, user.extra.assigned_courses]
// //               );
// //             }
// //           } catch (err) {
// //             errors.push({ id: user.id, error: err.message });
// //           }
// //         }

// //         fs.unlinkSync(file.path);
// //         res.json({ message: 'Bulk import completed', errors });
// //       })
// //       .on('error', (err) => {
// //         console.error('CSV error:', err);
// //         res.status(500).json({ message: 'Error processing CSV' });
// //       });
// //   } catch (err) {
// //     console.error('Bulk import error:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // const listUsers = async (req, res) => {
// //   const { role } = req.query;

// //   const tableMap = {
// //     student: 'students',
// //     'lab-technician': 'lab_technicians',
// //     lecturer: 'lecturers',
// //   };

// //   const idFieldMap = {
// //     student: 'student_id',
// //     'lab-technician': 'technician_id',
// //     lecturer: 'lecturer_id',
// //   };

// //   const table = tableMap[role];
// //   const idField = idFieldMap[role];

// //   if (!table) {
// //     return res.status(400).json({ message: 'Invalid role' });
// //   }

// //   try {
// //     let query;
// //     let fields;

// //     if (role === 'student') {
// //       query = `SELECT student_id, full_name, batch, created_at FROM students`;
// //       fields = ['student_id', 'full_name', 'batch', 'created_at'];
// //     } else if (role === 'lab-technician') {
// //       query = `SELECT technician_id, full_name, assigned_lab_id, created_at FROM lab_technicians`;
// //       fields = ['technician_id', 'full_name', 'assigned_lab_id', 'created_at'];
// //     } else if (role === 'lecturer') {
// //       query = `SELECT lecturer_id, full_name, assigned_courses, created_at FROM lecturers`;
// //       fields = ['lecturer_id', 'full_name', 'assigned_courses', 'created_at'];
// //     }

// //     const [users] = await pool.query(query);
// //     res.json({ users, fields });
// //   } catch (err) {
// //     console.error('List users error:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // const deleteUser = async (req, res) => {
// //   const { role, id } = req.body;

// //   if (!role || !id) {
// //     return res.status(400).json({ message: 'Role and ID are required' });
// //   }

// //   const tableMap = {
// //     student: 'students',
// //     'lab-technician': 'lab_technicians',
// //     lecturer: 'lecturers',
// //   };

// //   const idFieldMap = {
// //     student: 'student_id',
// //     'lab-technician': 'technician_id',
// //     lecturer: 'lecturer_id',
// //   };

// //   const table = tableMap[role];
// //   const idField = idFieldMap[role];

// //   if (!table) {
// //     return res.status(400).json({ message: 'Invalid role' });
// //   }

// //   try {
// //     const [result] = await pool.query(`DELETE FROM ${table} WHERE ${idField} = ?`, [id]);
// //     if (result.affectedRows === 0) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }
// //     res.json({ message: 'User deleted successfully' });
// //   } catch (err) {
// //     console.error('Delete user error:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // const editUser = async (req, res) => {
// //   const { role, id, full_name, extra } = req.body;

// //   if (!role || !id) {
// //     return res.status(400).json({ message: 'Role and ID are required' });
// //   }

// //   const tableMap = {
// //     student: 'students',
// //     'lab-technician': 'lab_technicians',
// //     lecturer: 'lecturers',
// //   };

// //   const idFieldMap = {
// //     student: 'student_id',
// //     'lab-technician': 'technician_id',
// //     lecturer: 'lecturer_id',
// //   };

// //   const table = tableMap[role];
// //   const idField = idFieldMap[role];

// //   if (!table) {
// //     return res.status(400).json({ message: 'Invalid role' });
// //   }

// //   try {
// //     let query;
// //     let params;

// //     if (role === 'student') {
// //       query = `UPDATE students SET full_name = ?, batch = ? WHERE student_id = ?`;
// //       params = [full_name || null, extra.batch || null, id];
// //     } else if (role === 'lab-technician') {
// //       query = `UPDATE lab_technicians SET full_name = ?, assigned_lab_id = ? WHERE technician_id = ?`;
// //       params = [full_name || null, extra.assigned_lab_id || null, id];
// //     } else if (role === 'lecturer') {
// //       query = `UPDATE lecturers SET full_name = ?, assigned_courses = ? WHERE lecturer_id = ?`;
// //       params = [full_name || null, extra.assigned_courses || null, id];
// //     }

// //     const [result] = await pool.query(query, params);
// //     if (result.affectedRows === 0) {
// //       return res.status(404).json({ message: 'User not found' });
// //     }
// //     res.json({ message: 'User updated successfully' });
// //   } catch (err) {
// //     console.error('Edit user error:', err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // };

// // module.exports = { registerUser, bulkRegisterUsers, listUsers, deleteUser, editUser };
// const bcrypt = require('bcryptjs');
// const csv = require('fast-csv');
// const fs = require('fs');
// const pool = require('../config/db');

// const registerUser = async (req, res) => {
//   const { role, full_name, id_number, email, password, extra } = req.body;

//   console.log('Register user:', { role, id_number, email });

//   if (!role || !id_number || !password) {
//     return res.status(400).json({ message: 'Role, ID number, and password are required' });
//   }

//   const tableMap = {
//     student: { table: 'students', idField: 'student_id' },
//     'lab-technician': { table: 'lab_technicians', idField: 'technician_id' },
//     lecturer: { table: 'lecturers', idField: 'lecturer_id' },
//   };

//   const config = tableMap[role];
//   if (!config) {
//     return res.status(400).json({ message: 'Invalid role' });
//   }

//   try {
//     const [existing] = await pool.query(`SELECT ${config.idField} FROM ${config.table} WHERE ${config.idField} = ?`, [id_number]);
//     if (existing.length > 0) {
//       return res.status(400).json({ message: `${config.idField} already exists` });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     if (role === 'student') {
//       await pool.query(
//         'INSERT INTO students (student_id, full_name, email, password, batch) VALUES (?, ?, ?, ?, ?)',
//         [id_number, full_name || null, email || null, hashedPassword, extra.batch || null]
//       );
//     } else if (role === 'lab-technician') {
//       await pool.query(
//         'INSERT INTO lab_technicians (technician_id, full_name, email, password, assigned_lab_id) VALUES (?, ?, ?, ?, ?)',
//         [id_number, full_name || null, email || null, hashedPassword, extra.assigned_lab_id || null]
//       );
//     } else if (role === 'lecturer') {
//       await pool.query(
//         'INSERT INTO lecturers (lecturer_id, full_name, email, password, assigned_courses) VALUES (?, ?, ?, ?, ?)',
//         [id_number, full_name || null, email || null, hashedPassword, extra.assigned_courses || null]
//       );
//     }

//     res.status(201).json({ message: 'User registered successfully', id_number });
//   } catch (err) {
//     console.error('Register error:', err.message, err.stack);
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// };

// const bulkRegisterUsers = async (req, res) => {
//   const file = req.file;
//   const role = req.body.role;

//   console.log('Bulk register:', { role, file: file?.path });

//   if (!file || !role) {
//     return res.status(400).json({ message: 'File and role are required' });
//   }

//   const tableMap = {
//     student: { table: 'students', idField: 'student_id', extraField: 'batch' },
//     'lab-technician': { table: 'lab_technicians', idField: 'technician_id', extraField: 'assigned_lab_id' },
//     lecturer: { table: 'lecturers', idField: 'lecturer_id', extraField: 'assigned_courses' },
//   };

//   const config = tableMap[role];
//   if (!config) {
//     return res.status(400).json({ message: 'Invalid role' });
//   }

//   const users = [];
//   const errors = [];

//   try {
//     fs.createReadStream(file.path)
//       .pipe(csv.parse({ headers: true }))
//       .on('data', (row) => {
//         users.push({
//           id_number: row[config.idField] || row.id_number || row.id,
//           full_name: row.full_name || null,
//           email: row.email || null,
//           password: row.password || 'temp123',
//           extra: {
//             [config.extraField]: row[config.extraField] || null,
//           },
//         });
//       })
//       .on('end', async () => {
//         for (const user of users) {
//           if (!user.id_number) {
//             errors.push({ id: 'unknown', error: 'Missing ID number' });
//             continue;
//           }

//           try {
//             const [existing] = await pool.query(
//               `SELECT ${config.idField} FROM ${config.table} WHERE ${config.idField} = ?`,
//               [user.id_number]
//             );
//             if (existing.length > 0) {
//               errors.push({ id: user.id_number, error: 'Duplicate ID' });
//               continue;
//             }

//             const hashedPassword = await bcrypt.hash(user.password, 10);

//             if (role === 'student') {
//               await pool.query(
//                 'INSERT INTO students (student_id, full_name, email, password, batch) VALUES (?, ?, ?, ?, ?)',
//                 [user.id_number, user.full_name, user.email, hashedPassword, user.extra.batch]
//               );
//             } else if (role === 'lab-technician') {
//               await pool.query(
//                 'INSERT INTO lab_technicians (technician_id, full_name, email, password, assigned_lab_id) VALUES (?, ?, ?, ?, ?)',
//                 [user.id_number, user.full_name, user.email, hashedPassword, user.extra.assigned_lab_id]
//               );
//             } else if (role === 'lecturer') {
//               await pool.query(
//                 'INSERT INTO lecturers (lecturer_id, full_name, email, password, assigned_courses) VALUES (?, ?, ?, ?, ?)',
//                 [user.id_number, user.full_name, user.email, hashedPassword, user.extra.assigned_courses]
//               );
//             }
//           } catch (err) {
//             errors.push({ id: user.id_number, error: err.message });
//           }
//         }

//         fs.unlinkSync(file.path);
//         res.json({ message: 'Bulk import completed', errors });
//       })
//       .on('error', (err) => {
//         console.error('CSV error:', err.message);
//         res.status(500).json({ message: 'Error processing CSV: ' + err.message });
//       });
//   } catch (err) {
//     console.error('Bulk import error:', err.message, err.stack);
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// };

// const listUsers = async (req, res) => {
//   const { role } = req.query;

//   console.log('List users:', { role });

//   const tableMap = {
//     student: { table: 'students', idField: 'student_id', extraField: 'batch' },
//     'lab-technician': { table: 'lab_technicians', idField: 'technician_id', extraField: 'assigned_lab_id' },
//     lecturer: { table: 'lecturers', idField: 'lecturer_id', extraField: 'assigned_courses' },
//   };

//   const config = tableMap[role];
//   if (!config) {
//     return res.status(400).json({ message: 'Invalid role' });
//   }

//   try {
//     const query = `SELECT ${config.idField} AS id, full_name, email, ${config.extraField}, created_at FROM ${config.table}`;
//     const [users] = await pool.query(query);
//     const fields = ['id', 'full_name', 'email', config.extraField, 'created_at'];

//     res.json({ users, fields });
//   } catch (err) {
//     console.error('List users error:', err.message, err.stack);
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// };

// const deleteUser = async (req, res) => {
//   const { role, id } = req.body;

//   console.log('Delete user:', { role, id });

//   const tableMap = {
//     student: { table: 'students', idField: 'student_id' },
//     'lab-technician': { table: 'lab_technicians', idField: 'technician_id' },
//     lecturer: { table: 'lecturers', idField: 'lecturer_id' },
//   };

//   const config = tableMap[role];
//   if (!config) {
//     return res.status(400).json({ message: 'Invalid role' });
//   }

//   try {
//     const [result] = await pool.query(`DELETE FROM ${config.table} WHERE ${config.idField} = ?`, [id]);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User deleted successfully' });
//   } catch (err) {
//     console.error('Delete user error:', err.message, err.stack);
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// };

// const editUser = async (req, res) => {
//   const { role, id, full_name, email, extra } = req.body;

//   console.log('Edit user:', { role, id, full_name, email });

//   const tableMap = {
//     student: { table: 'students', idField: 'student_id', extraField: 'batch' },
//     'lab-technician': { table: 'lab_technicians', idField: 'technician_id', extraField: 'assigned_lab_id' },
//     lecturer: { table: 'lecturers', idField: 'lecturer_id', extraField: 'assigned_courses' },
//   };

//   const config = tableMap[role];
//   if (!config) {
//     return res.status(400).json({ message: 'Invalid role' });
//   }

//   try {
//     const query = `UPDATE ${config.table} SET full_name = ?, email = ?, ${config.extraField} = ? WHERE ${config.idField} = ?`;
//     const params = [full_name || null, email || null, extra[config.extraField] || null, id];

//     const [result] = await pool.query(query, params);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     res.json({ message: 'User updated successfully' });
//   } catch (err) {
//     console.error('Edit user error:', err.message, err.stack);
//     res.status(500).json({ message: 'Server error: ' + err.message });
//   }
// };

// module.exports = { registerUser, bulkRegisterUsers, listUsers, deleteUser, editUser };
const bcrypt = require('bcryptjs');
const csv = require('fast-csv');
const fs = require('fs');
const pool = require('../config/db');

const registerUser = async (req, res) => {
  const { role, full_name, id_number, email, password, extra } = req.body;

  console.log('Register user:', { role, id_number, email });

  if (!role || !id_number || !password) {
    return res.status(400).json({ message: 'Role, ID number, and password are required' });
  }

  const tableMap = {
    student: { table: 'students', idField: 'student_id' },
    'lab-technician': { table: 'lab_technicians', idField: 'technician_id' },
    lecturer: { table: 'lecturers', idField: 'lecturer_id' },
  };

  const config = tableMap[role];
  if (!config) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const [existing] = await pool.query(`SELECT ${config.idField} FROM ${config.table} WHERE ${config.idField} = ?`, [id_number]);
    if (existing.length > 0) {
      return res.status(400).json({ message: `${config.idField} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'student') {
      await pool.query(
        'INSERT INTO students (student_id, full_name, email, password, batch) VALUES (?, ?, ?, ?, ?)',
        [id_number, full_name || null, email || null, hashedPassword, extra.batch || null]
      );
    } else if (role === 'lab-technician') {
      await pool.query(
        'INSERT INTO lab_technicians (technician_id, full_name, email, password, assigned_lab_id) VALUES (?, ?, ?, ?, ?)',
        [id_number, full_name || null, email || null, hashedPassword, extra.assigned_lab_id || null]
      );
    } else if (role === 'lecturer') {
      await pool.query(
        'INSERT INTO lecturers (lecturer_id, full_name, email, password, assigned_courses) VALUES (?, ?, ?, ?, ?)',
        [id_number, full_name || null, email || null, hashedPassword, extra.assigned_courses || null]
      );
    }

    res.status(201).json({ message: 'User registered successfully', id_number });
  } catch (err) {
    console.error('Register error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const bulkRegisterUsers = async (req, res) => {
  const file = req.file;
  const role = req.body.role;

  console.log('Bulk register:', { role, file: file?.path });

  if (!file || !role) {
    return res.status(400).json({ message: 'File and role are required' });
  }

  const tableMap = {
    student: { table: 'students', idField: 'student_id', extraField: 'batch' },
    'lab-technician': { table: 'lab_technicians', idField: 'technician_id', extraField: 'assigned_lab_id' },
    lecturer: { table: 'lecturers', idField: 'lecturer_id', extraField: 'assigned_courses' },
  };

  const config = tableMap[role];
  if (!config) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const users = [];
  const errors = [];

  try {
    fs.createReadStream(file.path)
      .pipe(csv.parse({ headers: true }))
      .on('data', (row) => {
        users.push({
          id_number: row[config.idField] || row.id_number,
          full_name: row.full_name || null,
          email: row.email || null,
          password: row.password || 'temp123',
          extra: {
            [config.extraField]: row[config.extraField] || null,
          },
        });
      })
      .on('end', async () => {
        for (const user of users) {
          if (!user.id_number) {
            errors.push({ id: 'unknown', error: 'Missing ID number' });
            continue;
          }

          try {
            const [existing] = await pool.query(
              `SELECT ${config.idField} FROM ${config.table} WHERE ${config.idField} = ?`,
              [user.id_number]
            );
            if (existing.length > 0) {
              errors.push({ id: user.id_number, error: 'Duplicate ID' });
              continue;
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);

            if (role === 'student') {
              await pool.query(
                'INSERT INTO students (student_id, full_name, email, password, batch) VALUES (?, ?, ?, ?, ?)',
                [user.id_number, user.full_name, user.email, hashedPassword, user.extra.batch]
              );
            } else if (role === 'lab-technician') {
              await pool.query(
                'INSERT INTO lab_technicians (technician_id, full_name, email, password, assigned_lab_id) VALUES (?, ?, ?, ?, ?)',
                [user.id_number, user.full_name, user.email, hashedPassword, user.extra.assigned_lab_id]
              );
            } else if (role === 'lecturer') {
              await pool.query(
                'INSERT INTO lecturers (lecturer_id, full_name, email, password, assigned_courses) VALUES (?, ?, ?, ?, ?)',
                [user.id_number, user.full_name, user.email, hashedPassword, user.extra.assigned_courses]
              );
            }
          } catch (err) {
            errors.push({ id: user.id_number, error: err.message });
          }
        }

        fs.unlinkSync(file.path);
        res.json({ message: 'Bulk import completed', errors });
      })
      .on('error', (err) => {
        console.error('CSV error:', err.message);
        res.status(500).json({ message: 'Error processing CSV: ' + err.message });
      });
  } catch (err) {
    console.error('Bulk import error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const listUsers = async (req, res) => {
  const { role } = req.query;

  console.log('List users:', { role });

  const tableMap = {
    student: { table: 'students', idField: 'student_id', extraField: 'batch' },
    'lab-technician': { table: 'lab_technicians', idField: 'technician_id', extraField: 'assigned_lab_id' },
    lecturer: { table: 'lecturers', idField: 'lecturer_id', extraField: 'assigned_courses' },
  };

  const config = tableMap[role];
  if (!config) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const query = `SELECT ${config.idField} AS id, full_name, email, ${config.extraField}, created_at FROM ${config.table}`;
    const [users] = await pool.query(query);
    const fields = ['id', 'full_name', 'email', config.extraField, 'created_at'];

    res.json({ users, fields });
  } catch (err) {
    console.error('List users error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const deleteUser = async (req, res) => {
  const { role, id } = req.body;

  console.log('Delete user:', { role, id });

  const tableMap = {
    student: { table: 'students', idField: 'student_id' },
    'lab-technician': { table: 'lab_technicians', idField: 'technician_id' },
    lecturer: { table: 'lecturers', idField: 'lecturer_id' },
  };

  const config = tableMap[role];
  if (!config) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const [result] = await pool.query(`DELETE FROM ${config.table} WHERE ${config.idField} = ?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

const editUser = async (req, res) => {
  const { role, id, full_name, email, extra } = req.body;

  console.log('Edit user:', { role, id, full_name, email });

  const tableMap = {
    student: { table: 'students', idField: 'student_id', extraField: 'batch' },
    'lab-technician': { table: 'lab_technicians', idField: 'technician_id', extraField: 'assigned_lab_id' },
    lecturer: { table: 'lecturers', idField: 'lecturer_id', extraField: 'assigned_courses' },
  };

  const config = tableMap[role];
  if (!config) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const query = `UPDATE ${config.table} SET full_name = ?, email = ?, ${config.extraField} = ? WHERE ${config.idField} = ?`;
    const params = [full_name || null, email || null, extra[config.extraField] || null, id];

    const [result] = await pool.query(query, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Edit user error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

module.exports = { registerUser, bulkRegisterUsers, listUsers, deleteUser, editUser };