const pool = require('../config/db');
const fs = require('fs').promises;

exports.submitAssignment = async (req, res) => {
  console.log('Submit assignment request:', { userId: req.user.userId, files: req.files });

  try {
    const { name, description } = req.body;
    const student_id = req.user.userId;

    // Validate input
    if (!name || !description || !req.files || !req.files.length) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Name, description, and file are required' });
    }

    const file = req.files[0];
    if (!file.mimetype.includes('pdf')) {
      console.log('Invalid file type:', file.mimetype);
      return res.status(400).json({ message: 'Only PDF files are allowed' });
    }

    // Generate unique submission ID
    const [countResult] = await pool.query('SELECT COUNT(*) as count FROM assignment_submissions');
    const submission_id = `SUB/${String(countResult[0].count + 1).padStart(3, '0')}`;

    // Read file content
    const fileContent = await fs.readFile(file.path);
    const fileName = file.originalname;

    // Insert into database
    const query = `
      INSERT INTO assignment_submissions (
        submission_id, student_id, name, description, file_content, file_name, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [submission_id, student_id, name, description, fileContent, fileName, 'Submitted']);

    // Clean up temporary file
    await fs.unlink(file.path).catch(err => console.warn('Failed to delete temp file:', err.message));

    console.log('Assignment submitted:', { submission_id, student_id, fileName });
    res.status(201).json({ message: 'Assignment submitted successfully', submission_id });
  } catch (err) {
    console.error('Submit assignment error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};