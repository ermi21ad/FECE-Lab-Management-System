const pool = require('../config/db');
const path = require('path');
const JSZip = require('jszip');

exports.getAllAssignments = async (req, res) => {
  console.log('Fetching all assignments for lecturer:', {
    userId: req.user.userId,
    role: req.user.role,
    query: req.query,
    timestamp: new Date().toISOString()
  });

  const { page = 1, limit = 10, search = '' } = req.query;
  const offset = (page - 1) * limit;
  const searchTerm = `%${search}%`;

  try {
    const [assignments] = await pool.query(`
      SELECT 
        name AS title,
        'Circuit Analysis (ECE-201)' AS course,
        'Batch A' AS batch,
        '2025-04-15 23:59:00' AS due_date,
        COUNT(*) AS submissions,
        10 AS total_students
      FROM assignment_submissions
      WHERE name LIKE ?
      GROUP BY name
      LIMIT ? OFFSET ?
    `, [searchTerm, parseInt(limit), parseInt(offset)]);

    const [[{ total }]] = await pool.query(`
      SELECT COUNT(DISTINCT name) AS total
      FROM assignment_submissions
      WHERE name LIKE ?
    `, [searchTerm]);

    console.log('Assignments fetched:', {
      count: assignments.length,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      sample: assignments[0],
      timestamp: new Date().toISOString()
    });

    res.json({
      assignments,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Error fetching assignments:', {
      message: err.message,
      sql: err.sql || 'N/A',
      code: err.code || 'N/A',
      errno: err.errno || 'N/A',
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: Unable to fetch assignments' });
  }
};

exports.getSubmissions = async (req, res) => {
  console.log('Fetching submissions for lecturer:', {
    userId: req.user.userId,
    role: req.user.role,
    assignmentId: req.params.assignmentId,
    query: req.query,
    timestamp: new Date().toISOString()
  });

  const { assignmentId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const [submissions] = await pool.query(`
      SELECT 
        submission_id,
        student_id,
        name,
        created_at,
        status,
        grade,
        feedback,
        file_name
      FROM assignment_submissions
      WHERE name = ?
      LIMIT ? OFFSET ?
    `, [assignmentId, parseInt(limit), parseInt(offset)]);

    const [[{ total }]] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM assignment_submissions
      WHERE name = ?
    `, [assignmentId]);

    console.log('Submissions fetched:', {
      count: submissions.length,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      sample: submissions[0],
      timestamp: new Date().toISOString()
    });

    res.json({
      submissions,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Error fetching submissions:', {
      message: err.message,
      sql: err.sql || 'N/A',
      code: err.code || 'N/A',
      errno: err.errno || 'N/A',
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: Unable to fetch submissions' });
  }
};

exports.updateSubmission = async (req, res) => {
  console.log('Updating submission for lecturer:', {
    userId: req.user.userId,
    role: req.user.role,
    submissionId: req.params.submissionId,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  const { submissionId } = req.params;
  const { status, grade, feedback } = req.body;

  if (!status || !['Submitted', 'Graded', 'Rejected'].includes(status)) {
    console.warn('Invalid status:', { submissionId, status });
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    // Verify submission exists
    const [[submission]] = await pool.query(`
      SELECT submission_id
      FROM assignment_submissions
      WHERE submission_id = ?
    `, [submissionId]);

    if (!submission) {
      console.warn('Submission not found:', { submissionId });
      return res.status(404).json({ message: 'Submission not found' });
    }

    const [result] = await pool.query(`
      UPDATE assignment_submissions
      SET 
        status = ?,
        grade = ?,
        feedback = ?,
        graded_by = ?,
        graded_at = ?,
        updated_at = ?
      WHERE submission_id = ?
    `, [status, grade, feedback, req.user.userId, new Date(), new Date(), submissionId]);

    if (result.affectedRows === 0) {
      console.warn('No rows updated:', { submissionId });
      return res.status(404).json({ message: 'Submission not found' });
    }

    console.log('Submission updated:', {
      submissionId,
      status,
      grade,
      feedback,
      gradedBy: req.user.userId,
      timestamp: new Date().toISOString()
    });

    res.json({ message: 'Submission updated successfully' });
  } catch (err) {
    console.error('Error updating submission:', {
      message: err.message,
      sql: err.sql || 'N/A',
      code: err.code || 'N/A',
      errno: err.errno || 'N/A',
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: Unable to update submission' });
  }
};

exports.downloadSubmission = async (req, res) => {
  console.log('Downloading submission for lecturer:', {
    userId: req.user.userId,
    role: req.user.role,
    submissionId: req.params.submissionId,
    timestamp: new Date().toISOString()
  });

  const { submissionId } = req.params;

  try {
    const [[submission]] = await pool.query(`
      SELECT file_name, file_content
      FROM assignment_submissions
      WHERE submission_id = ?
    `, [submissionId]);

    if (!submission) {
      console.warn('Submission not found:', { submissionId });
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (!submission.file_content || submission.file_content.length === 0) {
      console.warn('Invalid file content:', { submissionId });
      return res.status(400).json({ message: 'No file content available' });
    }

    const ext = path.extname(submission.file_name).toLowerCase();
    const mimeTypes = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain'
    };
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    res.setHeader('Content-Disposition', `attachment; filename="${submission.file_name}"`);
    res.setHeader('Content-Type', contentType);
    res.send(submission.file_content);

    console.log('Submission downloaded:', {
      submissionId,
      fileName: submission.file_name,
      contentType,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error downloading submission:', {
      message: err.message,
      sql: err.sql || 'N/A',
      code: err.code || 'N/A',
      errno: err.errno || 'N/A',
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: Unable to download submission' });
  }
};

exports.downloadAllSubmissions = async (req, res) => {
  console.log('Downloading all submissions for lecturer:', {
    userId: req.user.userId,
    role: req.user.role,
    assignmentId: req.params.assignmentId,
    timestamp: new Date().toISOString()
  });

  const { assignmentId } = req.params;

  try {
    const [submissions] = await pool.query(`
      SELECT submission_id, file_name, file_content
      FROM assignment_submissions
      WHERE name = ?
    `, [assignmentId]);

    if (!submissions.length) {
      console.warn('No submissions found for assignment:', { assignmentId });
      return res.status(404).json({ message: 'No submissions found for this assignment' });
    }

    const zip = new JSZip();
    submissions.forEach(submission => {
      if (submission.file_content && submission.file_content.length > 0) {
        zip.file(submission.file_name, submission.file_content);
      }
    });

    const content = await zip.generateAsync({ type: 'nodebuffer' });

    res.setHeader('Content-Disposition', `attachment; filename="${assignmentId.replace(/\s+/g, '_')}_submissions.zip"`);
    res.setHeader('Content-Type', 'application/zip');
    res.send(content);

    console.log('All submissions downloaded:', {
      assignmentId,
      fileCount: submissions.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error downloading all submissions:', {
      message: err.message,
      sql: err.sql || 'N/A',
      code: err.code || 'N/A',
      errno: err.errno || 'N/A',
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ message: 'Server error: Unable to download submissions' });
  }
};