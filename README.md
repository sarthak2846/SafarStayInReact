# SafarStay

> Full-stack booking and listing application (React + Express + MongoDB).

## Overview

SafarStay is a holiday-stay listing and booking platform with a React + Vite frontend and an Express/MongoDB backend. The backend handles authentication, listings, bookings, image uploads (Cloudinary), and email notifications (Gmail/Nodemailer).

## Features

- User authentication (signup, login, verify)
- Create, view, and manage listings with image upload
- Book listings and view bookings
- Email notifications via Gmail
- Location geocoding using OpenStreetMap Nominatim

## Repository Structure

- `backend/` — Express server, routes, controllers, models, config
- `frontend/` — React app (Vite)

## Tech Stack

- Frontend: React, Vite, Tailwind (optional), React Router
- Backend: Node.js, Express, MongoDB (Mongoose)
- Image uploads: Cloudinary
- Email: Brevo API Key

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (Atlas or local)

## Environment Variables

Create a `.env` file in the `backend/` folder with the following variables:

- `MONGODB_URI` — MongoDB connection string
- `PORT` — (optional) server port (default 8080)
- `JWT_SECRET` — secret used to sign JWT tokens
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `EMAIL_USER` — Gmail address used to send emails
- `EMAIL_PASS` — App password for the Gmail account

Example `backend/.env` (do NOT commit secrets):

MONGODB_URI="your_mongo_connection_string"
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
EMAIL_USER="your@gmail.com"
EMAIL_PASS="your_app_password"
PORT=8080

## Quick Start

1. Backend

```bash
cd backend
npm install
# create .env with variables listed above
npm start
```

The backend listens on `PORT` (defaults to `8080`) and exposes API routes under `/api` (for example: `/api/auth`, `/api/listing`, `/api/booking`, `/api/user`). The server's CORS is configured to allow `http://localhost:5173` by default.

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on Vite's default port (usually `5173`) and expects the backend to be available at the configured API base URL. If you need to change the backend base URL, update the API calls in `frontend/src` (typically where `axios` is configured).

## Running Locally (combined)

- Start the backend (see above)
- Start the frontend (see above)
- Open `http://localhost:5173` in your browser

## Notes & Troubleshooting

- Cloudinary: ensure your Cloudinary credentials are correct and the `folder` in `backend/config/cloudinary.js` is writable.
- Gmail: Google often requires an App Password or enabling less-secure access; prefer App Passwords for production use.
- Geocoding: the backend uses OpenStreetMap Nominatim for coordinates (no API key needed) — be mindful of rate limits.
- If `nodemon` is not installed globally, install it or update `backend/package.json` scripts to use `node` instead.

## API Endpoints (overview)

- `POST /api/auth` — signup/login/verify routes (see `backend/routes/auth.routes.js`)
- `GET/POST /api/listing` — create and fetch listings
- `POST /api/booking` — create bookings
- `GET /api/user` — user-related actions

Refer to the route files in `backend/routes/` for full details and payload shapes.

## Contributing

- Fork the repo, create a feature branch, and open a PR with a clear description.

## License

MIT — modify as appropriate for your project.

## Contact

If you want help running or extending this project, open an issue or contact the maintainer.
