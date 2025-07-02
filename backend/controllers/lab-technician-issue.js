const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getAllIssues = async (req, res) => {
  console.log('Fetching all issues for lab technician:', {
    userId: req.user.userId,
    role: req.user.role,
    timestamp: new Date().toISOString()
  });

  try {
    const [issues] = await pool.query(`
      SELECT 
        issue_id,
        issue_type,
        description,
        priority,
        equipment_name,
        status,
        created_at,
        updated_at
      FROM issue_reports
      WHERE technician_id = ?
    `, [req.user.userId]);

    console.log('Issues fetched:', {
      count: issues.length,
      sample: issues.length > 0 ? issues[0] : null,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ issues });
  } catch (err) {
    console.error('Error fetching issues:', {
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

exports.createIssue = async (req, res) => {
  console.log('Creating new issue for lab technician:', {
    userId: req.user.userId,
    role: req.user.role,
    timestamp: new Date().toISOString()
  });

  const { issue_type, description, priority, equipment_name } = req.body;
  const issue_id = `ISS/${uuidv4().split('-')[0]}`;
  const technician_id = req.user.userId;

  if (!issue_type || !description || !priority) {
    console.warn('Validation failed for new issue:', { issue_type, description, priority });
    return res.status(400).json({ message: 'Issue type, description, and priority are required' });
  }

  try {
    await pool.query(`
      INSERT INTO issue_reports (
        issue_id, technician_id, issue_type, description, priority, 
        equipment_name, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'Open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `, [issue_id, technician_id, issue_type, description, priority, equipment_name || null]);

    console.log('Issue created:', { issue_id, technician_id, issue_type, timestamp: new Date().toISOString() });

    res.status(201).json({ message: 'Issue reported successfully', issue_id });
  } catch (err) {
    console.error('Error creating issue:', {
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