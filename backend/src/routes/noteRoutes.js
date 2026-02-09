import express from 'express';
import * as noteController from '../controllers/noteController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All note routes require authentication
router.use(authenticateToken);

// Create note
router.post('/', noteController.createNote);

// Get notes by case ID
router.get('/case/:caseId', noteController.getNotesByCaseId);

// Get note by ID
router.get('/:id', noteController.getNoteById);

// Update note
router.put('/:id', noteController.updateNote);

// Delete note
router.delete('/:id', noteController.deleteNote);

export default router;
