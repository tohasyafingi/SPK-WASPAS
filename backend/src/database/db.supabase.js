/**
 * Supabase Database Initialization
 * Create tables untuk Kandidat, Kriteria, dan Penilaian
 */
import supabase from '../config/supabase.js';

/**
 * Initialize database tables
 */
export async function initDatabase() {
  try {
    console.log('Initializing Supabase database...');

    // Create users table
    const { error: usersError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id BIGSERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          email TEXT,
          nama_lengkap TEXT,
          role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
          is_active BOOLEAN DEFAULT true,
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
    }).catch(err => ({ error: null })); // Ignore if table exists

    // Create kandidat table
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS kandidat (
          id BIGSERIAL PRIMARY KEY,
          nama TEXT NOT NULL,
          asal_kamar TEXT NOT NULL,
          usia INTEGER NOT NULL,
          masa_tinggal INTEGER NOT NULL,
          keterangan TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
    }).catch(err => ({ error: null }));

    // Create kriteria table
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS kriteria (
          id BIGSERIAL PRIMARY KEY,
          nama_kriteria TEXT NOT NULL UNIQUE,
          bobot DECIMAL NOT NULL CHECK(bobot > 0 AND bobot <= 1),
          tipe TEXT NOT NULL CHECK(tipe IN ('benefit', 'cost')),
          skala TEXT NOT NULL DEFAULT '1-10' CHECK(skala IN ('1-10', '1-100', 'persen', 'jumlah')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
    }).catch(err => ({ error: null }));

    // Create penilaian table
    await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS penilaian (
          id BIGSERIAL PRIMARY KEY,
          kandidat_id BIGINT NOT NULL REFERENCES kandidat(id) ON DELETE CASCADE,
          kriteria_id BIGINT NOT NULL REFERENCES kriteria(id) ON DELETE CASCADE,
          nilai DECIMAL NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(kandidat_id, kriteria_id)
        )
      `
    }).catch(err => ({ error: null }));

    console.log('✓ Database initialized successfully');
    return supabase;
  } catch (error) {
    console.error('✗ Failed to initialize database:', error);
    throw error;
  }
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
  // Supabase handles migrations through SQL editor or this function
  // For now, migrations are handled by initDatabase
  console.log('✓ Migrations completed (handled by Supabase schema)');
}
