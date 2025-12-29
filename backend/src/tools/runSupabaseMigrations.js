/**
 * Run Supabase migrations locally using PostgreSQL connection string
 * Requires env var SUPABASE_DB_URL (Settings > Database > Connection string)
 */
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { Client } from 'pg';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlFilePath = path.resolve(__dirname, '../../supabase/migrations/001_init_schema.sql');

async function run() {
  const connectionString = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('✗ Missing SUPABASE_DB_URL (or DATABASE_URL). Get it from Supabase Settings > Database.');
    process.exit(1);
  }

  if (!fs.existsSync(sqlFilePath)) {
    console.error(`✗ SQL file not found: ${sqlFilePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFilePath, 'utf8');

  const client = new Client({ connectionString });
  try {
    console.log('🔄 Connecting to Supabase Postgres...');
    await client.connect();
    console.log('✓ Connected. Running migrations...');

    // Run within a transaction for safety
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    console.log('✓ Migrations applied successfully');
    process.exit(0);
  } catch (err) {
    console.error('✗ Migration failed:', err.message);
    try { await client.query('ROLLBACK'); } catch {}
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
