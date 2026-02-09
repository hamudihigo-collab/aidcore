import { query } from '../config/database.js';

export const Document = {
    async create(documentData) {
        const {
            caseId,
            documentType,
            fileName,
            fileUrl,
            fileSize,
            uploadedBy,
            description,
        } = documentData;

        const result = await query(
            `INSERT INTO documents (
        case_id, document_type, file_name, file_url, file_size, uploaded_by, description, uploaded_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, case_id, document_type, file_name, file_url, file_size, uploaded_by, description, uploaded_at, updated_at`,
            [caseId, documentType, fileName, fileUrl, fileSize, uploadedBy, description]
        );

        return result.rows[0];
    },

    async findById(id) {
        const result = await query(
            `SELECT id, case_id, document_type, file_name, file_url, file_size, uploaded_by, description, uploaded_at, updated_at
       FROM documents WHERE id = $1 AND is_deleted = false`,
            [id]
        );
        return result.rows[0];
    },

    async findByCaseId(caseId, limit = 100, offset = 0) {
        const result = await query(
            `SELECT id, case_id, document_type, file_name, file_url, file_size, uploaded_by, description, uploaded_at
       FROM documents WHERE case_id = $1 AND is_deleted = false
       ORDER BY uploaded_at DESC LIMIT $2 OFFSET $3`,
            [caseId, limit, offset]
        );
        return result.rows;
    },

    async update(id, updates) {
        const { documentType, description } = updates;
        const result = await query(
            `UPDATE documents SET document_type = $1, description = $2, updated_at = NOW()
       WHERE id = $3 AND is_deleted = false
       RETURNING id, document_type, description, updated_at`,
            [documentType, description, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await query(
            `UPDATE documents SET is_deleted = true, updated_at = NOW() WHERE id = $1
       RETURNING id`,
            [id]
        );
        return result.rows[0];
    },

    async countByCaseId(caseId) {
        const result = await query(
            `SELECT COUNT(*) as count FROM documents WHERE case_id = $1 AND is_deleted = false`,
            [caseId]
        );
        return parseInt(result.rows[0].count);
    },
};
