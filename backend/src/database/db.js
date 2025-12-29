/**
 * Database Initialization
 * Create tables untuk Kandidat, Kriteria, dan Penilaian
 */
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import dbConfig from '../config/database.js';

let db = null;

/**
 * Initialize database connection dan create tables
 */
export async function initDatabase() {
  try {
    // Ensure database directory exists
    const dbDir = path.dirname(dbConfig.dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`Created database directory: ${dbDir}`);
    }

    db = await open({
      filename: dbConfig.dbPath,
      driver: sqlite3.Database
    });

    // Enable foreign keys
    await db.exec('PRAGMA foreign_keys = ON');

    // Create Users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        nama_lengkap TEXT,
        role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
        is_active INTEGER DEFAULT 1,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Kandidat table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS kandidat (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        asal_kamar TEXT NOT NULL,
        usia INTEGER NOT NULL,
        masa_tinggal INTEGER NOT NULL,
        keterangan TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Kriteria table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS kriteria (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama_kriteria TEXT NOT NULL UNIQUE,
        bobot REAL NOT NULL CHECK(bobot > 0 AND bobot <= 1),
        tipe TEXT NOT NULL CHECK(tipe IN ('benefit', 'cost')),
        skala TEXT NOT NULL DEFAULT '1-10' CHECK(skala IN ('1-10', '1-100', 'persen', 'jumlah')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tambah kolom skala jika database lama belum punya kolom ini
    // Menggunakan try/catch agar tidak gagal bila kolom sudah ada
    try {
      await db.exec(`ALTER TABLE kriteria ADD COLUMN skala TEXT NOT NULL DEFAULT '1-10' CHECK(skala IN ('1-10', '1-100', 'persen', 'jumlah'))`);
    } catch (alterErr) {
      if (!alterErr.message.includes('duplicate column name')) {
        throw alterErr;
      }
    }

    // Create Penilaian table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS penilaian (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        kandidat_id INTEGER NOT NULL,
        kriteria_id INTEGER NOT NULL,
        nilai REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kandidat_id) REFERENCES kandidat(id) ON DELETE CASCADE,
        FOREIGN KEY (kriteria_id) REFERENCES kriteria(id) ON DELETE CASCADE,
        UNIQUE(kandidat_id, kriteria_id)
      )
    `);

    console.log('✓ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('✗ Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Get database instance
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}
