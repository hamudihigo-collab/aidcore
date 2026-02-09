# AIDCORE Development Setup Guide

Complete guide to set up AIDCORE locally for development.

## Prerequisites

Make sure you have installed:
- **Node.js**: v16+ ([download](https://nodejs.org/))
- **npm**: v8+ (comes with Node.js)
- **PostgreSQL**: 12+ ([download](https://www.postgresql.org/download/))
- **Git**: ([download](https://git-scm.com/))
- **VS Code**: ([download](https://code.visualstudio.com/)) (recommended)

### Verify Installation

```bash
node --version      # Should be v16+
npm --version       # Should be v8+
psql --version      # Should be PostgreSQL 12+
git --version       # Any recent version
```

---

## Step 1: Clone Repository

```bash
git clone https://github.com/your-org/Refugee-System.git
cd Refugee-System/Aidcore
```

---

## Step 2: Database Setup

### Create PostgreSQL Database

1. **Open PostgreSQL**
   ```bash
   psql -U postgres
   ```

2. **Create database and user**
   ```sql
   CREATE DATABASE aidcore_db;
   CREATE USER aidcore_user WITH PASSWORD 'dev_password';
   GRANT ALL PRIVILEGES ON DATABASE aidcore_db TO aidcore_user;
   \q  -- Exit psql
   ```

3. **Verify connection**
   ```bash
   psql -h localhost -U aidcore_user -d aidcore_db
   ```

---

## Step 3: Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment

1. **Copy example env file**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** with your local setup:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=aidcore_db
   DB_USER=aidcore_user
   DB_PASSWORD=dev_password
   
   # Server
   PORT=5000
   NODE_ENV=development
   API_URL=http://localhost:5000
   
   # JWT (Use test secrets for development)
   JWT_SECRET=dev_secret_key_change_in_production
   JWT_REFRESH_SECRET=dev_refresh_secret
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   
   # Frontend
   FRONTEND_URL=http://localhost:3000
   
   # Logging
   LOG_LEVEL=debug
   ```

### Run Database Migrations

```bash
npm run migrate
```

This creates all tables and seeds the admin user.

### Start Backend Server

```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║  🚀 AIDCORE Backend Server Started  🚀 ║
║  Port: 5000                          ║
║  Environment: development             ║
║  API URL: http://localhost:5000      ║
╚════════════════════════════════════════╝
```

### Test Backend

```bash
# In a new terminal, test the health endpoint
curl http://localhost:5000/health

# Expected response:
# {"status":"ok","message":"AIDCORE API is running","timestamp":"2026-02-09T..."}
```

---

## Step 4: Frontend Setup

### Open New Terminal

Keep backend running in current terminal, open a new one.

### Install Dependencies

```bash
cd frontend
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

`.env` should already have correct defaults:
```env
VITE_API_URL=http://localhost:5000/api
```

### Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Press h to show help
```

### Access Application

Open browser: **http://localhost:3000**

---

## Step 5: Login with Default Admin Account

1. Go to http://localhost:3000/login
2. Use credentials:
   - **Email**: `admin@aidcore.com`
   - **Password**: `Admin@123`

3. **⚠️ IMPORTANT**: Change password immediately!

---

## Development Workflow

### Both Servers Running (Recommended)

Keep both terminals open side-by-side:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Hot Reload

Both servers support hot reload:
- **Backend**: Changes in `src/` auto-restart (via nodemon)
- **Frontend**: Changes in `src/` auto-refresh in browser (via Vite)

---

## Common Development Tasks

### Add New NPM Package

**Backend:**
```bash
cd backend
npm install package-name
```

**Frontend:**
```bash
cd frontend
npm install package-name
```

### Run Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Lint Code

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

### Create Database Backup

```bash
pg_dump -U aidcore_user aidcore_db > backup.sql
```

### Restore Database from Backup

```bash
psql -U aidcore_user aidcore_db < backup.sql
```

### Reset Database

```bash
# Drop and recreate
dropdb -U aidcore_user aidcore_db
createdb -U aidcore_user aidcore_db

# Run migrations again
cd backend
npm run migrate
```

---

## VS Code Extensions (Optional but Recommended)

- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **Thunder Client** or **REST Client** - for API testing
- **PostgreSQL** - ckolkman.vscode-postgres
- **Git Graph** - mhutchie.git-graph

---

## Debugging

### Backend Debugging

1. **Add debugger statement**
   ```javascript
   console.log('Debug info:', variable);
   ```

2. **Check logs in terminal** where backend is running

3. **Enable debug mode** (already enabled in development)

### Frontend Debugging

1. **Use React DevTools**
   - Install Chrome extension: "React Developer Tools"
   - Inspect components in DevTools

2. **Use Browser DevTools**
   - Open: F12 or Ctrl+Shift+I
   - Console tab for errors
   - Network tab for API calls

3. **Add console logs**
   ```javascript
   console.log('State:', state);
   ```

---

## Troubleshooting

### Backend Won't Start

**Error: "connect ECONNREFUSED 127.0.0.1:5432"**

Solution: PostgreSQL not running
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows
Start PostgreSQL service from Services
```

**Error: "database aidcore_db does not exist"**

Solution: Run migrations
```bash
cd backend
npm run migrate
```

### Frontend Won't Start

**Error: "Module not found"**

Solution: Reinstall dependencies
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 3000 already in use"**

Solution: Kill process or use different port
```bash
# List processes on port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in vite.config.js
```

### Cannot Connect to Backend

**Error: "Failed to fetch from http://localhost:5000"**

Solution: Check backend is running
```bash
curl http://localhost:5000/health
```

If curl fails, backend isn't running. Check Terminal 1.

### Database Connection Issues

**Error: "role aidcore_user does not exist"**

Solution: Create user
```bash
psql -U postgres
CREATE USER aidcore_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE aidcore_db TO aidcore_user;
```

---

## Project Structure Quick Reference

```
.
├── backend/
│   ├── src/
│   │   ├── config/          ← Database & constants
│   │   ├── controllers/     ← Business logic
│   │   ├── models/          ← Database queries
│   │   ├── routes/          ← API endpoints
│   │   ├── middleware/      ← Auth, errors, CORS
│   │   ├── utils/           ← Helpers
│   │   ├── migrations/      ← DB schema
│   │   └── server.js        ← Entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── components/      ← Reusable UI parts
    │   ├── pages/           ← Full page components
    │   ├── services/        ← API calls
    │   ├── hooks/           ← React hooks
    │   ├── utils/           ← Helper functions
    │   ├── styles/          ← CSS
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── package.json
    ├── .env.example
    └── .gitignore
```

---

## Next Steps

1. ✅ Backend running on port 5000
2. ✅ Frontend running on port 3000
3. ✅ Logged in with admin account
4. Ready to start developing!

---

## Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io/)

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-09
