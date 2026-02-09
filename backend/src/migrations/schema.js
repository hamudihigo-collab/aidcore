import { query } from '../config/database.js';
import { hashPassword } from '../utils/password.js';

export const createTables = async () => {
    try {
        console.log('Creating database tables...');

        // Users table
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT 'viewer',
        is_active BOOLEAN DEFAULT true,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        await query(`CREATE INDEX IF NOT EXISTS email_idx ON users(email);`);
        await query(`CREATE INDEX IF NOT EXISTS role_idx ON users(role);`);

        // Cases table
        await query(`
      CREATE TABLE IF NOT EXISTS cases (
        id SERIAL PRIMARY KEY,
        case_number VARCHAR(50) UNIQUE NOT NULL,
        client_id INTEGER,
        case_manager_id INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        priority VARCHAR(50) DEFAULT 'medium',
        title VARCHAR(255) NOT NULL,
        description TEXT,
        tags JSON,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (case_manager_id) REFERENCES users(id)
      );
    `);

        await query(`CREATE INDEX IF NOT EXISTS case_number_idx ON cases(case_number);`);
        await query(`CREATE INDEX IF NOT EXISTS status_idx ON cases(status);`);
        await query(`CREATE INDEX IF NOT EXISTS case_manager_id_idx ON cases(case_manager_id);`);

        // Documents table
        await query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL,
        document_type VARCHAR(100),
        file_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(500) NOT NULL,
        file_size BIGINT,
        uploaded_by INTEGER NOT NULL,
        description TEXT,
        is_deleted BOOLEAN DEFAULT false,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
        FOREIGN KEY (uploaded_by) REFERENCES users(id)
      );
    `);

        await query(`CREATE INDEX IF NOT EXISTS case_id_idx ON documents(case_id);`);
        await query(`CREATE INDEX IF NOT EXISTS document_type_idx ON documents(document_type);`);

        // Case Notes table
        await query(`
      CREATE TABLE IF NOT EXISTS case_notes (
        id SERIAL PRIMARY KEY,
        case_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_private BOOLEAN DEFAULT false,
        is_deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

        await query(`CREATE INDEX IF NOT EXISTS case_id_idx_notes ON case_notes(case_id);`);
        await query(`CREATE INDEX IF NOT EXISTS user_id_idx ON case_notes(user_id);`);

        console.log('✓ All tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error.message);
        throw error;
    }
};

export const seedDatabase = async () => {
    try {
        console.log('Seeding database with sample data...');

        // Check if admin user exists
        const adminResult = await query(`
      SELECT id FROM users WHERE email = 'admin@aidcore.com' LIMIT 1
    `);

        if (adminResult.rows.length === 0) {
            // Hash password properly
            const hashedPassword = await hashPassword('Admin@123');

            // Create admin user
            await query(`
        INSERT INTO users (email, password, first_name, last_name, role, is_active)
        VALUES ($1, $2, 'Admin', 'User', 'admin', true)
      `, ['admin@aidcore.com', hashedPassword]);
            console.log('✓ Admin user created');
        }

        console.log('✓ Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error.message);
        throw error;
    }
};

export const runMigrations = async () => {
    try {
        console.log('Running migrations...');
        await createTables();
        await seedDatabase();
        console.log('✓ Migrations completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};
