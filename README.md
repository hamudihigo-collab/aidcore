# AIDCORE Case Management System

A professional, production-ready case management system built with **Node.js/Express**, **React/Tailwind**, **PostgreSQL**, and **JWT Authentication**.

## 🎯 Features

### Backend
- ✅ RESTful API with Express.js
- ✅ JWT-based authentication (Access & Refresh tokens)
- ✅ PostgreSQL database with modular models
- ✅ Role-based access control (ADMIN, CASE_MANAGER, REVIEWER, VIEWER)
- ✅ Comprehensive error handling & logging
- ✅ CORS & Security middleware (Helmet)
- ✅ Request validation
- ✅ Database migrations & seeding

### Frontend
- ✅ React 18 with modern hooks
- ✅ Tailwind CSS for styling
- ✅ Zustand for state management
- ✅ Vite for fast development
- ✅ Protected routes
- ✅ Responsive design
- ✅ Modular component architecture

### Entities
- **Users**: Authentication, role management
- **Cases**: Create, read, update, delete cases with status and priority
- **Documents**: Upload and manage case documents
- **Case Notes**: Add private/public notes to cases

## 📐 Project Structure

```
aidcore/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & constants configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, error handling, CORS
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helpers (JWT, password, response formatting)
│   │   ├── migrations/      # Database schema & seeding
│   │   └── server.js        # Express app entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Helper functions
│   │   ├── styles/          # CSS & Tailwind
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # React entry point
│   ├── public/              # Static assets
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm 8+
- PostgreSQL 12+ (running locally)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=aidcore_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key_change_in_production
   ```

4. **Create PostgreSQL database**
   ```bash
   createdb aidcore_db
   ```

5. **Run migrations**
   ```bash
   npm run migrate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}

Response: 201 Created
{
  "status": "success",
  "data": {
    "user": { "id", "email", "firstName", "lastName", "role" },
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": false
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {accessToken}
```

### Case Endpoints

#### Create Case
```http
POST /api/cases
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "clientId": 1,
  "title": "Case Title",
  "description": "Case description",
  "priority": "high",
  "tags": ["tag1", "tag2"]
}
```

#### Get Cases (Paginated)
```http
GET /api/cases?page=1&pageSize=10&status=open&priority=high&search=query
Authorization: Bearer {accessToken}
```

#### Get Case by ID
```http
GET /api/cases/{id}
Authorization: Bearer {accessToken}
```

#### Update Case
```http
PUT /api/cases/{id}
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "in_progress",
  "priority": "urgent"
}
```

#### Delete Case
```http
DELETE /api/cases/{id}
Authorization: Bearer {accessToken}
```

#### Get Case Statistics
```http
GET /api/cases/stats/summary
Authorization: Bearer {accessToken}
```

### Document Endpoints

#### Upload Document
```http
POST /api/documents
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

FormData {
  caseId: 1,
  file: <file>,
  documentType: "id",
  description: "Document description"
}
```

#### Get Documents by Case
```http
GET /api/documents/case/{caseId}?page=1&pageSize=20
Authorization: Bearer {accessToken}
```

#### Update Document
```http
PUT /api/documents/{id}
Authorization: Bearer {accessToken}

{
  "documentType": "passport",
  "description": "Updated description"
}
```

#### Delete Document
```http
DELETE /api/documents/{id}
Authorization: Bearer {accessToken}
```

### Case Notes Endpoints

#### Create Note
```http
POST /api/notes
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "caseId": 1,
  "title": "Note Title",
  "content": "Note content",
  "isPrivate": false
}
```

#### Get Notes by Case
```http
GET /api/notes/case/{caseId}?page=1&pageSize=20
Authorization: Bearer {accessToken}
```

#### Update Note
```http
PUT /api/notes/{id}
Authorization: Bearer {accessToken}

{
  "title": "Updated Title",
  "content": "Updated content",
  "isPrivate": false
}
```

## 🔐 Authentication Flow

1. **Registration/Login**: User receives `accessToken` (7 days) and `refreshToken` (30 days)
2. **API Requests**: Include token in `Authorization: Bearer {token}` header
3. **Token Validation**: Middleware validates JWT signature and expiration
4. **Protected Routes**: Only authenticated users can access protected resources
5. **Role-Based Access**: Some endpoints require specific roles (admin, case_manager)

## 🗄️ Database Schema

### Users Table
- `id` (PK): Serial
- `email`: Unique email address
- `password`: Bcrypt hashed password
- `first_name`, `last_name`: User name
- `phone`: Contact number
- `role`: admin/case_manager/reviewer/viewer
- `is_active`: Boolean
- `is_deleted`: Soft delete flag

### Cases Table
- `id` (PK): Serial
- `case_number`: Unique case identifier
- `client_id`: Foreign key to users
- `case_manager_id`: Assigned manager (FK)
- `status`: open/in_progress/on_hold/closed/resolved
- `priority`: low/medium/high/urgent
- `title`, `description`: Case info
- `tags`: JSON array
- Timestamps

### Documents Table
- `id` (PK): Serial
- `case_id` (FK): Associated case
- `document_type`: Type categorization
- `file_name`, `file_url`: File info
- `file_size`: Size in bytes
- `uploaded_by` (FK): User who uploaded
- `description`: Notes
- Timestamps

### Case Notes Table
- `id` (PK): Serial
- `case_id` (FK): Associated case
- `user_id` (FK): Note author
- `title`, `content`: Note info
- `is_private`: Boolean
- Timestamps

## 🔒 Security Features

- **Password Hashing**: Bcrypt with 10 salt rounds
- **JWT Tokens**: Signed with secret key
- **CORS**: Restricted to frontend origin
- **Helmet**: HTTP security headers
- **Input Validation**: Via express-validator
- **SQL Injection**: Protected via parameterized queries
- **Error Handling**: Generic error messages in production

## 🛠️ Development

### Backend Commands
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
npm test             # Run tests
npm run lint         # Run ESLint
```

### Frontend Commands
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 📦 Deployment

### Backend Deployment (Heroku/Cloud)

1. **Prepare for production**
   ```bash
   npm install
   ```

2. **Set environment variables**
   ```bash
   DATABASE_URL=postgresql://user:pass@host/db
   JWT_SECRET=production_secret_key
   NODE_ENV=production
   ```

3. **Start server**
   ```bash
   npm start
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Build**
   ```bash
   npm run build
   ```

2. **Deploy `dist` folder**
   - Vercel: Connect GitHub repo
   - Netlify: Drag & drop `dist` folder

## 🚨 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aidcore_db
DB_USER=postgres
DB_PASSWORD=password
DB_POOL_MIN=2
DB_POOL_MAX=10

# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000

# JWT
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 Default Admin Credentials

After running migrations:
- **Email**: admin@aidcore.com
- **Password**: Admin@123 (Change this immediately!)

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Commit with clear messages
4. Submit pull request

## 📄 License

MIT License - See LICENSE file

## 🆘 Support

For issues or questions:
1. Check existing documentation
2. Create an issue in the repository
3. Contact development team

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-09  
**Status**: Production Ready
