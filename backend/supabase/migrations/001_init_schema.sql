-- SPK WASPAS Supabase Database Schema
-- Run this SQL in Supabase SQL Editor to create all tables

-- Create users table
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
);

-- Create index for faster username lookups
CREATE INDEX idx_users_username ON users(username);

-- Create kandidat table
CREATE TABLE IF NOT EXISTS kandidat (
  id BIGSERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  asal_kamar TEXT NOT NULL,
  usia INTEGER NOT NULL,
  masa_tinggal INTEGER NOT NULL,
  keterangan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create kriteria table
CREATE TABLE IF NOT EXISTS kriteria (
  id BIGSERIAL PRIMARY KEY,
  nama_kriteria TEXT NOT NULL UNIQUE,
  bobot DECIMAL NOT NULL CHECK(bobot > 0 AND bobot <= 1),
  tipe TEXT NOT NULL CHECK(tipe IN ('benefit', 'cost')),
  skala TEXT NOT NULL DEFAULT '1-10' CHECK(skala IN ('1-10', '1-100', 'persen', 'jumlah')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create penilaian table
CREATE TABLE IF NOT EXISTS penilaian (
  id BIGSERIAL PRIMARY KEY,
  kandidat_id BIGINT NOT NULL REFERENCES kandidat(id) ON DELETE CASCADE,
  kriteria_id BIGINT NOT NULL REFERENCES kriteria(id) ON DELETE CASCADE,
  nilai DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(kandidat_id, kriteria_id)
);

-- Create indexes for foreign keys
CREATE INDEX idx_penilaian_kandidat ON penilaian(kandidat_id);
CREATE INDEX idx_penilaian_kriteria ON penilaian(kriteria_id);

-- Enable RLS (Row Level Security) if needed
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE kandidat ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE kriteria ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE penilaian ENABLE ROW LEVEL SECURITY;
