
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const multer = require('multer');

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const upload = multer({ dest: path.join(__dirname, '..', 'Uploads') });
// app.use(upload.any());

// // Static files
// const staticPath = path.join(__dirname, '..');
// app.use(express.static(staticPath));
// console.log('Static files served from:', staticPath);

// // Routes
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/lecturer-profile');
// const studentProfileRoutes = require('./routes/student-profile');
// const studentScheduleRoutes = require('./routes/student-schedule');
// const studentAssignmentRoutes = require('./routes/student-assignment');
// const studentLabEquipmentRequestRoutes = require('./routes/student-lab-and-equipment-request');
// const labTechnicianProfileRoutes = require('./routes/lab-technician-profile');
// const labTechnicianEquipmentRoutes = require('./routes/lab-technician-equipment');
// const labTechnicianRequestRoutes = require('./routes/lab-technician-request');
// const labTechnicianIssueRoutes = require('./routes/lab-technician-issue');
// const equipmentRoutes = require('./routes/equipment');
// const schedulesRoutes = require('./routes/schedules');
// const lecturerSchedulesRoutes = require('./routes/lecturer-schedules');
// const lecturerRequestsRoutes = require('./routes/lecturer-requests');

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/student-profile', studentProfileRoutes);
// app.use('/api/student-schedules', studentScheduleRoutes);
// app.use('/api/student-assignments', studentAssignmentRoutes);
// app.use('/api/student-booking-requests', studentLabEquipmentRequestRoutes);
// app.use('/api/lab-technician-profile', labTechnicianProfileRoutes);
// app.use('/api/lab-technician-equipment', labTechnicianEquipmentRoutes);
// app.use('/api/lab-technician-requests', labTechnicianRequestRoutes);
// app.use('/api/lab-technician-issues', labTechnicianIssueRoutes);
// app.use('/api/equipment', equipmentRoutes);
// app.use('/api/schedules', schedulesRoutes);
// app.use('/api/lecturer-schedules', lecturerSchedulesRoutes);
// app.use('/api/lecturer-requests', lecturerRequestsRoutes);

// // Error handling
// app.use((err, req, res, next) => {
//   console.error('Server error:', err.message, err.stack);
//   res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const multer = require('multer');

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const upload = multer({ dest: path.join(__dirname, '..', 'Uploads') });
// app.use(upload.any());

// // Routes - API routes before static files
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/lecturer-profile');
// const studentProfileRoutes = require('./routes/student-profile');
// const studentScheduleRoutes = require('./routes/student-schedule');
// const studentAssignmentRoutes = require('./routes/student-assignment');
// const studentLabEquipmentRequestRoutes = require('./routes/student-lab-and-equipment-request');
// const labTechnicianProfileRoutes = require('./routes/lab-technician-profile');
// const labTechnicianEquipmentRoutes = require('./routes/lab-technician-equipment');
// const labTechnicianRequestRoutes = require('./routes/lab-technician-request');
// const labTechnicianIssueRoutes = require('./routes/lab-technician-issue');
// const equipmentRoutes = require('./routes/equipment');
// const schedulesRoutes = require('./routes/schedules');
// const lecturerSchedulesRoutes = require('./routes/lecturer-schedules');
// const lecturerRequestsRoutes = require('./routes/lecturer-requests');
// const lecturerAssignmentRoutes = require('./routes/lecturer-assignment');

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/student-profile', studentProfileRoutes);
// app.use('/api/student-schedules', studentScheduleRoutes);
// app.use('/api/student-assignments', studentAssignmentRoutes);
// app.use('/api/student-booking-requests', studentLabEquipmentRequestRoutes);
// app.use('/api/lab-technician-profile', labTechnicianProfileRoutes);
// app.use('/api/lab-technician-equipment', labTechnicianEquipmentRoutes);
// app.use('/api/lab-technician-requests', labTechnicianRequestRoutes);
// app.use('/api/lab-technician-issues', labTechnicianIssueRoutes);
// app.use('/api/equipment', equipmentRoutes);
// app.use('/api/schedules', schedulesRoutes);
// app.use('/api/lecturer-schedules', lecturerSchedulesRoutes);
// app.use('/api/lecturer-requests', lecturerRequestsRoutes);
// app.use('/api/lecturer-assignments', lecturerAssignmentRoutes);

