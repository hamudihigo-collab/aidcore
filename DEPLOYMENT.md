# AIDCORE Deployment Guide

Production-ready deployment guide for the AIDCORE case management system.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [Security Hardening](#security-hardening)
7. [Monitoring & Logging](#monitoring--logging)
8. [Docker Deployment](#docker-deployment)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console.log statements in production code
- [ ] No hardcoded credentials
- [ ] Code linting passing (npm run lint)
- [ ] No unused dependencies

### Security
- [ ] JWT secrets changed from defaults
- [ ] CORS origin configured for production domain
- [ ] HTTPS enabled
- [ ] Database password is strong
- [ ] No sensitive data in version control

### Performance
- [ ] Frontend optimized for production
- [ ] Database queries indexed
- [ ] Caching strategy implemented
- [ ] Database connection pooling configured

### Documentation
- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Deployment steps documented
- [ ] Rollback plan documented

---

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create app**
   ```bash
   cd backend
   heroku create aidcore-backend
   ```

3. **Add PostgreSQL addon**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_production_secret_key_here
   heroku config:set JWT_REFRESH_SECRET=your_production_refresh_secret
   heroku config:set FRONTEND_URL=https://aidcore.vercel.app
   ```

5. **Update package.json** (add start script if not present)
   ```json
   "scripts": {
     "start": "node src/server.js"
   }
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

7. **Run migrations**
   ```bash
   heroku run npm run migrate
   ```

### Option 2: AWS (EC2)

1. **Launch EC2 instance**
   - Ubuntu 22.04 LTS
   - t2.micro or larger
   - Security group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 5000 (API)

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js**
   ```bash
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PostgreSQL**
   ```bash
   sudo apt-get install -y postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

5. **Clone repository**
   ```bash
   git clone your-repo-url
   cd Refugee-System/Aidcore/backend
   npm install
   ```

6. **Configure environment**
   ```bash
   cp .env.example .env
   nano .env  # Edit with production values
   ```

7. **Run migrations**
   ```bash
   npm run migrate
   ```

8. **Setup PM2** (process manager)
   ```bash
   sudo npm install -g pm2
   pm2 start src/server.js --name "aidcore-api"
   pm2 startup
   pm2 save
   ```

9. **Setup Nginx** (reverse proxy)
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add configuration:
   ```nginx
   server {
       listen 80 default_server;
       server_name api.aidcore.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. **Setup SSL with Let's Encrypt**
    ```bash
    sudo apt-get install certbot python3-certbot-nginx
    sudo certbot --nginx -d api.aidcore.com
    ```

11. **Restart Nginx**
    ```bash
    sudo systemctl restart nginx
    ```

### Option 3: DigitalOcean App Platform

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect repository to DigitalOcean**
   - Go to DigitalOcean Apps
   - Create new app
   - Select GitHub repository
   - Configure environment variables

3. **Set build command**
   ```
   npm install
   ```

4. **Set run command**
   ```
   npm start
   ```

5. **Add PostgreSQL database** (managed service)

6. **Deploy**

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "Import Project"
   - Select GitHub repository
   - Select `frontend` directory as root

3. **Set environment variables**
   ```
   VITE_API_URL=https://api.aidcore.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Auto-deploys on push to main

### Option 2: Netlify

1. **Build locally**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify**
   - Drag & drop `dist` folder to Netlify
   - Or connect GitHub for auto-deploy

3. **Configure build settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Set environment variables**
   ```
   VITE_API_URL=https://api.aidcore.com/api
   ```

### Option 3: AWS S3 + CloudFront

1. **Build app**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 bucket**
   ```bash
   aws s3 mb s3://aidcore-web
   ```

3. **Upload build**
   ```bash
   aws s3 sync dist/ s3://aidcore-web/
   ```

4. **Setup CloudFront distribution**
   - Origin: S3 bucket
   - Distribution domain: `cdn.aidcore.com`

5. **Update DNS** to point to CloudFront

---

## Database Setup

### PostgreSQL Production Instance

#### AWS RDS

1. **Create RDS instance**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier aidcore-db \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --allocated-storage 20 \
     --master-username postgres \
     --master-user-password your_strong_password
   ```

2. **Configure security group** to allow backend access

3. **Get endpoint** and update `.env`:
   ```env
   DB_HOST=aidcore-db.c9x7x8x7x.us-east-1.rds.amazonaws.com
   DB_PORT=5432
   DB_NAME=aidcore_db
   DB_USER=postgres
   DB_PASSWORD=your_strong_password
   ```

### Self-Hosted PostgreSQL

1. **Install PostgreSQL**
   ```bash
   sudo apt-get install postgresql postgresql-contrib
   ```

2. **Create database and user**
   ```bash
   sudo -u postgres createdb aidcore_db
   sudo -u postgres createuser aidcore_user
   sudo -u postgres psql
   ```

   ```sql
   ALTER USER aidcore_user WITH PASSWORD 'strong_password';
   GRANT ALL PRIVILEGES ON DATABASE aidcore_db TO aidcore_user;
   ```

3. **Enable backups**
   ```bash
   pg_dump -U postgres aidcore_db > backup.sql
   ```

---

## Environment Configuration

### Production .env (Backend)

```env
# Database
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=aidcore_db
DB_USER=postgres
DB_PASSWORD=your_strong_password_here
DB_POOL_MIN=5
DB_POOL_MAX=20

# Server
PORT=5000
NODE_ENV=production
API_URL=https://api.aidcore.com

# JWT - Use strong, unique secrets
JWT_SECRET=use-a-long-random-string-here-at-least-32-characters-long
JWT_REFRESH_SECRET=another-unique-string-here-at-least-32-characters-long
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# CORS
FRONTEND_URL=https://aidcore.vercel.app

# Logging
LOG_LEVEL=info
```

### Production .env (Frontend)

```env
VITE_API_URL=https://api.aidcore.com/api
```

---

## Security Hardening

### Backend Security

1. **Update dependencies**
   ```bash
   npm audit fix
   npm update
   ```

2. **Add rate limiting**
   ```bash
   npm install express-rate-limit
   ```

3. **Add database encryption**
   - Enable SSL for database connections
   - Enable encryption at rest (RDS)

4. **Setup HTTPS**
   - Use SSL certificate (Let's Encrypt)
   - Redirect HTTP to HTTPS

5. **Enable CORS properly**
   ```javascript
   FRONTEND_URL: "https://aidcore.vercel.app"
   ```

### Frontend Security

1. **Security headers** (via Netlify/Vercel)
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   ```

2. **Content Security Policy**
   ```
   default-src 'self'; script-src 'self' 'wasm-unsafe-eval'
   ```

3. **Subresource Integrity**
   - Hash external scripts/styles

---

## Monitoring & Logging

### Backend Logging

1. **Install Winston logger**
   ```bash
   npm install winston
   ```

2. **Configure logging**
   ```javascript
   // src/config/logger.js
   import winston from 'winston';
   
   const logger = winston.createLogger({
     level: process.env.LOG_LEVEL || 'info',
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' }),
     ],
   });
   
   export default logger;
   ```

### Application Monitoring

1. **Sentry** (error tracking)
   ```bash
   npm install @sentry/node
   ```

2. **New Relic** (performance monitoring)
   - Create account
   - Add New Relic agent

3. **CloudWatch** (AWS)
   - Enable automatic CloudWatch logs

### Database Monitoring

- Enable slow query logs
- Monitor connections
- Setup automated backups
- Test backup restoration regularly

---

## Docker Deployment

### Dockerfile (Backend)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src

EXPOSE 5000

CMD ["npm", "start"]
```

### Dockerfile (Frontend)

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: aidcore_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: aidcore_db
      DB_USER: postgres
      DB_PASSWORD: your_password
      NODE_ENV: production
      JWT_SECRET: your_secret_key
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
docker-compose up -d
```

---

## Rollback Plan

If issues occur post-deployment:

1. **Identify issue** via logs/monitoring
2. **Rollback code** to previous version
   ```bash
   git revert <commit-hash>
   git push origin main
   ```
3. **Redeploy** (automatic via CI/CD)
4. **Restore database** from backup if needed
5. **Monitor** for 30 minutes

---

## Performance Optimization

### Backend

- [ ] Enable HTTP compression
- [ ] Implement caching headers
- [ ] Database query optimization
- [ ] Connection pooling configured
- [ ] Implement pagination limits

### Frontend

- [ ] Code splitting by route
- [ ] Image optimization
- [ ] Font optimization
- [ ] CSS/JS minification
- [ ] Lazy loading

---

## Post-Deployment

1. **Health check**
   ```bash
   curl https://api.aidcore.com/health
   ```

2. **Test key workflows**
   - User registration
   - Case creation
   - Document upload

3. **Monitor metrics**
   - API response times
   - Error rates
   - Database performance

4. **Backup verification**
   - Test database backups
   - Document recovery process

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-09
