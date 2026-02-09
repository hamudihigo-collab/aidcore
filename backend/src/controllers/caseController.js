import { Case } from '../models/Case.js';
import { Document } from '../models/Document.js';
import { CaseNote } from '../models/CaseNote.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { nanoid } from 'nanoid';

export const createCase = async (req, res) => {
    try {
        const { clientId, title, description, priority, tags } = req.body;

        if (!clientId || !title) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields: clientId, title',
            });
        }

        const caseNumber = `CASE-${Date.now()}-${nanoid(6)}`;
        const newCase = await Case.create({
            caseNumber,
            clientId,
            caseManagerId: req.user.userId,
            status: 'open',
            priority: priority || 'medium',
            title,
            description,
            tags,
        });

        return successResponse(res, newCase, 'Case created successfully', 201);
    } catch (error) {
        console.error('Create case error:', error);
        return errorResponse(res, error);
    }
};

export const getCaseById = async (req, res) => {
    try {
        const { id } = req.params;
        const caseData = await Case.findById(id);

        if (!caseData) {
            return res.status(404).json({
                status: 'error',
                message: 'Case not found',
            });
        }

        return successResponse(res, caseData);
    } catch (error) {
        console.error('Get case error:', error);
        return errorResponse(res, error);
    }
};

export const getCases = async (req, res) => {
    try {
        const { page = 1, pageSize = 10, status, priority, search } = req.query;

        const filters = {};
        if (status) filters.status = status;
        if (priority) filters.priority = priority;
        if (search) filters.search = search;

        // For case manager, show only their cases
        if (req.user.role === 'case_manager') {
            filters.caseManagerId = req.user.userId;
        }

        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const cases = await Case.findAll(filters, parseInt(pageSize), offset);
        const totalItems = await Case.count(filters);

        return paginatedResponse(res, cases, totalItems, page, pageSize, 'Cases retrieved successfully');
    } catch (error) {
        console.error('Get cases error:', error);
        return errorResponse(res, error);
    }
};

export const updateCase = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const caseData = await Case.findById(id);
        if (!caseData) {
            return res.status(404).json({
                status: 'error',
                message: 'Case not found',
            });
        }

        const updatedCase = await Case.update(id, updates);
        return successResponse(res, updatedCase, 'Case updated successfully');
    } catch (error) {
        console.error('Update case error:', error);
        return errorResponse(res, error);
    }
};

export const deleteCase = async (req, res) => {
    try {
        const { id } = req.params;

        const caseData = await Case.findById(id);
        if (!caseData) {
            return res.status(404).json({
                status: 'error',
                message: 'Case not found',
            });
        }

        await Case.delete(id);
        return successResponse(res, null, 'Case deleted successfully');
    } catch (error) {
        console.error('Delete case error:', error);
        return errorResponse(res, error);
    }
};

export const getCaseStatistics = async (req, res) => {
    try {
        const statistics = await Case.getStatistics(req.user.role === 'case_manager' ? req.user.userId : null);
        return successResponse(res, statistics, 'Statistics retrieved successfully');
    } catch (error) {
        console.error('Get statistics error:', error);
        return errorResponse(res, error);
    }
};
