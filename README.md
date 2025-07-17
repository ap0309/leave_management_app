# Leave Management System

A web-based Leave Management System for Brainybeam, built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [File Explanations](#file-explanations)
- [How the System Works](#how-the-system-works)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This project is a Leave Management System for an organization (Brainybeam), built with a React frontend and a Node.js/Express/MongoDB backend. It allows employees to apply for leave and admins to manage and approve/reject leave requests. The system features authentication, role-based dashboards, and leave tracking.

---

## Features

- Employee and Admin roles
- Secure login with brainybeam.com email
- Employees can submit and track leave applications
- Admins can view, approve, or reject leave requests
- Leave statistics and dashboards
- Responsive UI with Tailwind CSS

---

## Project Structure

```
project/
  backend/
    index.js
    package.json
  index.html
  package-lock.json
  package.json
  postcss.config.js
  src/
    App.jsx
    components/
      LeaveCard.jsx
      LeaveForm.jsx
      LeaveList.jsx
      Navbar.jsx
    context/
      AuthContext.jsx
    index.css
    main.tsx
    pages/
      AdminDashboard.jsx
      EmployeeDashboard.jsx
      Login.jsx
    utils/
      validateEmail.js
    vite-env.d.ts
  tailwind.config.js
  tsconfig.app.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
```

---

## File Explanations

| File/Folder                      | Purpose/Description                               |
| -------------------------------- | ------------------------------------------------- |
| index.html                       | Main HTML entry point                             |
| package.json                     | Frontend dependencies and scripts                 |
| package-lock.json                | Dependency version lock                           |
| postcss.config.js                | PostCSS configuration                             |
| tailwind.config.js               | Tailwind CSS configuration                        |
| tsconfig\*.json                  | TypeScript configuration files                    |
| vite.config.ts                   | Vite build tool configuration                     |
| /backend/index.js                | Backend server, API, and database logic           |
| /backend/package.json            | Backend dependencies and scripts                  |
| /src/main.tsx                    | React app entry point                             |
| /src/index.css                   | Global CSS (Tailwind)                             |
| /src/App.jsx                     | Main React app, routing, and context setup        |
| /src/context/AuthContext.jsx     | Authentication context and logic                  |
| /src/utils/validateEmail.js      | Email validation utility                          |
| /src/components/Navbar.jsx       | Navigation bar component                          |
| /src/components/LeaveForm.jsx    | Leave application form component                  |
| /src/components/LeaveList.jsx    | Leave applications list component                 |
| /src/components/LeaveCard.jsx    | Individual leave card display (used in LeaveList) |
| /src/pages/Login.jsx             | Login page                                        |
| /src/pages/AdminDashboard.jsx    | Admin dashboard page                              |
| /src/pages/EmployeeDashboard.jsx | Employee dashboard page                           |
| /src/vite-env.d.ts               | Vite/TypeScript environment declarations          |

---

## How the System Works

1. User visits the app and logs in with their brainybeam.com email.
2. Authentication context checks credentials and sets user role (admin or employee).
3. Routing directs user to the correct dashboard.
4. Employees can submit leave requests and view their status/history.
5. Admins can view all leave requests, approve/reject them, and see statistics.
6. Backend stores and manages leave data in MongoDB, serving data via REST API.

---

## Setup & Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install frontend dependencies:**

   ```sh
   npm install
   ```

3. **Install backend dependencies:**

   ```sh
   cd backend
   npm install
   cd ..
   ```

4. **Start the backend server:**

   ```sh
   cd backend
   npm run dev
   ```

5. **Start the frontend development server:**
   ```sh
   npm run dev
   ```

---

## Usage

- Visit `http://localhost:5173` (or the port shown in your terminal).
- Login as an employee or admin using the credentials in `AuthContext.jsx`.
- Employees can submit and track leave applications.
- Admins can view, approve, or reject leave requests.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---
