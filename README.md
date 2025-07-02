# 📚 FECE Lab Management System

A full-stack Lab Management System built for the **Faculty of Electrical and Computer Engineering (FECE)** at **Arba Minch University**. This system helps streamline lab equipment tracking, lab bookings, student attendance using QR codes, and lab report submissions—all in one centralized platform.

---

## 🛠️ Tech Stack

### 🖥️ Frontend

* **HTML**, **CSS**, **JavaScript**
* Vanilla JS (No frameworks like React)
* Responsive, user-friendly UI

### ⚙️ Backend

* **Node.js**
* **Express.js**
* **MySQL** (via XAMPP for local use)
* **CORS**, **Nodemon**
* File Upload Support using `multer`
* Excel Export using `exceljs` (or similar)

---

## 📁 Folder Structure

```
FECE-Lab-Management-System/
│
├── backend/                  # Express backend
│   ├── config/               # DB connection config
│   ├── controllers/          # Logic handlers
│   ├── models/               # Database queries
│   ├── routes/               # API route definitions
│   ├── uploads/              # Uploaded lab reports (PDFs)
│   └── index.js              # Server entry point
│
├── public/                  # Shared assets (CSS, images)
├── faculty/                 # Faculty admin HTML/CSS/JS
├── lab/                     # Lab admin pages
├── student/                 # Student pages
├── database/                # SQL schema or setup files
├── .env                     # Environment config
└── README.md                # Project documentation
```

---

## 🌟 Core Features

### 🧑‍💼 Faculty Admin

* Register Lab Admins, Students, and Lecturers
* View attendance logs and lab issues
* (Planned) Control security cameras in labs

### 🧪 Lab Admin

* Receive and evaluate lab reports
* Export attendance records in Excel format

### 🎓 Students

* Submit lab reports (PDF)
* View evaluation grades from lab admins

### 👨‍🏫 Lecturers

* Request lab sessions
* Take attendance using QR code scanning

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/ermi21ad/FECE-Lab-Management-System.git
cd FECE-Lab-Management-System
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

#### ➕ Create `.env` file in `/backend`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=fece_lab_management
PORT=5000
```

#### ▶️ Start the server

```bash
nodemon index.js
```

---

### 3️⃣ Frontend Setup

No build required. Open the HTML files directly in your browser:

* `faculty/index.html` — Faculty Admin Panel
* `lab/index.html` — Lab Admin Panel
* `student/index.html` — Student Dashboard

> ⚠️ Make sure the backend server is running to allow API communication.

---

## 🔌 Sample API Endpoints

| Method | Route                | Description                |
| ------ | -------------------- | -------------------------- |
| GET    | `/students`          | Fetch all students         |
| POST   | `/students`          | Register a new student     |
| POST   | `/reports/submit`    | Upload a lab report (PDF)  |
| GET    | `/attendance/export` | Export attendance as Excel |

---

## 🌐 Live Demo

* **Frontend**: [https://amu-fece-lab-management-system.netlify.app/](https://amu-fece-lab-management-system.netlify.app/)
* **Backend**: [https://fece-lab-management-system-2.onrender.com/](https://fece-lab-management-system-2.onrender.com/)

---

## 👨‍💻 Author

**Ermias Abebe**
🎓 Graduate in Electrical and Computer Engineering (Computer Stream)
🎓 Arba Minch University
🎯 Passionate about web development, systems design, and ICT infrastructure
🔗 [GitHub Profile](https://github.com/ermi21ad)

---
