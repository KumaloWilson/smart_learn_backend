import fs from 'fs';
import path from 'path';
import db from '../config/sql_config';

export const runMigrations = async () => {
    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));

    // Ensure migrations table exists
    await db.query(`
        CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            file_name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);


    for (const file of files) {
        const [existingMigration]: any = await db.query(
            'SELECT * FROM migrations WHERE file_name = ?',
            [file]
        );

        if (existingMigration.length > 0) {
            console.log(`Migration already executed: ${file}`);
            continue; // Skip already executed migration
        }

        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        try {
            await db.query(sql); // Execute the SQL
            await db.query('INSERT INTO migrations (file_name) VALUES (?)', [file]);
            console.log(`Executed migration: ${file}`);
        } catch (error) {
            console.error(`Error executing migration: ${file}`, error);
            throw error; // Stop execution on migration error
        }
    }
};