// // Static files - Serve after API routes
// const staticPath = path.join(__dirname, '..');
// app.use(express.static(staticPath));
// console.log('Static files served from:', staticPath);

// // Serve index.html for root route
// app.get('/', (req, res) => {
//   console.log('Serving index.html for root route', { timestamp: new Date().toISOString() });
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

// // Error handling for undefined routes
// app.use((req, res, next) => {
//   console.log('Route not found:', { method: req.method, url: req.url, timestamp: new Date().toISOString() });
//   res.status(404).json({ message: 'Route not found' });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Server error:', {
//     message: err.message,
//     stack: err.stack,
//     method: req.method,
//     url: req.url,
//     timestamp: new Date().toISOString()
//   });
//   res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const multer = require('multer');

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const upload = multer({ dest: path.join(__dirname, '..', 'Uploads') });

// // Log all incoming requests for debugging
// app.use((req, res, next) => {
//   console.log('Incoming request:', {
//     method: req.method,
//     url: req.url,
//     headers: req.headers,
//     timestamp: new Date().toISOString()
//   });
//   next();
// });

// // Routes - API routes before static files
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/lecturer-profile');
// const studentProfileRoutes = require('./routes/student-profile');
// const studentScheduleRoutes = require('./routes/student-schedule');
// const studentAssignmentRoutes = require('./routes/student-assignment');
// const studentLabEquipmentRequestRoutes = require('./routes/student-lab-and-equipment-request');
// const labTechnicianProfileRoutes = require('./routes/lab-technician-profile');
// const labTechnicianEquipmentRoutes = require('./routes/lab-technician-equipment');
// const labTechnicianRequestRoutes = require('./routes/lab-technician-request');
// const labTechnicianIssueRoutes = require('./routes/lab-technician-issue');
// const equipmentRoutes = require('./routes/equipment');
// const schedulesRoutes = require('./routes/schedules');
// const lecturerSchedulesRoutes = require('./routes/lecturer-schedules');
// const lecturerRequestsRoutes = require('./routes/lecturer-requests');
// const lecturerAssignmentRoutes = require('./routes/lecturer-assignment');
// const facultyRequestsRoutes = require('./routes/faculty-requests');

// console.log('Mounting routes...');
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/student-profile', studentProfileRoutes);
// app.use('/api/student-schedules', studentScheduleRoutes);
// app.use('/api/student-assignments', upload.any(), studentAssignmentRoutes);
// app.use('/api/student-booking-requests', upload.any(), studentLabEquipmentRequestRoutes);
// app.use('/api/lab-technician-profile', labTechnicianProfileRoutes);
// app.use('/api/lab-technician-equipment', labTechnicianEquipmentRoutes);
// app.use('/api/lab-technician-requests', labTechnicianRequestRoutes);
// app.use('/api/lab-technician-issues', labTechnicianIssueRoutes);
// app.use('/api/equipment', equipmentRoutes);
// app.use('/api/schedules', schedulesRoutes);
// app.use('/api/lecturer-schedules', lecturerSchedulesRoutes);
// app.use('/api/lecturer-requests', lecturerRequestsRoutes);
// app.use('/api/lecturer-assignments', lecturerAssignmentRoutes);
// app.use('/api/requests', facultyRequestsRoutes);
// console.log('Routes mounted:', {
//   facultyRequests: '/api/requests',
//   timestamp: new Date().toISOString()
// });

// // Static files - Serve after API routes
// const staticPath = path.join(__dirname, '..');
// app.use(express.static(staticPath));
// console.log('Static files served from:', staticPath);

// // Serve index.html for root route
// app.get('/', (req, res) => {
//   console.log('Serving index.html for root route', { timestamp: new Date().toISOString() });
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

