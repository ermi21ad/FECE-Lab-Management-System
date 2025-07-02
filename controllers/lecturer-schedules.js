const pool = require('../config/db');
const moment = require('moment');

exports.getSchedules = async (req, res) => {
  const { view = 'Weekly', page = 1, limit = 10 } = req.query;
  const userId = req.user.userId;
  const offset = (page - 1) * limit;

  console.log('Get schedules request:', { userId, view, page, limit, offset });

  try {
    let query = `
      SELECT schedule_id, course_id, course_name, lecturer_id, lecturer, lab, batch,
             schedule_date, start_time, end_time, status
      FROM lab_schedules
      WHERE lecturer_id = ?
    `;
    const params = [userId];

    // Apply view filter
    if (view === 'Weekly') {
      query += ' AND schedule_date BETWEEN ? AND ?';
      const startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
      const endOfWeek = moment().endOf('week').format('YYYY-MM-DD');
      params.push(startOfWeek, endOfWeek);
    } else if (view === 'Monthly') {
      query += ' AND schedule_date BETWEEN ? AND ?';
      const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
      params.push(startOfMonth, endOfMonth);
    } else if (view === 'Semester') {
      query += ' AND schedule_date BETWEEN ? AND ?';
      const startOfSemester = moment().subtract(4, 'months').startOf('month').format('YYYY-MM-DD');
      const endOfSemester = moment().add(2, 'months').endOf('month').format('YYYY-MM-DD');
      params.push(startOfSemester, endOfSemester);
    }

    // Add sorting and pagination
    query += ' ORDER BY schedule_date ASC, start_time ASC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    // Fetch schedules
    const [schedules] = await pool.query(query, params);

    // Fetch total count for pagination
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM lab_schedules WHERE lecturer_id = ?',
      [userId]
    );
    const total = countResult[0].total;

    console.log('Schedules fetched:', { count: schedules.length, total });

    res.status(200).json({
      schedules,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get schedules error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};