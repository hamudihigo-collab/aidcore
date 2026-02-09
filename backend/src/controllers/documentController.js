import { Document } from '../models/Document.js';
import { Case } from '../models/Case.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const uploadDocument = async (req, res) => {
    try {
        const { caseId, documentType, description } = req.body;
        const file = req.file;

        if (!caseId || !file) {
            return res.status(400).json({
                status: 'error',
                message: 'Missing required fields',
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

        // In production, you'd upload to S3/cloud storage
        // For now, we'll store the file path
        const fileUrl = `/uploads/${caseId}/${file.filename}`;

        const document = await Document.create({
            caseId,
            documentType: documentType || 'other',
            fileName: file.originalname,
            fileUrl,
            fileSize: file.size,
            uploadedBy: req.user.userId,
            description,
        });

        return successResponse(res, document, 'Document uploaded successfully', 201);
    } catch (error) {
        console.error('Upload document error:', error);
        return errorResponse(res, error);
    }
};

export const getDocumentsByCaseId = async (req, res) => {
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
        const documents = await Document.findByCaseId(caseId, parseInt(pageSize), offset);
        const totalItems = await Document.countByCaseId(caseId);

        return res.status(200).json({
            status: 'success',
            data: documents,
            pagination: {
                totalItems,
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                totalPages: Math.ceil(totalItems / pageSize),
            },
        });
    } catch (error) {
        console.error('Get documents error:', error);
        return errorResponse(res, error);
    }
};

export const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await Document.findById(id);

        if (!document) {
            return res.status(404).json({
                status: 'error',
                message: 'Document not found',
            });
        }

        return successResponse(res, document);
    } catch (error) {
        console.error('Get document error:', error);
        return errorResponse(res, error);
    }
};

export const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { documentType, description } = req.body;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({
                status: 'error',
                message: 'Document not found',
            });
        }

        const updated = await Document.update(id, { documentType, description });
        return successResponse(res, updated, 'Document updated successfully');
    } catch (error) {
        console.error('Update document error:', error);
        return errorResponse(res, error);
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({
                status: 'error',
                message: 'Document not found',
            });
        }

        await Document.delete(id);
        return successResponse(res, null, 'Document deleted successfully');
    } catch (error) {
        console.error('Delete document error:', error);
        return errorResponse(res, error);
    }
};
