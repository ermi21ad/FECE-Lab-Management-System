const pool = require('../config/db');

exports.submitBookingRequest = async (req, res) => {
  console.log('Submit booking request:', { userId: req.user.userId, body: req.body });

  try {
    const { request_type, purpose, course_name, lab_room, booking_date, start_time, duration_hours, group_members, equipment_name, start_date, end_date, location } = req.body;
    const student_id = req.user.userId;

    // Validate input
    if (!request_type || !purpose || !['Lab', 'Equipment'].includes(request_type)) {
      console.log('Invalid request type or missing purpose');
      return res.status(400).json({ message: 'Request type and purpose are required' });
    }

    if (request_type === 'Lab') {
      if (!course_name || !lab_room || !booking_date || !start_time || !duration_hours) {
        console.log('Missing lab booking fields');
        return res.status(400).json({ message: 'Course name, lab room, date, time, and duration are required for lab booking' });
      }
      if (duration_hours < 1 || duration_hours > 4) {
        console.log('Invalid duration:', duration_hours);
        return res.status(400).json({ message: 'Duration must be between 1 and 4 hours' });
      }
    } else {
      if (!equipment_name || !start_date || !end_date || !location) {
        console.log('Missing equipment booking fields');
        return res.status(400).json({ message: 'Equipment name, start date, end date, and location are required for equipment booking' });
      }
    }

    // Generate unique request ID
    const [countResult] = await pool.query('SELECT COUNT(*) as count FROM booking_requests');
    const request_id = `REQ/${String(countResult[0].count + 1).padStart(3, '0')}`;

    // Insert into database
    const query = `
      INSERT INTO booking_requests (
        request_id, student_id, request_type, purpose, course_name, lab_room, booking_date, start_time, duration_hours, group_members,
        equipment_name, start_date, end_date, location, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [
      request_id, student_id, request_type, purpose, course_name, lab_room, booking_date, start_time, duration_hours, group_members,
      equipment_name, start_date, end_date, location, 'Pending'
    ]);

    console.log('Booking request submitted:', { request_id, student_id, request_type });
    res.status(201).json({ message: 'Booking request submitted successfully', request_id });
  } catch (err) {
    console.error('Submit booking request error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.getBookingRequests = async (req, res) => {
  console.log('Get booking requests:', { userId: req.user.userId });

  try {
    const student_id = req.user.userId;
    const query = `
      SELECT 
        request_id, request_type, purpose, course_name, lab_room, booking_date, start_time, duration_hours, equipment_name, start_date, end_date, location, status
      FROM booking_requests
      WHERE student_id = ?
      ORDER BY created_at DESC
    `;
    const [requests] = await pool.query(query, [student_id]);

    console.log('Booking requests fetched:', requests.length);
    res.status(200).json({ requests });
  } catch (err) {
    console.error('Get booking requests error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};