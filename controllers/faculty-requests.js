
// const pool = require('../config/db');

// exports.getAllRequests = async (req, res) => {
//   console.log('Fetching all requests for faculty admin:', {
//     userId: req.user.userId,
//     role: req.user.role,
//     timestamp: new Date().toISOString()
//   });

//   try {
//     // Fetch student requests (Lab and Equipment)
//     const [studentRequests] = await pool.query(`
//       SELECT 
//         request_id,
//         'student' AS user_type,
//         CASE 
//           WHEN request_type = 'Lab' THEN 'Lab Booking'
//           WHEN request_type = 'Equipment' THEN 'Equipment Booking'
//           ELSE request_type
//         END AS type,
//         student_id AS requested_by_id,
//         '' AS requested_by_name, -- Placeholder: Fetch name from users table if available
//         CONCAT(
//           'Purpose: ', purpose, '\n',
//           'Course: ', COALESCE(course_name, 'N/A'), '\n',
//           CASE 
//             WHEN request_type = 'Lab' THEN
//               CONCAT(
//                 'Lab Room: ', COALESCE(lab_room, 'N/A'), '\n',
//                 'Date: ', COALESCE(booking_date, 'N/A'), '\n',
//                 'Start Time: ', COALESCE(start_time, 'N/A'), '\n',
//                 'Duration: ', COALESCE(duration_hours, 'N/A'), ' hours\n',
//                 'Group Members: ', COALESCE(group_members, 'N/A')
//               )
//             WHEN request_type = 'Equipment' THEN
//               CONCAT(
//                 'Equipment: ', COALESCE(equipment_name, 'N/A'), '\n',
//                 'Start Date: ', COALESCE(start_date, 'N/A'), '\n',
//                 'End Date: ', COALESCE(end_date, 'N/A'), '\n',
//                 'Location: ', COALESCE(location, 'N/A')
//               )
//             ELSE ''
//           END
//         ) AS details,
//         status,
//         created_at,
//         NULL AS notes
//       FROM booking_requests
//     `);

//     // Fetch lecturer requests
//     const [lecturerRequests] = await pool.query(`
//       SELECT 
//         request_id,
//         'lecturer' AS user_type,
//         type,
//         requested_by_id,
//         requested_by_name,
//         details,
//         status,
//         created_at,
//         NULL AS notes
//       FROM lecturer_requests
//     `);

//     // Combine and sort by created_at (newest first)
//     const allRequests = [...studentRequests, ...lecturerRequests].sort(
//       (a, b) => new Date(b.created_at) - new Date(a.created_at)
//     );

//     console.log('Requests fetched:', {
//       total: allRequests.length,
//       studentCount: studentRequests.length,
//       lecturerCount: lecturerRequests.length,
//       sampleStudent: studentRequests[0] || 'None',
//       sampleLecturer: lecturerRequests[0] || 'None',
//       timestamp: new Date().toISOString()
//     });

//     res.json(allRequests);
//   } catch (err) {
//     console.error('Error fetching requests:', {
//       message: err.message,
//       sql: err.sql || 'N/A',
//       code: err.code || 'N/A',
//       errno: err.errno || 'N/A',
//       stack: err.stack,
//       timestamp: new Date().toISOString()
//     });
//     res.status(500).json({ message: 'Server error: Unable to fetch requests' });
//   }
// };

// exports.approveRequest = async (req, res) => {
//   console.log('Reached approveRequest handler:', {
//     userId: req.user.userId,
//     role: req.user.role,
//     requestId: req.params.requestId,
//     timestamp: new Date().toISOString()
//   });

//   const { requestId } = req.params;

//   try {
//     // Check if request exists in booking_requests
//     const [[bookingRequest]] = await pool.query(`
//       SELECT request_id, request_type
//       FROM booking_requests
//       WHERE request_id = ?
//     `, [requestId]);

//     if (bookingRequest) {
//       const [result] = await pool.query(`
//         UPDATE booking_requests
//         SET status = 'Approved', updated_at = ?
//         WHERE request_id = ?
//       `, [new Date(), requestId]);

//       if (result.affectedRows === 0) {
//         console.warn('No rows updated:', { requestId });
//         return res.status(404).json({ message: 'Request not found' });
//       }

//       console.log('Booking request approved:', {
//         requestId,
//         requestType: bookingRequest.request_type,
//         timestamp: new Date().toISOString()
//       });

//       return res.json({ message: 'Request approved successfully' });
//     }

//     // Check if request exists in lecturer_requests
//     const [[lecturerRequest]] = await pool.query(`
//       SELECT request_id
//       FROM lecturer_requests
//       WHERE request_id = ?
//     `, [requestId]);