// // Error handling for undefined routes
// app.use((req, res, next) => {
//   console.log('Route not found:', { method: req.method, url: req.url, timestamp: new Date().toISOString() });
//   res.status(404).json({ message: 'Route not found' });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Server error:', {
//     message: err.message,
//     stack: err.stack,
//     method: req.method,
//     url: req.url,
//     timestamp: new Date().toISOString()
//   });
//   res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const multer = require('multer');

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const upload = multer({ dest: path.join(__dirname, '..', 'Uploads') });

// // Log all incoming requests for debugging
// app.use((req, res, next) => {
//   console.log('Incoming request:', {
//     method: req.method,
//     url: req.url,
//     headers: { authorization: req.headers.authorization || 'None', 'content-type': req.headers['content-type'] || 'None' },
//     timestamp: new Date().toISOString()
//   });
//   next();
// });

// // Routes - API routes before static files
// console.log('Loading routes:', { timestamp: new Date().toISOString() });
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/lecturer-profile');
// const studentProfileRoutes = require('./routes/student-profile');
// const studentScheduleRoutes = require('./routes/student-schedule');
// const studentAssignmentRoutes = require('./routes/student-assignment');
// const studentLabEquipmentRequestRoutes = require('./routes/student-lab-and-equipment-request');
// const labTechnicianProfileRoutes = require('./routes/lab-technician-profile');
// const labTechnicianEquipmentRoutes = require('./routes/lab-technician-equipment');
// const labTechnicianRequestRoutes = require('./routes/lab-technician-request');
// const labTechnicianIssueRoutes = require('./routes/lab-technician-issue');
// const equipmentRoutes = require('./routes/equipment');
// const schedulesRoutes = require('./routes/schedules');
// const lecturerSchedulesRoutes = require('./routes/lecturer-schedules');
// const lecturerRequestsRoutes = require('./routes/lecturer-requests');
// const lecturerAssignmentRoutes = require('./routes/lecturer-assignment');
// const facultyRequestsRoutes = require('./routes/faculty-requests');

// console.log('Mounting routes...');
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/student-profile', studentProfileRoutes);
// app.use('/api/student-schedules', studentScheduleRoutes);
// app.use('/api/student-assignments', upload.any(), studentAssignmentRoutes);
// app.use('/api/student-booking-requests', upload.any(), studentLabEquipmentRequestRoutes);
// app.use('/api/lab-technician-profile', labTechnicianProfileRoutes);
// app.use('/api/lab-technician-equipment', labTechnicianEquipmentRoutes);
// app.use('/api/lab-technician-requests', labTechnicianRequestRoutes);
// app.use('/api/lab-technician-issues', labTechnicianIssueRoutes);
// app.use('/api/equipment', equipmentRoutes);
// app.use('/api/schedules', schedulesRoutes);
// app.use('/api/lecturer-schedules', lecturerSchedulesRoutes);
// app.use('/api/lecturer-requests', lecturerRequestsRoutes);
// app.use('/api/lecturer-assignments', lecturerAssignmentRoutes);
// app.use('/api/requests', facultyRequestsRoutes);

// console.log('Routes mounted:', {
//   routes: [
//     '/api/auth', '/api/users', '/api/profile', '/api/student-profile',
//     '/api/student-schedules', '/api/student-assignments', '/api/student-booking-requests',
//     '/api/lab-technician-profile', '/api/lab-technician-equipment', '/api/lab-technician-requests',
//     '/api/lab-technician-issues', '/api/equipment', '/api/schedules',
//     '/api/lecturer-schedules', '/api/lecturer-requests', '/api/lecturer-assignments',
//     '/api/requests'
//   ],
//   facultyRequests: '/api/requests',
//   timestamp: new Date().toISOString()
// });

// // Static files - Serve after API routes
// const staticPath = path.join(__dirname, '..');
// app.use(express.static(staticPath));
// console.log('Static files served from:', staticPath);

// // Serve index.html for root route
// app.get('/', (req, res) => {
//   console.log('Serving index.html for root route', { timestamp: new Date().toISOString() });
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

