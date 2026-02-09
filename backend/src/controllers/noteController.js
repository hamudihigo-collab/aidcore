import { CaseNote } from '../models/CaseNote.js';
import { Case } from '../models/Case.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

export const createNote = async (req, res) => {
    try {
        const { caseId, title, content, isPrivate } = req.body;

        if (!caseId || !title || !content) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: caseId, title, content',
            });
        }

        // Verify case exists
        const caseData = await Case.findById(caseId);
        if (!caseData) {
            return res.status(404).json({
                status: 'error',
                message: 'Case not found',
            });
        }

        const note = await CaseNote.create({
            caseId,
            userId: req.user.userId,
            title,
            content,
            isPrivate,
        });

        return successResponse(res, note, 'Note created successfully', 201);
    } catch (error) {
        console.error('Create note error:', error);
        return errorResponse(res, error);
    }
};

export const getNotesByCaseId = async (req, res) => {
    try {
        const { caseId } = req.params;
        const { page = 1, pageSize = 20 } = req.query;

        // Verify case exists
        const caseData = await Case.findById(caseId);
        if (!caseData) {
            return res.status(404).json({
                status: 'error',
                message: 'Case not found',
            });
        }

        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const notes = await CaseNote.findByCaseId(caseId, parseInt(pageSize), offset);

        return paginatedResponse(res, notes, notes.length, page, pageSize, 'Notes retrieved successfully');
    } catch (error) {
        console.error('Get notes error:', error);
        return errorResponse(res, error);
    }
};

export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await CaseNote.findById(id);

        if (!note) {
            return res.status(404).json({
                status: 'error',
                message: 'Note not found',
            });
        }

        return successResponse(res, note);
    } catch (error) {
        console.error('Get note error:', error);
        return errorResponse(res, error);
    }
};

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, isPrivate } = req.body;

        const note = await CaseNote.findById(id);
        if (!note) {
            return res.status(404).json({
                status: 'error',
                message: 'Note not found',
            });
        }

        // Only note creator or admin can update
        if (note.user_id !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to update this note',
            });
        }

        const updated = await CaseNote.update(id, { title, content, isPrivate });
        return successResponse(res, updated, 'Note updated successfully');
    } catch (error) {
        console.error('Update note error:', error);
        return errorResponse(res, error);
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const note = await CaseNote.findById(id);
        if (!note) {
            return res.status(404).json({
                status: 'error',
                message: 'Note not found',
            });
        }

        // Only note creator or admin can delete
        if (note.user_id !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'You do not have permission to delete this note',
            });
        }

        await CaseNote.delete(id);
        return successResponse(res, null, 'Note deleted successfully');
    } catch (error) {
        console.error('Delete note error:', error);
        return errorResponse(res, error);
    }
};
