import { query } from '../config/database.js';

export const CaseNote = {
    async create(noteData) {
        const { caseId, userId, title, content, isPrivate } = noteData;

        const result = await query(
            `INSERT INTO case_notes (case_id, user_id, title, content, is_private, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, case_id, user_id, title, content, is_private, created_at, updated_at`,
            [caseId, userId, title, content, isPrivate || false]
        );

        return result.rows[0];
    },

    async findById(id) {
        const result = await query(
            `SELECT id, case_id, user_id, title, content, is_private, created_at, updated_at
       FROM case_notes WHERE id = $1 AND is_deleted = false`,
            [id]
        );
        return result.rows[0];
    },

    async findByCaseId(caseId, limit = 50, offset = 0) {
        const result = await query(
            `SELECT n.id, n.case_id, n.user_id, u.first_name, u.last_name, n.title, n.content, n.is_private, n.created_at, n.updated_at
       FROM case_notes n
       JOIN users u ON n.user_id = u.id
       WHERE n.case_id = $1 AND n.is_deleted = false
       ORDER BY n.created_at DESC LIMIT $2 OFFSET $3`,
            [caseId, limit, offset]
        );
        return result.rows;
    },

    async update(id, updates) {
        const { title, content, isPrivate } = updates;
        const result = await query(
            `UPDATE case_notes SET title = $1, content = $2, is_private = $3, updated_at = NOW()
       WHERE id = $4 AND is_deleted = false
       RETURNING id, title, content, is_private, updated_at`,
            [title, content, isPrivate, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await query(
            `UPDATE case_notes SET is_deleted = true, updated_at = NOW() WHERE id = $1
       RETURNING id`,
            [id]
        );
        return result.rows[0];
    },
};
