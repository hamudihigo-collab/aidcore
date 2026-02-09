# AIDCORE - Quick Start in 5 Minutes

Get AIDCORE running locally in just 5 minutes!

## ⚡ 5-Minute Quickstart

### Prerequisites
- Node.js v16+
- PostgreSQL 12+ (must be running)
- Git

### Terminal 1: Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Setup database (run once)
npm run migrate

# 5. Start server
npm run dev
```

**Expected output:**
```
✓ AIDCORE Backend Server Started
✓ Port: 5000
✓ API URL: http://localhost:5000
```

### Terminal 2: Frontend Setup

```bash
# 1. Open new terminal, navigate to frontend
cd frontend

# 2. Install dependencies  
npm install

# 3. Copy .env (already configured)
cp .env.example .env

# 4. Start dev server
npm run dev
```

**Expected output:**
```
✓ Local: http://localhost:3000/
```

### Terminal 3: Test (Optional)

```bash
# Test API health
curl http://localhost:5000/health
```

---

## 🔐 Login

Open **http://localhost:3000** in your browser

**Default Credentials:**
- Email: `admin@aidcore.com`
- Password: `Admin@123`

⚠️ **Change password immediately in production!**

---

## 📋 What You Get

### Backend Features
✅ Express.js REST API  
✅ JWT Authentication  
✅ PostgreSQL Database  
✅ Case Management  
✅ Document Upload  
✅ Case Notes  
✅ Role-Based Access Control  

### Frontend Features
✅ React 18 Interface  
✅ Tailwind CSS Styling  
✅ Case Dashboard  
✅ Case Management UI  
✅ Document Management  
✅ Responsive Design  

---

## 🛠️ Common Commands

### Backend
```bash
npm run dev        # Start dev server
npm start          # Start production server
npm run migrate    # Create database tables
npm test           # Run tests
npm run lint       # Check code quality
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview prod build
```

---

## 🔗 API Endpoints

### Authentication
```
POST /api/auth/register      # Create account
POST /api/auth/login         # Login
GET  /api/auth/me            # Get profile
```

### Cases
```
GET    /api/cases            # List cases
POST   /api/cases            # Create case
GET    /api/cases/:id        # Get case
PUT    /api/cases/:id        # Update case
DELETE /api/cases/:id        # Delete case
```

### Documents
```
POST   /api/documents               # Upload file
GET    /api/documents/case/:caseId  # List documents
DELETE /api/documents/:id           # Delete file
```

### Notes
```
POST   /api/notes/:caseId    # Add note
GET    /api/notes/case/:id   # List notes
PUT    /api/notes/:id        # Update note
DELETE /api/notes/:id        # Delete note
```

---

## ❌ Troubleshooting

### Backend won't start
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Reset database
cd backend
npm run migrate
```

### Frontend won't load
```bash
# Reinstall dependencies  
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port already in use
```bash
# Kill process using port
# macOS/Linux:
lsof -i :5000  # Backend
lsof -i :3000  # Frontend
kill -9 <PID>

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📚 Full Documentation

- **[README.md](README.md)** - Complete overview
- **[DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)** - Detailed setup guide
- **[BACKEND_API.md](BACKEND_API.md)** - API documentation
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment

---

## 🎯 Next Steps

1. ✅ Explore the dashboard
2. ✅ Create a test case
3. ✅ Upload a document
4. ✅ Add case notes
5. ✅ Review API endpoints
6. ✅ Check out the code structure

---

## 🚀 Deployment

When ready for production:

```bash
# Backend: Deploy to Heroku, AWS, or similar
# Frontend: Deploy to Vercel, Netlify, or similar
# Database: Use managed PostgreSQL (AWS RDS, Heroku, etc.)

# See DEPLOYMENT.md for detailed instructions
```

---

## 💡 Features to Explore

### Case Management
- Create, read, update, delete cases
- Filter by status and priority
- View case statistics

### Documents
- Upload files to cases
- Organize by document type
- Track upload history

### Notes
- Add private/public notes
- Track case progress
- Collaborate with team

### User Management
- Register new users
- Different roles (admin, manager, viewer)
- Profile management

---

## 🤔 Questions?

Check the documentation files in the root directory or the README.

---

**Happy Coding! 🎉**

Version: 1.0.0 | Last Updated: 2026-02-09
