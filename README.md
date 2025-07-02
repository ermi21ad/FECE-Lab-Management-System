# 📚 FECE Lab Management System

A full-stack Lab Management System built for the **Faculty of Electrical and Computer Engineering (FECE)** at **Arba Minch University**. This system helps streamline lab equipment tracking, lab bookings, student attendance using QR codes, and lab report submissions—all in one centralized platform.

---

## 🛠️ Tech Stack

### Frontend
- **HTML**, **CSS**, **JavaScript**
- Plain JS DOM (Not React)
- Responsive UI design

### Backend
- **Node.js**
- **Express.js**
- **MySQL** (via XAMPP)
- **CORS**, **Nodemon**
- File Upload support (`multer`)
- Excel Export (`exceljs` or similar)

---

## 📁 Folder Structure

FECE-Lab-Management-System/
│
├── backend/ # Express backend
│ ├── config/ # DB connection config
│ ├── controllers/ # Logic handlers
│ ├── models/ # DB queries
│ ├── routes/ # Express routes
│ ├── uploads/ # Uploaded reports
│ └── index.js # Server entry point
│
├── public/ # Shared public assets (images, CSS)
│
├── faculty/ # Faculty admin HTML/CSS/JS pages
├── lab/ # Lab admin pages
├── student/ # Student pages
│
├── database/ # SQL setup or schema files (if any)
├── README.md # Project documentation
└── .env # Backend config (DB, port, etc.)

---

## 🌟 Core Features

### 🧑‍💼 Faculty Admin
- Register Lab Admins, Students, Lecturers
- View lab issues and attendance logs
- Control lab security cameras (planned feature)

### 🧪 Lab Admin
- Receive & evaluate lab reports
- Export attendance records (Excel)

### 🎓 Students
- Submit PDF lab reports
- View evaluation grades

### 👨‍🏫 Lecturers
- Request lab sessions
- Record attendance via QR Code scanning

---

## 🚀 Getting Started (Local Setup)

### 1. Clone the Repo

2. Backend Setup
bash
Copy
Edit
cd backend
npm install
Create .env file:

.env

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=fece_lab_management
PORT=5000
Start the backend:


nodemon index.js
3. Frontend Setup
Just open the HTML files inside the /faculty, /student, or /lab folders directly in the browser.
Make sure the backend is running for API requests.

🧪 Sample API Endpoints
Method	Route	Description
GET	/students	Fetch all students
POST	/students	Register a new student
POST	/reports/submit	Upload a lab report (PDF)
GET	/attendance/export	Export attendance as Excel

📸 Screenshots
Add screenshots of UI pages here if available (Faculty Dashboard, QR Scanner, etc.)

📄 License
This project is built for educational and academic purposes at Arba Minch University.

👨‍💻 Author
Ermias Abebe
🎓 Electrical and Computer Engineering (Computer Stream)
🎓 Arba Minch University Graduate
🎯 Passionate about web development, systems design, and ICT infrastructure