// // Error handling for undefined routes
// app.use((req, res, next) => {
//   console.log('Route not found:', { method: req.method, url: req.url, timestamp: new Date().toISOString() });
//   res.status(404).json({ message: 'Route not found' });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Server error:', {
//     message: err.message,
//     stack: err.stack,
//     method: req.method,
//     url: req.url,
//     timestamp: new Date().toISOString()
//   });
//   res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const multer = require('multer');

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const upload = multer({ dest: path.join(__dirname, '..', 'Uploads') });

// // Log all incoming requests
// app.use((req, res, next) => {
//   console.log('Incoming request:', {
//     method: req.method,
//     url: req.url,
//     headers: { authorization: req.headers.authorization || 'None', 'content-type': req.headers['content-type'] || 'None' },
//     timestamp: new Date().toISOString()
//   });
//   next();
// });

// // Routes
// console.log('Loading routes:', { timestamp: new Date().toISOString() });
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/lecturer-profile');
// const studentProfileRoutes = require('./routes/student-profile');
// const studentScheduleRoutes = require('./routes/student-schedule');
// const studentAssignmentRoutes = require('./routes/student-assignment');
// const studentLabEquipmentRequestRoutes = require('./routes/student-lab-and-equipment-request');
// const labTechnicianProfileRoutes = require('./routes/lab-technician-profile');
// const labTechnicianEquipmentRoutes = require('./routes/lab-technician-equipment');
// const labTechnicianRequestRoutes = require('./routes/lab-technician-request');
// const labTechnicianIssueRoutes = require('./routes/lab-technician-issue');
// const equipmentRoutes = require('./routes/equipment');
// const schedulesRoutes = require('./routes/schedules');
// const lecturerSchedulesRoutes = require('./routes/lecturer-schedules');
// const lecturerRequestsRoutes = require('./routes/lecturer-requests');
// const lecturerAssignmentRoutes = require('./routes/lecturer-assignment');
// const facultyRequestsRoutes = require('./routes/faculty-requests');

// console.log('Mounting routes...');
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/student-profile', studentProfileRoutes);
// app.use('/api/student-schedules', studentScheduleRoutes);
// app.use('/api/student-assignments', upload.any(), studentAssignmentRoutes);
// app.use('/api/student-booking-requests', upload.any(), studentLabEquipmentRequestRoutes);
// app.use('/api/lab-technician-profile', labTechnicianProfileRoutes);
// app.use('/api/lab-technician-equipment', labTechnicianEquipmentRoutes);
// app.use('/api/lab-technician-requests', labTechnicianRequestRoutes);
// app.use('/api/lab-technician-issues', labTechnicianIssueRoutes);
// app.use('/api/equipment', equipmentRoutes);
// app.use('/api/schedules', schedulesRoutes);
// app.use('/api/lecturer-schedules', lecturerSchedulesRoutes);
// app.use('/api/lecturer-requests', lecturerRequestsRoutes);
// app.use('/api/lecturer-assignments', lecturerAssignmentRoutes);
// app.use('/api/requests', facultyRequestsRoutes);
// console.log('Routes mounted:', {
//   routes: [
//     '/api/auth', '/api/users', '/api/profile', '/api/student-profile',
//     '/api/student-schedules', '/api/student-assignments', '/api/student-booking-requests',
//     '/api/lab-technician-profile', '/api/lab-technician-equipment', '/api/lab-technician-requests',
//     '/api/lab-technician-issues', '/api/equipment', '/api/schedules',
//     '/api/lecturer-schedules', '/api/lecturer-requests', '/api/lecturer-assignments',
//     '/api/requests'
//   ],
//   facultyRequests: '/api/requests',
//   timestamp: new Date().toISOString()
// });

// // Static files
// const staticPath = path.join(__dirname, '..');
// app.use(express.static(staticPath));
// console.log('Static files served from:', staticPath);

// // Serve index.html
// app.get('/', (req, res) => {
//   console.log('Serving index.html', { timestamp: new Date().toISOString() });
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

