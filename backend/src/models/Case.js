import { query } from '../config/database.js';

export const Case = {
    async create(caseData) {
        const {
            caseNumber,
            clientId,
            caseManagerId,
            status,
            priority,
            title,
            description,
            tags,
        } = caseData;

        const result = await query(
            `INSERT INTO cases (
        case_number, client_id, case_manager_id, status, priority, title, description, tags, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id, case_number, client_id, case_manager_id, status, priority, title, description, tags, created_at, updated_at`,
            [caseNumber, clientId, caseManagerId, status, priority, title, description, JSON.stringify(tags || [])]
        );

        return result.rows[0];
    },

    async findById(id) {
        const result = await query(
            `SELECT id, case_number, client_id, case_manager_id, status, priority, title, description, tags, created_at, updated_at
       FROM cases WHERE id = $1 AND is_deleted = false`,
            [id]
        );
        return result.rows[0];
    },

    async findByCaseNumber(caseNumber) {
        const result = await query(
            `SELECT id, case_number, client_id, case_manager_id, status, priority, title, description, tags, created_at, updated_at
       FROM cases WHERE case_number = $1 AND is_deleted = false`,
            [caseNumber]
        );
        return result.rows[0];
    },

    async findAll(filters = {}, limit = 10, offset = 0) {
        let query_ = `SELECT id, case_number, client_id, case_manager_id, status, priority, title, description, tags, created_at, updated_at
                  FROM cases WHERE is_deleted = false`;
        const params = [];
        let paramCount = 1;

        if (filters.status) {
            query_ += ` AND status = $${paramCount}`;
            params.push(filters.status);
            paramCount++;
        }

        if (filters.priority) {
            query_ += ` AND priority = $${paramCount}`;
            params.push(filters.priority);
            paramCount++;
        }

        if (filters.caseManagerId) {
            query_ += ` AND case_manager_id = $${paramCount}`;
            params.push(filters.caseManagerId);
            paramCount++;
        }

        if (filters.search) {
            query_ += ` AND (case_number ILIKE $${paramCount} OR title ILIKE $${paramCount})`;
            params.push(`%${filters.search}%`);
            paramCount++;
        }

        query_ += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await query(query_, params);
        return result.rows;
    },

    async count(filters = {}) {
        let query_ = `SELECT COUNT(*) as count FROM cases WHERE is_deleted = false`;
        const params = [];

        if (filters.status) {
            query_ += ` AND status = $1`;
            params.push(filters.status);
        }

        if (filters.priority) {
            query_ += ` AND priority = $${params.length + 1}`;
            params.push(filters.priority);
        }

        const result = await query(query_, params);
        return parseInt(result.rows[0].count);
    },

    async update(id, updates) {
        const { status, priority, title, description, caseManagerId } = updates;
        const result = await query(
            `UPDATE cases SET status = $1, priority = $2, title = $3, description = $4, case_manager_id = $5, updated_at = NOW()
       WHERE id = $6 AND is_deleted = false
       RETURNING id, case_number, status, priority, title, description, case_manager_id, updated_at`,
            [status, priority, title, description, caseManagerId, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await query(
            `UPDATE cases SET is_deleted = true, updated_at = NOW() WHERE id = $1
       RETURNING id`,
            [id]
        );
        return result.rows[0];
    },

    async getStatistics(caseManagerId = null) {
        let query_ = `SELECT 
      status, COUNT(*) as count 
      FROM cases 
      WHERE is_deleted = false`;
        const params = [];

        if (caseManagerId) {
            query_ += ` AND case_manager_id = $1`;
            params.push(caseManagerId);
        }

        query_ += ` GROUP BY status`;

        const result = await query(query_, params);
        return result.rows;
    },
};
