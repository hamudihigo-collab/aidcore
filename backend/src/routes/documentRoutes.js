import express from 'express';
import * as documentController from '../controllers/documentController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// All document routes require authentication
router.use(authenticateToken);

// Upload document
router.post(
    '/',
    authorizeRole([USER_ROLES.ADMIN, USER_ROLES.CASE_MANAGER]),
    documentController.uploadDocument
);

// Get documents by case ID
router.get('/case/:caseId', documentController.getDocumentsByCaseId);

// Get document by ID
router.get('/:id', documentController.getDocumentById);

// Update document
router.put(
    '/:id',
    authorizeRole([USER_ROLES.ADMIN, USER_ROLES.CASE_MANAGER]),
    documentController.updateDocument
);

// Delete document
router.delete(
    '/:id',
    authorizeRole([USER_ROLES.ADMIN, USER_ROLES.CASE_MANAGER]),
    documentController.deleteDocument
);

export default router;
