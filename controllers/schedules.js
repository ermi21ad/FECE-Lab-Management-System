const pool = require('../config/db');

exports.getSchedules = async (req, res) => {
  const { lecturer_id, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const role = req.user.role;

  try {
    let query = 'SELECT * FROM lab_schedules';
    let countQuery = 'SELECT COUNT(*) as total FROM lab_schedules';
    let params = [];

    // Filter by lecturer_id for lecturers only if provided
    if (role === 'lecturer' && lecturer_id) {
      if (lecturer_id !== req.user.admin_id) {
        return res.status(403).json({ message: 'Access denied: Invalid lecturer ID' });
      }
      query += ' WHERE lecturer_id = ?';
      countQuery += ' WHERE lecturer_id = ?';
      params.push(lecturer_id);
    }

    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [schedules] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(countQuery, params.slice(0, params.length - 2));

    res.status(200).json({ schedules, total });
  } catch (err) {
    console.error('Get schedules error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.addSchedule = async (req, res) => {
  const {
    schedule_id, course_id, course_name, lecturer_id, lecturer, lab, batch,
    schedule_date, start_time, end_time, equipment, notes, status
  } = req.body;

  console.log('Received form data:', req.body);

  try {
    // Validate inputs
    if (!schedule_id || !course_id || !course_name || !lecturer_id || !lecturer || !lab || !batch || !schedule_date || !start_time || !end_time || !status) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate status
    const validStatuses = ['Pending', 'Scheduled', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check for duplicate schedule_id
    const [existing] = await pool.query('SELECT schedule_id FROM lab_schedules WHERE schedule_id = ?', [schedule_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Schedule ID already exists' });
    }

    // Insert schedule
    const [result] = await pool.query(
      `INSERT INTO lab_schedules (
        schedule_id, course_id, course_name, lecturer_id, lecturer, lab, batch,
        schedule_date, start_time, end_time, equipment, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        schedule_id, course_id, course_name, lecturer_id, lecturer, lab, batch,
        schedule_date, start_time, end_time, equipment || null, notes || null, status
      ]
    );

    console.log('Add schedule result:', result);
    res.status(201).json({ message: 'Schedule added successfully' });
  } catch (err) {
    console.error('Add schedule error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

exports.updateSchedule = async (req, res) => {
  const { schedule_id } = req.params;
  const {
    course_id, course_name, lecturer_id, lecturer, lab, batch,
    schedule_date, start_time, end_time, equipment, notes, status
  } = req.body;

  console.log('Received update data:', req.body);

  try {
    // Validate inputs
    if (!course_id || !course_name || !lecturer_id || !lecturer || !lab || !batch || !schedule_date || !start_time || !end_time || !status) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate status
    const validStatuses = ['Pending', 'Scheduled', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if schedule exists
    const [existing] = await pool.query('SELECT schedule_id FROM lab_schedules WHERE schedule_id = ?', [schedule_id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    // Update schedule
    const [result] = await pool.query(
      `UPDATE lab_schedules SET
        course_id = ?, course_name = ?, lecturer_id = ?, lecturer = ?, lab = ?, batch = ?,
        schedule_date = ?, start_time = ?, end_time = ?, equipment = ?, notes = ?, status = ?
      WHERE schedule_id = ?`,
      [
        course_id, course_name, lecturer_id, lecturer, lab, batch,
        schedule_date, start_time, end_time, equipment || null, notes || null, status,
        schedule_id
      ]
    );

    console.log('Update schedule result:', result);
    res.status(200).json({ message: 'Schedule updated successfully' });
  } catch (err) {
    console.error('Update schedule error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};