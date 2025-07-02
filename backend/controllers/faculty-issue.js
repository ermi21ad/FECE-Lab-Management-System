const pool = require('../config/db');

exports.getIssues = async (req, res) => {
  console.log('Fetching issue reports:', {
    userId: req.user.userId,
    timestamp: new Date().toISOString()
  });

  try {
    const [rows] = await pool.query(
      `SELECT issue_id, technician_id, issue_type, description, priority, equipment_name, status, created_at, updated_at, feedback
       FROM issue_reports
       ORDER BY created_at DESC`
    );

    console.log('Issues fetched:', { count: rows.length });
    res.json(rows);
  } catch (err) {
    console.error('Error fetching issues:', {
      message: err.message,
      stack: err.stack,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateIssue = async (req, res) => {
  console.log('Updating issue report:', {
    userId: req.user.userId,
    issueId: req.params.issue_id,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  const { status, feedback } = req.body;
  const issueId = req.params.issue_id;

  try {
    // Validate status
    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    if (status && !validStatuses.includes(status)) {
      console.warn('Invalid status provided:', { status, issueId });
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if issue exists
    const [rows] = await pool.query(
      `SELECT issue_id FROM issue_reports WHERE issue_id = ?`,
      [issueId]
    );

    if (!rows || rows.length === 0) {
      console.warn('Issue not found:', { issueId });
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Update issue
    const updates = {};
    if (status) updates.status = status;
    if (feedback !== undefined) updates.feedback = feedback || null;

    if (Object.keys(updates).length === 0) {
      console.warn('No fields to update:', { issueId });
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), new Date(), issueId];

    const query = `UPDATE issue_reports SET ${fields}, updated_at = ? WHERE issue_id = ?`;
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      console.warn('Issue update failed:', { issueId });
      return res.status(404).json({ message: 'Issue not found' });
    }

    console.log('Issue updated:', { issueId, fields });
    res.json({ message: 'Issue updated successfully' });
  } catch (err) {
    console.error('Error updating issue:', {
      message: err.message,
      stack: err.stack,
      sqlMessage: err.sqlMessage,
      sqlState: err.sqlState,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = exports;