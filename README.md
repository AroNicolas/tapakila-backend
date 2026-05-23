# Tapakila Backend

A TypeScript-based Express backend for the Tapakila project, providing robust API services with authentication, database management, and cloud storage integration.

## 📋 Overview

This is the backend service for the Tapakila project. It handles user authentication, data persistence, and file uploads with a clean, scalable architecture built with modern TypeScript and Node.js technologies.

**Frontend Repository:** [Tapakila-pegaSUS-front](https://github.com/JenniferTantely/Tapakila-pegaSUS-front) <br/>
**Frontend admin Repository:** [tapakila-admin-front](https://github.com/Najaaina/tapakila-admin-front)


## 🚀 Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with TypeORM
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary
- **Security:** bcrypt for password hashing, CORS for cross-origin requests
- **File Upload:** Multer with Cloudinary storage

## 🔧 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AroNicolas/tapakila-backend.git
   cd tapakila-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=tapakila

   # JWT
   JWT_SECRET=your_jwt_secret_key

   # Cloudinary
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Server
   PORT=3000
   NODE_ENV=development
   ```

### Running the Application

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` by default.

## 📝 Available Scripts

- `npm run dev` - Start development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production build

## 🏗️ Project Structure

```
src/
├── index.ts          # Application entry point
├── controllers/      # Route controllers
├── services/         # Business logic
├── entities/         # TypeORM entities
├── middleware/       # Express middleware
├── routes/           # API routes
└── config/           # Configuration files
```

## 🔐 Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based authentication
- **CORS Protection:** Configurable cross-origin requests
- **Environment Variables:** Sensitive data management with dotenv

## 📤 File Upload

File uploads are handled through Multer and stored in Cloudinary for scalability and CDN distribution.

## 👥 Team

- Backend: [AroNicolas](https://github.com/AroNicolas)
- Frontend: [JenniferTantely](https://github.com/JenniferTantely)
- Frontend admin: [Najaina](https://github.com/Najaaina)

---

