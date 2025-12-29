# 🚀 Apply Supabase Migrations - Step by Step

Karena keterbatasan network (tidak bisa direct connect ke Supabase Postgres dari machine Anda), gunakan **Supabase Dashboard** untuk apply migrations.

## ✅ Step 1: Buka Supabase Dashboard

1. Buka https://app.supabase.com
2. Login dengan akun Anda
3. Pilih project: **zrxlwsnrbvrwltrioolp**

## ✅ Step 2: Buka SQL Editor

1. Di menu kiri, klik **SQL Editor**
2. Klik **+ New Query** (atau **New SQL Query**)
3. Beri nama query (optional): `Create SPK WASPAS Tables`

## ✅ Step 3: Copy & Paste Migration SQL

Copy semua SQL di bawah ini dan paste ke SQL Editor:

```sql
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

-- Create sessions table (for multi-device login management)
CREATE TABLE IF NOT EXISTS sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  device_name TEXT,
  device_ua TEXT,
  ip_address TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, device_name)
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
```

## ✅ Step 4: Run Query

1. Klik tombol **Run** (atau tekan Ctrl+Enter / Cmd+Enter)
2. Tunggu sampai selesai (biasanya < 5 detik)
3. Lihat message: `✓ Success` atau `✓ Query executed successfully`

Jika ada error, copy error message dan cek di step 5.

## ✅ Step 5: Verify Tables Created

Setelah query berhasil, verify tables sudah dibuat:

1. Di menu kiri, buka **Table Editor**
2. Lihat daftar tables:
   - ✓ `users`
   - ✓ `kandidat`
   - ✓ `kriteria`
   - ✓ `penilaian`
   - ✓ `sessions`

Semua table harus ada!

## 🌱 Step 6: Seed Data (Optional)

Setelah migrations selesai, jalankan di terminal untuk menambah data awal:

```powershell
cd backend
npm run seed:supabase
```

Ini akan membuat:
- Admin user: `admin` / `admin123`
- Regular user: `user` / `user123`
- Sample data (kandidat, kriteria, penilaian)

## ✅ Step 7: Test Backend

Backend sudah running. Test dengan:

```powershell
# Test health endpoint
Invoke-RestMethod http://localhost:5000/api/health

# Test login
$body = @{username="admin"; password="admin123"} | ConvertTo-Json
Invoke-RestMethod http://localhost:5000/api/auth/login -Method POST -ContentType "application/json" -Body $body
```

## 🎯 Troubleshooting

**Error: "relation "users" does not exist"**
- Migrations belum run. Lakukan Step 3-4 lagi.

**Error: "syntax error"**
- Ada typo di SQL. Copy ulang dari dokumentasi ini.

**Tabel sudah ada?**
- Migration idempotent (menggunakan `IF NOT EXISTS`), aman untuk run berkali-kali.

---

**Next:** Setelah migrations selesai, Anda bisa test API menggunakan frontend atau Postman!
