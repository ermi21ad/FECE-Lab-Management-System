const pool = require('../config/db');

console.log('Lecturer requests controller loaded');

const getRequests = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user.userId;
  const offset = (page - 1) * limit;

  console.log('Get lecturer requests request:', { userId, page, limit, offset });

  try {
    const query = `
      SELECT request_id, type, requested_by_id, requested_by_name, details, status, created_at, updated_at
      FROM lecturer_requests
      WHERE requested_by_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const countQuery = 'SELECT COUNT(*) as total FROM lecturer_requests WHERE requested_by_id = ?';
    const params = [userId, Number(limit), Number(offset)];
    const countParams = [userId];

    const [requests] = await pool.query(query, params);
    const [countResult] = await pool.query(countQuery, countParams);
    const total = countResult[0].total;

    console.log('Lecturer requests fetched:', { count: requests.length, total });

    res.status(200).json({
      requests,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get lecturer requests error:', err.message, err.stack);
    res.status(500).json({ message: 'Failed to fetch requests: ' + err.message });
  }
};

const addRequest = async (req, res) => {
  const { request_id, type, details } = req.body;
  const userId = req.user.userId;
  const userName = req.user.name || 'Abebe Kebede'; // Fallback

  console.log('Add lecturer request data:', { request_id, type, userId, userName, details });

  try {
    if (!request_id || !type || !details) {
      return res.status(400).json({ message: 'Request ID, type, and details are required' });
    }

    const validTypes = ['Equipment', 'Lab Booking'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }

    // Check for duplicate request_id
    const [existing] = await pool.query('SELECT request_id FROM lecturer_requests WHERE request_id = ?', [request_id]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Request ID already exists' });
    }

    const [result] = await pool.query(
      `INSERT INTO lecturer_requests (
        request_id, type, requested_by_id, requested_by_name, details, status
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [request_id, type, userId, userName, details, 'Pending']
    );

    console.log('Add lecturer request result:', result);
    res.status(201).json({ message: 'Request added successfully', request_id });
  } catch (err) {
    console.error('Add lecturer request error:', err.message, err.stack);
    res.status(500).json({ message: 'Failed to add request: ' + err.message });
  }
};

module.exports = { getRequests, addRequest };