//     if (lecturerRequest) {
//       const [result] = await pool.query(`
//         UPDATE lecturer_requests
//         SET status = 'Accepted', updated_at = ?
//         WHERE request_id = ?
//       `, [new Date(), requestId]);

//       if (result.affectedRows === 0) {
//         console.warn('No rows updated:', { requestId });
//         return res.status(404).json({ message: 'Request not found' });
//       }

//       console.log('Lecturer request approved:', {
//         requestId,
//         timestamp: new Date().toISOString()
//       });

//       return res.json({ message: 'Request approved successfully' });
//     }

//     console.warn('Request not found:', { requestId });
//     res.status(404).json({ message: 'Request not found' });
//   } catch (err) {
//     console.error('Error approving request:', {
//       message: err.message,
//       sql: err.sql || 'N/A',
//       code: err.code || 'N/A',
//       errno: err.errno || 'N/A',
//       stack: err.stack,
//       timestamp: new Date().toISOString()
//     });
//     res.status(500).json({ message: 'Server error: Unable to approve request' });
//   }
// };

// exports.rejectRequest = async (req, res) => {
//   console.log('Reached rejectRequest handler:', {
//     userId: req.user.userId,
//     role: req.user.role,
//     requestId: req.params.requestId,
//     timestamp: new Date().toISOString()
//   });

//   const { requestId } = req.params;

//   try {
//     // Check if request exists in booking_requests
//     const [[bookingRequest]] = await pool.query(`
//       SELECT request_id, request_type
//       FROM booking_requests
//       WHERE request_id = ?
//     `, [requestId]);

//     if (bookingRequest) {
//       const [result] = await pool.query(`
//         UPDATE booking_requests
//         SET status = 'Rejected', updated_at = ?
//         WHERE request_id = ?
//       `, [new Date(), requestId]);

//       if (result.affectedRows === 0) {
//         console.warn('No rows updated:', { requestId });
//         return res.status(404).json({ message: 'Request not found' });
//       }

//       console.log('Booking request rejected:', {
//         requestId,
//         requestType: bookingRequest.request_type,
//         timestamp: new Date().toISOString()
//       });

//       return res.json({ message: 'Request rejected successfully' });
//     }

//     // Check if request exists in lecturer_requests
//     const [[lecturerRequest]] = await pool.query(`
//       SELECT request_id
//       FROM lecturer_requests
//       WHERE request_id = ?
//     `, [requestId]);

//     if (lecturerRequest) {
//       const [result] = await pool.query(`
//         UPDATE lecturer_requests
//         SET status = 'Rejected', updated_at = ?
//         WHERE request_id = ?
//       `, [new Date(), requestId]);

//       if (result.affectedRows === 0) {
//         console.warn('No rows updated:', { requestId });
//         return res.status(404).json({ message: 'Request not found' });
//       }

//       console.log('Lecturer request rejected:', {
//         requestId,
//         timestamp: new Date().toISOString()
//       });

//       return res.json({ message: 'Request rejected successfully' });
//     }

//     console.warn('Request not found:', { requestId });
//     res.status(404).json({ message: 'Request not found' });
//   } catch (err) {
//     console.error('Error rejecting request:', {
//       message: err.message,
//       sql: err.sql || 'N/A',
//       code: err.code || 'N/A',
//       errno: err.errno || 'N/A',
//       stack: err.stack,
//       timestamp: new Date().toISOString()
//     });
//     res.status(500).json({ message: 'Server error: Unable to reject request' });
//   }
// };
const pool = require('../config/db');

// 🔧 Helper: update request status
const updateRequestStatus = async (table, requestId, status) => {
  const [result] = await pool.query(
    `UPDATE ${table} SET status = ?, updated_at = ? WHERE request_id = ? AND status != ?`,
    [status, new Date(), requestId, status]
  );
  return result.affectedRows;
};

