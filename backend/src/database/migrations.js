/**
 * Database Migrations
 * Script untuk mengelola perubahan struktur database
 */
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'spk_waspas.db');

/**
 * Create sessions table for multi-device login
 */
async function createSessionsTable(db) {
  const sql = `
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      device_name TEXT,
      device_ua TEXT,
      ip_address TEXT,
      last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      is_active INTEGER DEFAULT 1,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, device_name)
    );
  `;
  
  await db.exec(sql);
  console.log('✓ Sessions table created or already exists');
}

/**
 * Run all migrations
 */
export async function runMigrations() {
  let db = null;
  try {
    console.log('\n🔄 Running database migrations...\n');
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    await createSessionsTable(db);
    console.log('\n✓ All migrations completed successfully!\n');
  } catch (error) {
    console.error('✗ Migration failed:', error.message);
    throw error;
  } finally {
    if (db) await db.close();
  }
}

/**
 * Run migrations if this file is executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

export default { runMigrations };
