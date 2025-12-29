/**
 * Supabase Database Initialization
 * Create tables untuk Kandidat, Kriteria, dan Penilaian
 */
import supabase from '../config/supabase.js';

/**
 * Initialize database: verify connection and schema availability.
 * Supabase-js cannot run DDL. Use Supabase SQL Editor to create tables.
 */
export async function initDatabase() {
  console.log('Initializing Supabase database...');
  // Perform a lightweight check against the 'users' table
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Supabase schema check failed:', error.message);
    throw new Error(
      'Supabase tables not found or inaccessible. Run SQL at backend/supabase/migrations/001_init_schema.sql in Supabase SQL Editor.'
    );
  }

  console.log('✓ Supabase connection OK');
  return supabase;
}

/**
 * Get database instance (Supabase client)
 */
export function getDatabase() {
  if (!supabase) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return supabase;
}

/**
 * Run migrations if needed
 */
export async function runMigrations() {
  // No-op: Use Supabase SQL Editor to manage schema.
  console.log('ℹ Supabase migrations managed via SQL files.');
}