// // Error handling for undefined routes
// app.use((req, res, next) => {
//   console.log('Route not found:', { method: req.method, url: req.url, timestamp: new Date().toISOString() });
//   res.status(404).json({ message: 'Route not found' });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Server error:', {
//     message: err.message,
//     stack: err.stack,
//     method: req.method,
//     url: req.url,
//     timestamp: new Date().toISOString()
//   });
//   res.status(err.status || 500).json({ message: err.message || 'Something went wrong!' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const multer = require('multer');

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// const upload = multer({ dest: path.join(__dirname, '..', 'Uploads') });

// // Log all incoming requests
// app.use((req, res, next) => {
//   console.log('Incoming request:', {
//     method: req.method,
//     url: req.url,
//     headers: { authorization: req.headers.authorization || 'None', 'content-type': req.headers['content-type'] || 'None' },
//     timestamp: new Date().toISOString()
//   });
//   next();
// });

// // Routes
// console.log('Loading routes:', { timestamp: new Date().toISOString() });
// const authRoutes = require('./routes/auth');
// const userRoutes = require('./routes/user');
// const profileRoutes = require('./routes/lecturer-profile');
// const studentProfileRoutes = require('./routes/student-profile');
// const studentScheduleRoutes = require('./routes/student-schedule');
// const studentAssignmentRoutes = require('./routes/student-assignment');
// const studentLabEquipmentRequestRoutes = require('./routes/student-lab-and-equipment-request');
// const labTechnicianProfileRoutes = require('./routes/lab-technician-profile');
// const labTechnicianEquipmentRoutes = require('./routes/lab-technician-equipment');
// const labTechnicianRequestRoutes = require('./routes/lab-technician-request');
// const labTechnicianIssueRoutes = require('./routes/lab-technician-issue');
// const equipmentRoutes = require('./routes/equipment');
// const schedulesRoutes = require('./routes/schedules');
// const lecturerSchedulesRoutes = require('./routes/lecturer-schedules');
// const lecturerRequestsRoutes = require('./routes/lecturer-requests');
// const lecturerAssignmentRoutes = require('./routes/lecturer-assignment');
// const facultyRequestsRoutes = require('./routes/faculty-requests');
// const facultyProfileRoutes = require('./routes/faculty-profile');

// console.log('Mounting routes...');
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/student-profile', studentProfileRoutes);
// app.use('/api/student-schedules', studentScheduleRoutes);
// app.use('/api/student-assignments', upload.any(), studentAssignmentRoutes);
// app.use('/api/student-booking-requests', upload.any(), studentLabEquipmentRequestRoutes);
// app.use('/api/lab-technician-profile', labTechnicianProfileRoutes);
// app.use('/api/lab-technician-equipment', labTechnicianEquipmentRoutes);
// app.use('/api/lab-technician-requests', labTechnicianRequestRoutes);
// app.use('/api/lab-technician-issues', labTechnicianIssueRoutes);
// app.use('/api/equipment', equipmentRoutes);
// app.use('/api/schedules', schedulesRoutes);
// app.use('/api/lecturer-schedules', lecturerSchedulesRoutes);
// app.use('/api/lecturer-requests', lecturerRequestsRoutes);
// app.use('/api/lecturer-assignments', lecturerAssignmentRoutes);
// app.use('/api/requests', facultyRequestsRoutes);
// app.use('/api/faculty-profile', facultyProfileRoutes);
// console.log('Routes mounted:', {
//   routes: [
//     '/api/auth', '/api/users', '/api/profile', '/api/student-profile',
//     '/api/student-schedules', '/api/student-assignments', '/api/student-booking-requests',
//     '/api/lab-technician-profile', '/api/lab-technician-equipment', '/api/lab-technician-requests',
//     '/api/lab-technician-issues', '/api/equipment', '/api/schedules',
//     '/api/lecturer-schedules', '/api/lecturer-requests', '/api/lecturer-assignments',
//     '/api/requests', '/api/faculty-profile'
//   ],
//   timestamp: new Date().toISOString()
// });

// // Static files
// const staticPath = path.join(__dirname, '..');
// app.use(express.static(staticPath));
// console.log('Static files served from:', staticPath);

// // Serve index.html
// app.get('/', (req, res) => {
//   console.log('Serving index.html', { timestamp: new Date().toISOString() });
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });

