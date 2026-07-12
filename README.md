# SafarStay

SafarStay is a full-stack holiday-stay booking platform built with React, Vite, Express, and MongoDB. It lets users browse listings, create and manage properties, book stays, and complete account verification through email OTPs.

## Live Demo

- Production frontend: https://safarstay.onrender.com
- Production API: https://safarstay.onrender.com/api

## What the app does

SafarStay provides a complete experience for property discovery and booking:

- User signup, login, logout, and email verification
- Property listing creation with image uploads
- Listing discovery, search, and detail views
- Booking creation and cancellation
- User profile flows for bookings and listings
- Ratings and review flow for completed stays

## Core features

- Secure authentication with JWT and cookie-based sessions
- OTP verification for new user accounts
- Cloudinary-backed image uploads for listings
- Booking and listing management for users
- Responsive UI built with React and Vite
- REST APIs for auth, listings, bookings, and users

## Tech stack

### Frontend
- React 19
- Vite
- React Router DOM
- React Toastify
- Leaflet + React Leaflet
- Tailwind CSS

### Backend
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT authentication
- Cloudinary for media storage
- Brevo email delivery for OTP emails

## Project structure

```text
SafarStayInReact/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   └── index.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── main.jsx
└── README.md
```

## Prerequisites

Make sure you have the following installed:

- Node.js 18+ recommended
- npm or yarn
- MongoDB Atlas or a local MongoDB instance

## Environment variables

Create a `.env` file inside the backend folder with the following values:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8080
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_app_password
```

> Do not commit secrets to version control. Keep your `.env` file local and private.

## Local development

### 1) Install backend dependencies

```bash
cd backend
npm install
```

### 2) Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 3) Start the backend

```bash
cd backend
npm start
```

The backend runs on port `8080` by default and exposes API routes under `/api`.

### 4) Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will usually run at:

```text
http://localhost:5173
```

## API overview

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`
- `POST /api/auth/request-verification`

### Listings
- `POST /api/listing/add`
- `GET /api/listing/get`
- `GET /api/listing/findlistingbyid/:id`
- `GET /api/listing/search`
- `PUT /api/listing/update/:id`
- `DELETE /api/listing/delete/:id`
- `PATCH /api/listing/rate/:id`

### Bookings
- `POST /api/booking/create/:id`
- `DELETE /api/booking/cancel/:id`

### Users
- `GET /api/user` and related user routes

## Production notes

This project is structured for deployment with a separate frontend and backend. The backend is currently configured to allow production CORS access for the deployed frontend domain, so if you change hosting providers or domains, update the CORS origin in the backend entry file accordingly.

## Deployment checklist

Before deploying to production, confirm the following:

- MongoDB connection string is valid and reachable
- Cloudinary credentials are set correctly
- JWT secret is strong and stored securely
- Email provider credentials are configured properly
- CORS settings match your deployed frontend domain

## Contributing

Contributions are welcome. If you want to improve the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a pull request with a clear description

## License

This project is available for personal and educational use. Update the license terms if you plan to distribute it commercially.

