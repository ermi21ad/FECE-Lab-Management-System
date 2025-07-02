const pool = require('../config/db');

exports.getSchedules = async (req, res) => {
  console.log('Get student schedules request:', { userId: req.user.userId, role: req.user.role });
  const { view = 'weekly', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    // Get student's batch
    const [student] = await pool.query('SELECT batch FROM students WHERE student_id = ?', [req.user.userId]);
    if (!student || student.length === 0) {
      console.log('Student not found:', req.user.userId);
      return res.status(404).json({ message: 'Student not found' });
    }
    const batch = student[0].batch;
    console.log('Student batch:', batch);

    // Define date filter based on view (temporarily disabled for debugging)
    let dateFilter = '';
    /*
    const now = new Date();
    if (view === 'weekly') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() + 6));
      dateFilter = `AND schedule_date BETWEEN '${startOfWeek.toISOString().split('T')[0]}' AND '${endOfWeek.toISOString().split('T')[0]}'`;
    } else if (view === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      dateFilter = `AND schedule_date BETWEEN '${startOfMonth.toISOString().split('T')[0]}' AND '${endOfMonth.toISOString().split('T')[0]}'`;
    } else if (view === 'semester') {
      const startOfSemester = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const endOfSemester = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      dateFilter = `AND schedule_date BETWEEN '${startOfSemester.toISOString().split('T')[0]}' AND '${endOfSemester.toISOString().split('T')[0]}'`;
    }
    */

    // Fetch schedules
    const query = `
      SELECT 
        schedule_id, 
        course_name AS course, 
        lecturer_id, 
        lecturer AS lecturer_name, 
        lab, 
        batch, 
        schedule_date AS date, 
        CONCAT(TIME_FORMAT(start_time, '%H:%i'), '-', TIME_FORMAT(end_time, '%H:%i')) AS time, 
        status
      FROM lab_schedules
      WHERE batch = ? ${dateFilter}
      ORDER BY schedule_date, start_time
      LIMIT ? OFFSET ?
    `;
    const countQuery = `SELECT COUNT(*) as total FROM lab_schedules WHERE batch = ? ${dateFilter}`;
    
    console.log('Executing query:', query, 'with params:', [batch, parseInt(limit), parseInt(offset)]);
    const [schedules] = await pool.query(query, [batch, parseInt(limit), parseInt(offset)]).catch(err => {
      console.error('Database query error:', err.message, err.stack);
      throw new Error('Database error: ' + err.message);
    });

    console.log('Schedules fetched:', schedules);

    const [countResult] = await pool.query(countQuery, [batch]);
    const total = countResult[0].total;

    console.log('Total schedules:', total);
    res.status(200).json({
      schedules,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error('Get schedules error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};