// // Error handling
// app.use((req, res, next) => {
//   console.log('Route not found:', { method: req.method, url: req.url, timestamp: new Date().toISOString() });
//   res.status(404).json({ message: 'Route not found' });
// });

// app.use((err, req, res, next) => {
//   console.error('Server error:', {
//     message: err.message,
//     stack: err.stack,
//     method: req.method,
//     url: req.url,
//     timestamp: new Date().toISOString()
//   });
//   res.status(err.status || 500).json({ message: err.message || 'Server error' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: path.join(__dirname, '..', 'Uploads') });

// Log all incoming requests
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: { authorization: req.headers.authorization || 'None', 'content-type': req.headers['content-type'] || 'None' },
    timestamp: new Date().toISOString()
  });
  next();
});

// Routes
console.log('Loading routes:', { timestamp: new Date().toISOString() });
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/lecturer-profile');
const studentProfileRoutes = require('./routes/student-profile');
const studentScheduleRoutes = require('./routes/student-schedule');
const studentAssignmentRoutes = require('./routes/student-assignment');
const studentLabEquipmentRequestRoutes = require('./routes/student-lab-and-equipment-request');
const labTechnicianProfileRoutes = require('./routes/lab-technician-profile');
const labTechnicianEquipmentRoutes = require('./routes/lab-technician-equipment');
const labTechnicianRequestRoutes = require('./routes/lab-technician-request');
const labTechnicianIssueRoutes = require('./routes/lab-technician-issue');
const equipmentRoutes = require('./routes/equipment');
const schedulesRoutes = require('./routes/schedules');
const lecturerSchedulesRoutes = require('./routes/lecturer-schedules');
const lecturerRequestsRoutes = require('./routes/lecturer-requests');
const lecturerAssignmentRoutes = require('./routes/lecturer-assignment');
const facultyRequestsRoutes = require('./routes/faculty-requests');
const facultyProfileRoutes = require('./routes/faculty-profile');
const facultyIssueRoutes = require('./routes/faculty-issue');

console.log('Mounting routes...');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/student-profile', studentProfileRoutes);
app.use('/api/student-schedules', studentScheduleRoutes);
app.use('/api/student-assignments', upload.any(), studentAssignmentRoutes);
app.use('/api/student-booking-requests', upload.any(), studentLabEquipmentRequestRoutes);
app.use('/api/lab-technician-profile', labTechnicianProfileRoutes);
app.use('/api/lab-technician-equipment', labTechnicianEquipmentRoutes);
app.use('/api/lab-technician-requests', labTechnicianRequestRoutes);
app.use('/api/lab-technician-issues', labTechnicianIssueRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/schedules', schedulesRoutes);
app.use('/api/lecturer-schedules', lecturerSchedulesRoutes);
app.use('/api/lecturer-requests', lecturerRequestsRoutes);
app.use('/api/lecturer-assignments', lecturerAssignmentRoutes);
app.use('/api/requests', facultyRequestsRoutes);
app.use('/api/faculty-profile', facultyProfileRoutes);
app.use('/api/faculty-issue', facultyIssueRoutes);
console.log('Routes mounted:', {
  routes: [
    '/api/auth', '/api/users', '/api/profile', '/api/student-profile',
    '/api/student-schedules', '/api/student-assignments', '/api/student-booking-requests',
    '/api/lab-technician-profile', '/api/lab-technician-equipment', '/api/lab-technician-requests',
    '/api/lab-technician-issues', '/api/equipment', '/api/schedules',
    '/api/lecturer-schedules', '/api/lecturer-requests', '/api/lecturer-assignments',
    '/api/requests', '/api/faculty-profile', '/api/faculty-issue'
  ],
  timestamp: new Date().toISOString()
});

// Static files
const staticPath = path.join(__dirname, '..');
app.use(express.static(staticPath));
console.log('Static files served from:', staticPath);

// Serve index.html
app.get('/', (req, res) => {
  console.log('Serving index.html', { timestamp: new Date().toISOString() });
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handling
app.use((req, res, next) => {
  console.log('Route not found:', { method: req.method, url: req.url, timestamp: new Date().toISOString() });
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString()
  });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));