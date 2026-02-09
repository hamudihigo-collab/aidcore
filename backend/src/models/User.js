import { query } from '../config/database.js';

export const User = {
    async create(user) {
        const { email, password, firstName, lastName, role, phone } = user;
        const result = await query(
            `INSERT INTO users (email, password, first_name, last_name, role, phone, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING id, email, first_name, last_name, role, phone, created_at, updated_at`,
            [email, password, firstName, lastName, role, phone]
        );
        return result.rows[0];
    },

    async findByEmail(email) {
        const result = await query(
            `SELECT id, email, password, first_name, last_name, role, phone, is_active, created_at, updated_at
       FROM users WHERE email = $1 AND is_deleted = false`,
            [email]
        );
        return result.rows[0];
    },

    async findById(id) {
        const result = await query(
            `SELECT id, email, first_name, last_name, role, phone, is_active, created_at, updated_at
       FROM users WHERE id = $1 AND is_deleted = false`,
            [id]
        );
        return result.rows[0];
    },

    async findAll(limit = 10, offset = 0) {
        const result = await query(
            `SELECT id, email, first_name, last_name, role, phone, is_active, created_at
       FROM users WHERE is_deleted = false ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        return result.rows;
    },

    async count() {
        const result = await query(
            `SELECT COUNT(*) as count FROM users WHERE is_deleted = false`
        );
        return result.rows[0].count;
    },

    async update(id, updates) {
        const { firstName, lastName, phone, role, isActive } = updates;
        const result = await query(
            `UPDATE users SET first_name = $1, last_name = $2, phone = $3, role = $4, is_active = $5, updated_at = NOW()
       WHERE id = $6 AND is_deleted = false
       RETURNING id, email, first_name, last_name, role, phone, is_active, updated_at`,
            [firstName, lastName, phone, role, isActive, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        const result = await query(
            `UPDATE users SET is_deleted = true, updated_at = NOW() WHERE id = $1
       RETURNING id`,
            [id]
        );
        return result.rows[0];
    },
};
