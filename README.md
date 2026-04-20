#  Talent Tracker — Full Stack Recruitment Management System

## 📌 Overview

Talent Tracker is a full-stack recruitment management application built using **React (Vite), Node.js, MongoDB, and Firebase**. It helps recruiters manage candidates, job postings, and analytics with a secure and modern interface.

---

## 🛠️ Tech Stack

### 🔹 Frontend

* React (Vite)
* Ant Design
* AG Grid
* Recharts
* Axios
* Context API

### 🔹 Backend

* Node.js + Express
* MongoDB + Mongoose
* Firebase Admin SDK

### 🔹 Authentication

* Firebase Email/Password Authentication
* JWT (Firebase ID Token)

---

## 📁 Project Structure

```
talent-tracker/
│
├── client/                      # React frontend
│   ├── src/
│   │   ├── api/                # Axios setup
│   │   │   └── axiosInstance.js
│   │   ├── components/         # UI components
│   │   ├── contexts/           # Auth context
│   │   ├── firebase/           # Firebase config
│   │   ├── pages/              # Pages (Dashboard, Candidates, Jobs)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── server/                     # Backend (Express API)
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   ├── authMiddleware.js   # Firebase token verification
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   ├── Candidate.js
│   │   └── Job.js
│   ├── routes/
│   │   ├── candidates.js
│   │   ├── jobs.js
│   │   └── stats.js
│   ├── index.js
│   └── package.json
```

---

## 🚀 Features

### 🔐 Authentication

* Firebase login/logout
* Protected routes
* Secure API access using Bearer token

### 👨‍💼 Candidate Management

* Create, update, delete candidates
* Track status: Applied, Interview, Hired, Rejected

### 💼 Job Management

* Create and manage jobs
* Track job status: Open, Closed, On Hold

### 📊 Dashboard

* Total candidates & jobs
* Status-based analytics
* Charts (Bar + Pie)

### ⚡ API System

* RESTful APIs
* Middleware-based authentication
* Centralized error handling

---

## ⚙️ Installation & Setup

### 🔹 Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Talent-tracker.git
cd Talent-tracker
```

---

### 🔹 Backend Setup

```bash
cd server
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_SERVICE_ACCOUNT=./serviceAccount.json
```

Run backend:

```bash
npm run dev
```

---

### 🔹 Frontend Setup

```bash
cd client
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run frontend:

```bash
npm run dev
```

---

## 🔄 API Endpoints

### Candidates

* GET `/api/candidates`
* POST `/api/candidates`
* PUT `/api/candidates/:id`
* DELETE `/api/candidates/:id`

### Jobs

* GET `/api/jobs`
* POST `/api/jobs`
* PUT `/api/jobs/:id`
* DELETE `/api/jobs/:id`

### Stats

* GET `/api/stats`

(All endpoints are protected)

---

## 🧠 Key Concepts

* Full-stack development (MERN + Firebase)
* Authentication & Authorization
* REST API design
* Context API (state management)
* Axios interceptors
* Data visualization

---

## 👨‍💻 Author

**Suresh**
