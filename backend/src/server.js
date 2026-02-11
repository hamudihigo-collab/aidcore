import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import caseRoutes from './routes/caseRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import {
    corsMiddleware,
    helmetMiddleware,
    requestLogger,
    jsonParser,
    urlEncodedParser,
} from './middleware/common.js';
import { errorHandler, notFoundHandler } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(requestLogger);
app.use(jsonParser);
app.use(urlEncodedParser);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'AIDCORE API is running',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/notes', noteRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  🚀 AIDCORE Backend Server Started  🚀 ║
║  Port: ${PORT}                          ║
║  Environment: ${process.env.NODE_ENV}              ║
║  API URL: http://localhost:${PORT}      ║
╚════════════════════════════════════════╝
  `);
});

export default app;
