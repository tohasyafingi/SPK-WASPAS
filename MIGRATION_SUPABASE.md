# Migration ke Supabase - Panduan

Karena keterbatasan network (tidak bisa connect langsung ke Supabase Postgres dari machine), gunakan salah satu cara berikut:

## ✅ Cara 1: Supabase Dashboard SQL Editor (RECOMMENDED)

1. Buka https://app.supabase.com → Pilih project Anda
2. Pergi ke **SQL Editor** (menu kiri)
3. Klik **+ New Query**
4. Copy semua kode dari `backend/supabase/migrations/001_init_schema.sql`
5. Paste ke SQL Editor
6. Klik **Run** (atau tekan Ctrl+Enter)

Selesai! Semua table sudah dibuat.

## ✅ Cara 2: Database Migration File via Supabase

Jika ingin via UI:
1. Buka **Supabase Dashboard** → **SQL Editor**
2. Buat query baru
3. Jalankan script di bawah:

```sql
-- Copy dari backend/supabase/migrations/001_init_schema.sql
```

## 🌱 Setelah Migrations Selesai

Seed data dengan admin user:
```powershell
cd backend
npm run seed:supabase
```

Ini akan menambahkan:
- Admin user: `admin` / `admin123`
- Regular user: `user` / `user123`
- Sample data (kandidat, kriteria, penilaian)

## ✅ Backend Sudah Ready

Backend sudah running di `http://localhost:5000` dan siap:
```powershell
npm start
```

## 📝 Testing

```powershell
# Test health
Invoke-RestMethod http://localhost:5000/api/health

# Test login
$body = @{username="admin"; password="admin123"} | ConvertTo-Json
Invoke-RestMethod http://localhost:5000/api/auth/login -Method POST -ContentType "application/json" -Body $body
```
