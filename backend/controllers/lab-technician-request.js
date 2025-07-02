const pool = require('../config/db');

exports.getAllRequests = async (req, res) => {
  console.log('Fetching all requests for lab technician:', {
    userId: req.user.userId,
    role: req.user.role,
    timestamp: new Date().toISOString()
  });

  try {
    // Fetch student equipment requests
    const [studentEquipmentRequests] = await pool.query(`
      SELECT 
        request_id,
        student_id,
        equipment_name,
        purpose,
        duration_hours,
        status
      FROM booking_requests
      WHERE request_type = 'Equipment'
    `);

    // Fetch student lab requests
    const [studentLabRequests] = await pool.query(`
      SELECT 
        request_id,
        purpose,
        CONCAT(booking_date, ' ', start_time) AS date_time,
        lab_room AS lab,
        group_members,
        status
      FROM booking_requests
      WHERE request_type = 'Lab'
    `);

    // Fetch lecturer requests
    const [lecturerRequests] = await pool.query(`
      SELECT 
        request_id,
        type,
        requested_by_name AS requested_by,
        details,
        status,
        created_at,
        updated_at
      FROM lecturer_requests
    `);

    console.log('Requests fetched:', {
      studentEquipment: studentEquipmentRequests.length,
      studentLab: studentLabRequests.length,
      lecturer: lecturerRequests.length,
      sampleEquipment: studentEquipmentRequests.length > 0 ? studentEquipmentRequests[0] : null,
      sampleLab: studentLabRequests.length > 0 ? studentLabRequests[0] : null,
      sampleLecturer: lecturerRequests.length > 0 ? lecturerRequests[0] : null,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      studentEquipmentRequests,
      studentLabRequests,
      lecturerRequests
    });
  } catch (err) {
    console.error('Error fetching requests:', {
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