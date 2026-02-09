import express from 'express';
import * as caseController from '../controllers/caseController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// All case routes require authentication
router.use(authenticateToken);

// Create case
router.post(
    '/',
    authorizeRole([USER_ROLES.ADMIN, USER_ROLES.CASE_MANAGER]),
    caseController.createCase
);

// Get all cases (with pagination and filters)
router.get('/', caseController.getCases);

// Get case statistics
router.get('/stats/summary', caseController.getCaseStatistics);

// Get case by ID
router.get('/:id', caseController.getCaseById);

// Update case
router.put(
    '/:id',
    authorizeRole([USER_ROLES.ADMIN, USER_ROLES.CASE_MANAGER]),
    caseController.updateCase
);

// Delete case
router.delete(
    '/:id',
    authorizeRole([USER_ROLES.ADMIN, USER_ROLES.CASE_MANAGER]),
    caseController.deleteCase
);

export default router;
