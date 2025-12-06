# 🚀 Roxiler Fullstack Assignment

A full-stack web application built using **React, Tailwind CSS, Node.js, Express, and PostgreSQL** featuring **JWT authentication, role-based access control, store management, and ratings system**.

This project demonstrates **real-world backend architecture + a clean, responsive frontend dashboard UI**.

---

## 🖥️ UI & Layout Highlights

- ✅ Clean Login & Register Pages
- ✅ Role-Based Dashboards:
  - Admin Dashboard
  - Store Owner Dashboard
  - Normal User Store Listing
- ✅ Responsive Layout using **Tailwind CSS**
- ✅ Rating UI with Star-Based Interaction
- ✅ Proper Error & Success Messages (Toastify)
- ✅ Form Validation & Protected Pages

The UI is designed for **clarity, usability, and recruiter-friendly demo flow**.

---

### Watch the Live Demo
https://drive.google.com/file/d/1hexO1CtHT0X0W7tfRnsf48QiPsVB8M_l/view

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt

### Database
- PostgreSQL (Local + Cloud compatible)

---

## ✅ Core Features

- ✅ User Registration & Login
- ✅ JWT-based Authentication
- ✅ Role-Based Access Control:
  - **SYSTEM_ADMIN**
  - **STORE_OWNER**
  - **NORMAL_USER**
- ✅ Store Management (Owner)
- ✅ Store Browsing (Users)
- ✅ Ratings & Average Ratings
- ✅ Protected Backend APIs
- ✅ Secure Password Hashing
- ✅ SQL Relations & Foreign Keys

---

## 👥 Role Access Overview

| Role | Access |
|------|--------|
| **Admin** | System management |
| **Store Owner** | Add & manage stores, view ratings |
| **Normal User** | Browse stores & submit ratings |

---

## 🔐 Authentication Flow

1. User logs in
2. JWT
   5. Role is extracted from JWT to control routing & permissions

---

## 🗃 Database Tables

- `users`
- `roles`
- `stores`
- `ratings`

With proper **foreign key constraints** for data integrity.

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Pranavkharote/roxiler-fullstack-assignment.git
cd roxiler-fullstack-assignment

cd backend
npm install

## Add the .env value with your Database values

DB_HOST=localhost
DB_USER=postgres
DB_PASS=<Your DB password>
DB_NAME=<Name of your DB>
DB_PORT=<Port of your DB>
JWT_SECRET=12345

## Start the Backend Server
node src/server.js

## 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev


```


### Demo Credentails 
Admin: admin@test.com / admin123
Owner: owner@test.com / admin123
User : user@test.com  / admin123

### Deployment Status
✅ The project is fully functional locally with production-ready APIs.
Cloud deployment using Render + Neon PostgreSQL was attempted; the final release was avoided close to the deadline to prevent instability.

The application is ready for deployment anytime without architectural changes.

## Developed By:
Pranav Kharote
Aspiring Full Stack Developer
Focused on backend systems, databases, and scalable applications.
