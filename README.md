# Auth Project

This project is a full-stack authentication application built with a Node.js/Express backend and a React + Vite frontend. It supports user registration, login, session-based authentication, profile retrieval, and logout.

## Overview

The app uses:
- Express.js for REST API routing
- MongoDB with Mongoose for data storage
- bcrypt for password hashing
- express-session and connect-mongo for session management
- React for the frontend UI
- Vite as the frontend dev server

## Project Structure

```text
auth-project/
├── .env                   # Environment variables
├── .gitignore
├── server.js              # Express server entry point
├── package.json          # Backend dependencies and scripts
├── models/
│   └── User.js           # Mongoose user schema
├── routes/
│   └── authRoutes.js     # Register, login, profile, logout routes
├── middleware/
│   └── authMiddleware.js # Protects authenticated routes
├── config/               # Configuration files
├── client/               # React frontend
│   ├── package.json
│   ├── src/
│   └── vite.config.js
├── node_modules/
└── package-lock.json
```

## Main Features

- User registration with required username, email, and password validation
- Password hashing before saving to MongoDB
- Unique username and email validation
- Login using email and password
- Session-based authentication with a secure cookie
- Protected profile route for authenticated users
- Logout flow that destroys the session and clears the session cookie

## Backend API

Base URL: `http://localhost:5000/api/auth`

### Endpoints

- `POST /register`
  - Registers a new user
  - Validates username, email, and password
  - Prevents duplicate username/email entries

- `POST /login`
  - Authenticates a user by email and password
  - Creates a session on successful login

- `GET /profile`
  - Returns the current authenticated user's data
  - Requires a valid session

- `POST /logout`
  - Destroys the session and logs the user out

## User Model

The `User` model includes:
- `username`: required, unique, trimmed string
- `email`: required, unique, lowercase, trimmed string
- `password`: required hashed password
- automatic created/updated timestamps via Mongoose

## Environment Setup

Create a `.env` file in the project root with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/authDB
SESSION_SECRET=your_session_secret
```

Notes:
- Replace the MongoDB URI with your own database connection string.
- Use a long, random value for `SESSION_SECRET` in production.

## Installation

From the project root:

```bash
npm install
```

From the `client` folder:

```bash
cd client
npm install
```

## Running the Project

Start the backend server:

```bash
npm run dev
```

Start the frontend:

```bash
cd client
npm run dev
```

The app is expected to run locally with:
- backend: `http://localhost:5000`
- frontend: `http://localhost:5173`

## Notes

- The backend is configured to accept requests from `http://localhost:5173`.
- Session cookies are stored in MongoDB using `connect-mongo`.
- This is a simple authentication app intended for learning and local development.

## Conclusion

This project demonstrates a complete authentication flow using Express, MongoDB, and React. It is a good starting point for building more advanced login systems with features like password reset, email verification, role-based access control, and JWT-based authentication.
