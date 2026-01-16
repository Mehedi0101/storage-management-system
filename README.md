# Storage Management System – Server

This is the backend of the **Storage Management System** built with **Node.js**, **Express.js**, and **MongoDB**, following a modular architecture and secure authentication practices.

---


## Features

- User authentication (Register, Login, Forgot Password, Reset Password)
- JWT-based authentication (HTTP-only cookies supported)
- Secure file upload system (images & PDFs)
- User-specific storage management
- Favorite files toggle
- Filter files by upload date
- Recent uploads (last 5 files)
- Dashboard overview statistics
- User profile update, password change, and account deletion
- Proper error handling and validation
- Modular and maintainable code structure


---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT authentication
- bcrypt (password hashing)
- multer (file uploads)
- zod (request validation)
- dotenv


---

## Installation

### 1. Clone the repository:

```
git clone https://github.com/Mehedi0101/storage-management-system.git
cd storage-management-system
```

### 2. Install dependencies:

```
npm install

```

### 3. Create a .env file in the root directory:

```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=1d
```

### 4. Run the development server:

```
npm run dev

```

The server should now be running on http://localhost:5000

---

## Scripts

- ```npm run dev``` – Run server in development with nodemon
- ```npm start``` – Run the compiled JavaScript files

---

## Folder Structure
```
src/
├─ config/             # configurations
├─ controllers/        # Business logic
├─ middlewares/        # Auth, upload, error handling
├─ models/             # Mongoose schemas
├─ routes/             # Express route definitions
├─ utils/              # Helper utilities
├─ validations/        # validation functions
├─ uploads/            # Uploaded files (local storage)
├─ app.js              # Express app configuration
└─ server.js           # Server entry point

```

---

## API Endpoints

### Auth Routes

- ```POST api/auth/register``` – Register new user

- ```POST api/auth/login``` – User login

- ```POST api/auth/forgot-password``` – To start the account recovery process if password is forgotten

- ```POST api/auth/verify-code``` – For verifying the OTP

- ```POST api/auth/reset-password``` – To reset the password

- ```POST api/auth/logout``` – User logout


### User Routes

- ```GET /api/users/me``` – Get current user

- ```PATCH /api/users/update``` – Update user profile

- ```PATCH /api/users/change-password``` – Change password

- ```DELETE /api/users/delete``` – Delete user account


### File Routes

- ```POST /api/files/upload``` – Upload file

- ```GET /api/files/recent``` – Get last 5 uploaded files

- ```GET /api/files/images``` – Get all uploaded images

- ```GET /api/files/pdfs``` – Get all uploaded PDFs

- ```GET /api/files/by-date?date=YYYY-MM-DD``` – Get files by date

- ```GET /api/files/:id``` – Get a specific file

- ```PATCH /api/files/:fileId/favorite``` – Toggle favorite

- ```DELETE /api/files/:fileId``` – Delete file (DB + disk)


### Dashboard Routes

- ```GET api/dashboard/overview``` – Storage and file statistics
