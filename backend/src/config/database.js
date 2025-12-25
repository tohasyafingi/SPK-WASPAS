/**
 * Database Configuration
 * Path to SQLite database file
 */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'spk_waspas.db');

export default {
  dbPath,
  verbose: process.env.NODE_ENV === 'development'
};
