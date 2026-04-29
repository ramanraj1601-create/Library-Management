# Raman Library Management System

A full-stack library management application built with React, Vite, Express, MongoDB, and Cloudinary. The app supports student book requests, librarian approvals, admin/librarian management, JWT authentication, password reset OTPs, and issue/return tracking.

## Features

- Student registration and login with JWT authentication
- Role-based access for users, librarians, and admins
- Book browsing, search, category filtering, and book details
- Book issue requests and return requests
- Librarian approval flow for issue and return requests
- Admin/librarian book management with Cloudinary cover uploads
- User profile with issued books, pending requests, due dates, and fines
- Password reset flow with email OTP
- Responsive React UI with route-based layouts

## Tech Stack

**Frontend**
- React 19
- Vite
- React Router
- Axios
- React Hook Form
- React Toastify
- Framer Motion
- React Icons
- Bootstrap

**Backend**
- Node.js
- Express
- MongoDB with Mongoose
- JWT
- bcryptjs
- Multer and Cloudinary
- Nodemailer

## Project Structure

```txt
Library-Management/
  backend/
    controller/
    middlewares/
    model/
    routes/
    schemas/
    utils/
    index.js
    package.json
  frontend/
    public/
    src/
      components/
      layout/
      pages/
      utils/
    package.json
    vite.config.js
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB Atlas connection string or local MongoDB URI
- Cloudinary account for book cover uploads
- Gmail app password or SMTP credentials for OTP email

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL=your_email@gmail.com

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.vercel.app
```

Create `frontend/.env` for local development:

```env
VITE_BACKEND_URL=http://localhost:5000
```

For production, set `VITE_BACKEND_URL` in your frontend hosting dashboard to your deployed backend API URL.

## Local Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Available Scripts

Backend:

```bash
npm start      # run production server with node
npm run dev    # run development server with nodemon
```

Frontend:

```bash
npm run dev      # start Vite dev server
npm run build    # create production build
npm run preview  # preview production build locally
npm run lint     # run ESLint
```

## Deployment Notes

Frontend on Vercel:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_BACKEND_URL=https://your-backend-api-url`

Backend on Render/Railway/Node hosting:

- Root directory: `backend`
- Start command: `npm start`
- Environment variables: all values from `backend/.env`
- Add your frontend domain to `CORS_ORIGINS`

Important: do not use the frontend Vercel URL as `VITE_BACKEND_URL` unless your API is actually deployed there. It must point to the Express backend.

## Git Ignore Policy

The repository ignores:

- `node_modules/` in root, frontend, and backend
- `.env` files
- frontend `dist/`
- logs, caches, coverage, and editor files

Keep real secrets out of Git. Commit only example env files such as `.env.example`.

## Production Checklist

- Backend `MONGO_URI` is valid
- Backend `JWT_SECRET` is set to a strong secret
- Backend Cloudinary credentials are set
- Backend email credentials are set
- Frontend `VITE_BACKEND_URL` points to the backend API
- Backend `CORS_ORIGINS` includes the frontend production domain
- `npm run build` passes in `frontend`
- `npm run lint` passes in `frontend`