exports.getAllRequests = async (req, res) => {
  console.log('Fetching all requests for faculty admin:', {
    userId: req.user.userId,
    role: req.user.role,
    timestamp: new Date().toISOString()
  });

  try {
    const [studentRequests] = await pool.query(`
      SELECT 
        request_id,
        'student' AS user_type,
        CASE 
          WHEN request_type = 'Lab' THEN 'Lab Booking'
          WHEN request_type = 'Equipment' THEN 'Equipment Booking'
          ELSE request_type
        END AS type,
        student_id AS requested_by_id,
        '' AS requested_by_name, -- Optional: Fetch from users table if needed
        CONCAT(
          'Purpose: ', purpose, '\n',
          'Course: ', COALESCE(course_name, 'N/A'), '\n',
          CASE 
            WHEN request_type = 'Lab' THEN CONCAT(
              'Lab Room: ', COALESCE(lab_room, 'N/A'), '\n',
              'Date: ', COALESCE(booking_date, 'N/A'), '\n',
              'Start Time: ', COALESCE(start_time, 'N/A'), '\n',
              'Duration: ', COALESCE(duration_hours, 'N/A'), ' hours\n',
              'Group Members: ', COALESCE(group_members, 'N/A')
            )
            WHEN request_type = 'Equipment' THEN CONCAT(
              'Equipment: ', COALESCE(equipment_name, 'N/A'), '\n',
              'Start Date: ', COALESCE(start_date, 'N/A'), '\n',
              'End Date: ', COALESCE(end_date, 'N/A'), '\n',
              'Location: ', COALESCE(location, 'N/A')
            )
            ELSE ''
          END
        ) AS details,
        status,
        created_at,
        NULL AS notes
      FROM booking_requests
    `);

    const [lecturerRequests] = await pool.query(`
      SELECT 
        request_id,
        'lecturer' AS user_type,
        type,
        requested_by_id,
        requested_by_name,
        details,
        status,
        created_at,
        NULL AS notes
      FROM lecturer_requests
    `);

    const allRequests = [...studentRequests, ...lecturerRequests].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    console.log('Requests fetched:', {
      total: allRequests.length,
      studentCount: studentRequests.length,
      lecturerCount: lecturerRequests.length,
      timestamp: new Date().toISOString()
    });

    res.json(allRequests);
  } catch (err) {
    console.error('Error fetching requests:', {
      message: err.message,
      sql: err.sql || 'N/A',
      code: err.code || 'N/A',
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: Unable to fetch requests' });
  }
};

exports.approveRequest = async (req, res) => {
  const { requestId } = req.params;

  console.log('Approving request:', {
    userId: req.user.userId,
    role: req.user.role,
    requestId,
    timestamp: new Date().toISOString()
  });

  try {
    // Check in booking_requests
    const [[bookingRequest]] = await pool.query(
      `SELECT request_id FROM booking_requests WHERE request_id = ?`,
      [requestId]
    );

    if (bookingRequest) {
      const updated = await updateRequestStatus('booking_requests', requestId, 'Approved');
      if (updated) {
        console.log('Booking request approved:', { requestId });
        return res.json({ message: 'Request approved successfully' });
      } else {
        return res.status(400).json({ message: 'Request already approved or not found' });
      }
    }

    // Check in lecturer_requests
    const [[lecturerRequest]] = await pool.query(
      `SELECT request_id FROM lecturer_requests WHERE request_id = ?`,
      [requestId]
    );

    if (lecturerRequest) {
      const updated = await updateRequestStatus('lecturer_requests', requestId, 'Approved');
      if (updated) {
        console.log('Lecturer request approved:', { requestId });
        return res.json({ message: 'Request approved successfully' });
      } else {
        return res.status(400).json({ message: 'Request already approved or not found' });
      }
    }

    res.status(404).json({ message: 'Request not found' });
  } catch (err) {
    console.error('Error approving request:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: Unable to approve request' });
  }
};

exports.rejectRequest = async (req, res) => {
  const { requestId } = req.params;

  console.log('Rejecting request:', {
    userId: req.user.userId,
    role: req.user.role,
    requestId,
    timestamp: new Date().toISOString()
  });

  try {
    // Check in booking_requests
    const [[bookingRequest]] = await pool.query(
      `SELECT request_id FROM booking_requests WHERE request_id = ?`,
      [requestId]
    );

    if (bookingRequest) {
      const updated = await updateRequestStatus('booking_requests', requestId, 'Rejected');
      if (updated) {
        console.log('Booking request rejected:', { requestId });
        return res.json({ message: 'Request rejected successfully' });
      } else {
        return res.status(400).json({ message: 'Request already rejected or not found' });
      }
    }

    // Check in lecturer_requests
    const [[lecturerRequest]] = await pool.query(
      `SELECT request_id FROM lecturer_requests WHERE request_id = ?`,
      [requestId]
    );

    if (lecturerRequest) {
      const updated = await updateRequestStatus('lecturer_requests', requestId, 'Rejected');
      if (updated) {
        console.log('Lecturer request rejected:', { requestId });
        return res.json({ message: 'Request rejected successfully' });
      } else {
        return res.status(400).json({ message: 'Request already rejected or not found' });
      }
    }

    res.status(404).json({ message: 'Request not found' });
  } catch (err) {
    console.error('Error rejecting request:', {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: Unable to reject request' });
  }
};
