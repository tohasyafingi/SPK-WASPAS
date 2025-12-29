# 🎯 SPK WASPAS - Sistem Pemilihan Santri Teladan

> Sistem Pendukung Keputusan berbasis web untuk pemilihan santri teladan menggunakan metode **WASPAS (Weighted Aggregated Sum Product Assessment)**.

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

## 🌟 Highlight

- ✅ **Perhitungan Akurat**: Sistem menghasilkan ranking yang **100% identik** dengan perhitungan manual
- ✅ **Tervalidasi**: Telah diverifikasi dengan data aktual (selisih 0.000000)
- ✅ **User Friendly**: Interface modern dengan modal forms dan tampilan responsif
- ✅ **Export PDF**: Generate laporan hasil ranking dengan kualitas tinggi
- ✅ **Secure**: Autentikasi JWT dengan session management multi-device

## 📋 Daftar Isi

- [🚀 Quick Start](#-quick-start)
- [🛠️ Stack Teknologi](#️-stack-teknologi)
- [✨ Fitur Utama](#-fitur-utama)
- [📦 Instalasi](#-instalasi)
- [🎮 Menjalankan Sistem](#-menjalankan-sistem)
- [🧮 Metode WASPAS](#-metode-waspas)
- [📊 Validasi Perhitungan](#-validasi-perhitungan)
- [🗄️ Struktur Database](#️-struktur-database)
- [📚 API Documentation](#-api-documentation)
- [🔐 Autentikasi & Session](#-autentikasi--session)
- [📄 Export & Print PDF](#-export--print-pdf)
- [🚀 Deployment](#-deployment)
- [🔧 Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/tohasyafingi/SPK-WASPAS.git
cd SPK-WASPAS

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Setup database (jalankan fix-database.sql di Supabase)
# Lihat: INSTRUKSI_UPDATE_DATABASE.md

# 4. Start aplikasi
cd backend && npm start    # Backend: http://localhost:5000
cd frontend && npm start   # Frontend: http://localhost:3000

# 5. Login
Username: admin
Password: admin123
```

**📖 Dokumentasi Lengkap:** Lihat `DOKUMENTASI_PERHITUNGAN_FINAL.md` untuk detail perhitungan WASPAS.

---

## 🛠️ Stack Teknologi

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: Supabase PostgreSQL
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Architecture**: Layered Architecture (Controller, Service, Repository)

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: React Icons (Feather Icons)
- **PDF Export**: jsPDF + jspdf-autotable, html2canvas
- **Styling**: CSS3 (sticky header/sidebar, tabel responsif, print-friendly)

## ✨ Fitur Utama

### 🔐 1. Autentikasi & Keamanan
- Login dengan JWT token
- Multi-device session (unlimited devices)
- Auto-logout setelah 30 menit inaktivitas
- Protected routes dengan middleware

### 👥 2. Manajemen Data
- **Kandidat**: CRUD data santri dengan validasi
- **Kriteria**: Pengaturan kriteria dengan bobot, tipe (benefit/cost), dan skala
- **Penilaian**: Input nilai dengan tampilan pivot table (kandidat × kriteria)

### 🧮 3. Perhitungan WASPAS
- **Normalisasi otomatis**: Benefit (max) dan Cost (min)
- **WSM**: Weighted Sum Model
- **WPM**: Weighted Product Model
- **Qi Score**: Agregasi final (0.5×WSM + 0.5×WPM)
- **Caching**: In-memory cache untuk performa optimal

### 🏆 4. Hasil & Ranking
- Tampilan ranking real-time dengan badge & icons
- Detail perhitungan per kandidat
- Statistik lengkap (total kandidat, kriteria, pemenang)
- **Export PDF**: Vector (jsPDF) dan Raster (html2canvas)
- **Print friendly**: Layout optimized untuk print

### 🎨 5. User Experience
- Modal forms untuk semua CRUD operations
- Sticky header dan fixed sidebar
- Responsive design (mobile, tablet, desktop)
- Loading states & error handling
- Toast notifications

## 📦 Instalasi

### Prerequisites
- Node.js v18 atau lebih tinggi
- npm atau yarn
- Git
- Supabase account (gratis tier tersedia)

### Clone Repository
```bash
git clone https://github.com/tohasyafingi/SPK-WASPAS.git
cd SPK-WASPAS
```

### Backend Setup

1. **Masuk ke folder backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Supabase Database**
   - Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard)
   - Salin **Connection String** (format: `postgresql://...`)
   - Jalankan migration SQL di Supabase SQL Editor:
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

    -- Enable RLS (Row Level Security) if needed
    -- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    -- ALTER TABLE kandidat ENABLE ROW LEVEL SECURITY;
    -- ALTER TABLE kriteria ENABLE ROW LEVEL SECURITY;
    -- ALTER TABLE penilaian ENABLE ROW LEVEL SECURITY;
    -- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

     ```

4. **Buat file .env**
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Cache Configuration (optional)
HASIL_CACHE_TTL_MS=60000
```

5. **Seed data awal (opsional)**
```bash
node src/tools/seedSupabase.js
```

### Frontend Setup

1. **Masuk ke folder frontend**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Buat file .env**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🧮 Metode WASPAS

### Algoritma

WASPAS (Weighted Aggregated Sum Product Assessment) menggabungkan dua metode:

**1. WSM (Weighted Sum Model)**
```
WSM = Σ(wi × rij)
```

**2. WPM (Weighted Product Model)**
```
WPM = Π(rij^wi)
```

**3. Agregasi WASPAS**
```
Qi = λ × WSM + (1-λ) × WPM
dimana λ = 0.5 (default)
```

### Normalisasi

**Benefit Criteria** (semakin tinggi semakin baik):
```
rij = xij / max(xj)
```

**Cost Criteria** (semakin rendah semakin baik):
```
rij = min(xj) / xij
```

### Contoh Perhitungan

Lihat dokumentasi lengkap di: **`DOKUMENTASI_PERHITUNGAN_FINAL.md`**

---

## 📊 Validasi Perhitungan

Sistem telah divalidasi dengan perhitungan manual menggunakan data aktual:

| Aspek | Status | Keterangan |
|-------|--------|------------|
| **Data Input** | ✅ 100% | 6 kriteria, 36 penilaian sesuai sumber |
| **Algoritma** | ✅ Valid | WASPAS standar (WSM + WPM) |
| **Normalisasi** | ✅ Benar | Benefit: max, Cost: min |
| **Ranking** | ✅ Identik | Manual = Sistem |
| **Nilai Qi** | ✅ Perfect | Selisih 0.000000 |

**Testing Script:** Jalankan `node test-manual-calculation.js` untuk verifikasi ulang.

**Hasil Validasi:**
```
✅ KESIMPULAN: PERHITUNGAN MANUAL = SISTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Ranking order: IDENTIK
✅ Data input: 100% sama
✅ Algoritma: Terverifikasi
🎯 Pemenang: Talita (Qi = 0.912205)
```

---

Server backend akan berjalan di: **http://localhost:5000**

Endpoint health check: `http://localhost:5000/api/health`

### Terminal 2: Jalankan Frontend

```bash
cd frontend
npm install
npm start
```

Browser secara otomatis akan membuka aplikasi di: **http://localhost:3000**

### Default Login Credentials

Setelah seed data:
- **Username**: `admin`
- **Password**: `admin123`

atau

- **Username**: `user`
- **Password**: `user123`

## 📊 Struktur Database

Database menggunakan **PostgreSQL** via Supabase dengan 5 tabel utama:

### Tabel: users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK(role IN ('admin', 'user')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabel: sessions
```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  device_name VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, device_name)
);
```

### Tabel: kandidat
```sql
CREATE TABLE kandidat (
  id SERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  asal_kamar VARCHAR(50) NOT NULL,
  usia INTEGER NOT NULL CHECK(usia > 0),
  masa_tinggal INTEGER NOT NULL CHECK(masa_tinggal >= 0),
  keterangan TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabel: kriteria
```sql
CREATE TABLE kriteria (
  id SERIAL PRIMARY KEY,
  nama_kriteria VARCHAR(100) UNIQUE NOT NULL,
  bobot DECIMAL(5,4) NOT NULL CHECK(bobot > 0 AND bobot <= 1),
  tipe VARCHAR(10) NOT NULL CHECK(tipe IN ('benefit', 'cost')),
  skala VARCHAR(20) NOT NULL DEFAULT '1-10' 
    CHECK(skala IN ('1-10','1-100','persen','jumlah')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tabel: penilaian
```sql
CREATE TABLE penilaian (
  id SERIAL PRIMARY KEY,
  kandidat_id INTEGER NOT NULL REFERENCES kandidat(id) ON DELETE CASCADE,
  kriteria_id INTEGER NOT NULL REFERENCES kriteria(id) ON DELETE CASCADE,
  nilai DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(kandidat_id, kriteria_id)
);
```

### Indexes untuk Performa
```sql
CREATE INDEX idx_penilaian_kandidat ON penilaian(kandidat_id);
CREATE INDEX idx_penilaian_kriteria ON penilaian(kriteria_id);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_active ON sessions(is_active, expires_at);
```

## 📡 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user info | Yes |
| GET | `/api/auth/sessions` | Get active sessions | Yes |
| DELETE | `/api/auth/sessions/:id` | Delete specific session | Yes |

**Login Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Login Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    },
    "session": {
      "id": 1,
      "deviceName": "Chrome on Windows",
      "expiresAt": "2025-01-06T10:00:00Z"
    }
  }
}
```

### Kandidat Endpoints

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/api/kandidat` | Get semua kandidat | Yes |
| POST | `/api/kandidat` | Buat kandidat baru | Yes |
| GET | `/api/kandidat/:id` | Get kandidat by ID | Yes |
| PUT | `/api/kandidat/:id` | Update kandidat | Yes |
| DELETE | `/api/kandidat/:id` | Delete kandidat | Yes |

**Create Kandidat Request:**
```json
{
  "nama": "Ahmad Zainudin",
  "asal_kamar": "Kamar 3",
  "usia": 21,
  "masa_tinggal": 2,
  "keterangan": "Santri aktif organisasi"
}
```

### Kriteria Endpoints

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/api/kriteria` | Get semua kriteria | Yes |
| POST | `/api/kriteria` | Buat kriteria baru | Yes |
| GET | `/api/kriteria/:id` | Get kriteria by ID | Yes |
| PUT | `/api/kriteria/:id` | Update kriteria | Yes |
| DELETE | `/api/kriteria/:id` | Delete kriteria | Yes |

**Create Kriteria Request:**
```json
{
  "nama_kriteria": "Kepemimpinan",
  "bobot": 0.25,
  "tipe": "benefit",
  "skala": "1-100"
}
```

### Penilaian Endpoints

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/api/penilaian` | Get semua penilaian | Yes |
| POST | `/api/penilaian` | Buat penilaian baru | Yes |
| GET | `/api/penilaian/:id` | Get penilaian by ID | Yes |
| PUT | `/api/penilaian/:id` | Update penilaian | Yes |
| DELETE | `/api/penilaian/:id` | Delete penilaian | Yes |
| GET | `/api/penilaian/kandidat/:kandidatId` | Get penilaian by kandidat | Yes |

**Create Penilaian Request:**
```json
{
  "kandidat_id": 1,
  "kriteria_id": 2,
  "nilai": 85
}
```

### WASPAS Hasil Endpoints

| Method | Endpoint | Deskripsi | Auth Required | Cache |
|--------|----------|-----------|---------------|-------|
| GET | `/api/hasil` | Hitung dan dapatkan ranking WASPAS | Yes | Yes (60s) |
| GET | `/api/hasil/:kandidatId/detail` | Detail perhitungan kandidat | Yes | No |

**Hasil Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama": "Ahmad Zainudin",
      "asal_kamar": "Kamar 3",
      "usia": 21,
      "masa_tinggal": 2,
      "wsm": 0.856234,
      "wpm": 0.842156,
      "qi": 0.849195,
      "rank": 1
    }
  ]
}
```

### Health Check

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/api/health` | Check status server & database | No |

**Health Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T10:00:00.000Z",
  "database": "connected",
  "uptime": 3600
}
```

## 📐 Metode WASPAS

### Langkah-Langkah Perhitungan

1. **Normalisasi Nilai**
   - **Benefit**: `r_ij = x_ij / max(x_j)`
   - **Cost**: `r_ij = min(x_j) / x_ij`

2. **Hitung WSM (Weighted Sum Model)**
   ```
   S_i = Σ(w_j × r_ij)
   ```

3. **Hitung WPM (Weighted Product Model)**
   ```
   P_i = Π(r_ij ^ w_j)
   ```

4. **Agregasi WASPAS**
   ```
   Q_i = 0.5 × S_i + 0.5 × P_i
   ```

5. **Ranking**
   - Sort kandidat berdasarkan Q_i (descending)
   - Kandidat dengan Q_i tertinggi mendapat ranking terbaik

Catatan bobot: bobot kriteria dinormalisasi sehingga Σ w = 1 sebelum WSM/WPM; masing-masing bobot wajib 0 < w ≤ 1 sesuai constraint DB.

### Contoh Kasus

Misalkan ada 3 kandidat dan 3 kriteria:

**Kriteria:**
- Kepribadian (Bobot: 0.3, Tipe: Benefit)
- Pengalaman Organisasi (Bobot: 0.4, Tipe: Benefit)
- Loyalitas (Bobot: 0.3, Tipe: Benefit)

**Nilai Penilaian:**
| Kandidat | Kepribadian | Pengalaman | Loyalitas |
|----------|------------|-----------|-----------|
| A | 80 | 75 | 85 |
| B | 85 | 80 | 80 |
| C | 75 | 85 | 90 |

Sistem akan menghitung normalisasi, WSM, WPM, dan WASPAS secara otomatis untuk menghasilkan ranking final.

## 🔐 Autentikasi & Session

### JWT Token Authentication

Sistem menggunakan JWT (JSON Web Token) untuk autentikasi dengan fitur:

- **Token Expiry**: Default 7 hari (configurable via `JWT_EXPIRE`)
- **Secure Storage**: Token disimpan di localStorage frontend
- **Auto-refresh**: Token otomatis divalidasi pada setiap request

### Multi-Device Session Management

- **Unlimited Devices**: User dapat login dari banyak device bersamaan
- **Session Tracking**: Setiap login mencatat device name, IP, dan user agent
- **Inactivity Timeout**: Auto-logout setelah 30 menit tidak ada aktivitas
- **Manual Logout**: User dapat logout dari device tertentu atau semua device
- **Session Cleanup**: Expired sessions dihapus otomatis setiap 1 jam

### Session Security

```javascript
// Session dibuat dengan informasi lengkap
{
  user_id: 1,
  token: "eyJhbGci...",
  device_name: "Chrome on Windows",
  ip_address: "192.168.1.100",
  user_agent: "Mozilla/5.0...",
  expires_at: "2025-01-06T10:00:00Z",
  last_activity: "2025-12-30T10:00:00Z"
}
```

### Protected Routes

Semua endpoint (kecuali `/auth/login` dan `/health`) memerlukan token:

```javascript
// Header format
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Frontend secara otomatis menambahkan header ini via axios interceptor.

## 📄 Export & Print PDF

### Export PDF (Tajam - Vector Text)

Menggunakan **jspdf-autotable** untuk hasil tajam dengan teks selectable:

**Fitur:**
- ✅ Vector text (crisp di semua zoom level)
- ✅ Tabel otomatis dengan multi-page
- ✅ Header dengan judul & tanggal
- ✅ Footer dengan nomor halaman
- ✅ Legend/penjelasan WSM, WPM, Qi
- ✅ Two-row header (label + deskripsi awam)
- ✅ Striped theme dengan zebra rows
- ✅ Numeric columns right-aligned
- ✅ Custom column widths

**Cara Pakai:**
1. Buka halaman Hasil
2. Klik tombol "Export PDF"
3. File `hasil_waspas_YYYY-MM-DD_tajam.pdf` akan terdownload

### Print PDF (Browser Native)

Menggunakan `window.print()` dengan `@media print` CSS:

**Fitur:**
- ✅ Print-friendly layout
- ✅ Hides non-essential UI (buttons, stats cards)
- ✅ Zebra striping & table borders
- ✅ Repeated header on each page
- ✅ Clean typography untuk print
- ✅ A4 portrait dengan margin optimal

**Cara Pakai:**
1. Buka halaman Hasil
2. Klik tombol "Print"
3. Pilih printer atau "Save as PDF"

### Print CSS Highlights

```css
@page {
  size: A4 portrait;
  margin: 12mm;
}

@media print {
  .data-table thead {
    display: table-header-group; /* repeat on every page */
  }
  
  .data-table tbody tr {
    page-break-inside: avoid;
  }
}
```

## 📁 Struktur Folder

```
SPK-WASPAS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── database/
│   │   │   └── db.js
│   │   ├── repository/
│   │   │   ├── KandidatRepository.js
│   │   │   ├── KriteriaRepository.js
│   │   │   └── PenilaianRepository.js
│   │   ├── service/
│   │   │   ├── KandidatService.js
│   │   │   ├── KriteriaService.js
│   │   │   ├── PenilaianService.js
│   │   │   └── WaspasService.js
│   │   ├── controller/
│   │   │   ├── KandidatController.js
│   │   │   ├── KriteriController.js
│   │   │   ├── PenilaianController.js
│   │   │   └── WaspasController.js
│   │   ├── routes/
│   │   │   ├── kandidat.js
│   │   │   ├── kriteria.js
│   │   │   ├── penilaian.js
│   │   │   ├── hasil.js
│   │   │   └── auth.js
│   │   ├── middleware/
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Form.jsx
│   │   │   ├── Form.css
│   │   │   ├── Table.jsx
│   │   │   └── Table.css
│   │   ├── pages/
│   │   │   ├── KandidatPage.jsx
│   │   │   ├── KriteriaPage.jsx
│   │   │   ├── PenilaianPage.jsx
│   │   │   ├── HasilPage.jsx
│   │   │   ├── CRUD.css
│   │   │   └── HasilPage.css
│   │   ├── services/
│   │   │   └── apiService.js
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── README.md
│
└── README.md
```

## 🔧 Konfigurasi

### Backend (.env)
```env
PORT=5000                          # Port server
NODE_ENV=development               # Environment
DB_PATH=./src/database/spk.db      # Path database
CORS_ORIGIN=http://localhost:3000  # CORS origin
JWT_SECRET=change-this-in-production
```

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:5000/api  # Backend API URL
```

## 🧪 Testing

Contoh request dengan curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Simpan token dari response login
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get profile
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Get semua kandidat
curl http://localhost:5000/api/kandidat \
  -H "Authorization: Bearer $TOKEN"

# Create kandidat baru
curl -X POST http://localhost:5000/api/kandidat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nama": "Amin Santoso",
    "asal_kamar": "Kamar 5",
    "usia": 22,
    "masa_tinggal": 3,
    "keterangan": "Santri aktif"
  }'

# Get hasil ranking
curl http://localhost:5000/api/hasil \
  -H "Authorization: Bearer $TOKEN"

# Get detail perhitungan kandidat
curl http://localhost:5000/api/hasil/1/detail \
  -H "Authorization: Bearer $TOKEN"

# Get active sessions
curl http://localhost:5000/api/auth/sessions \
  -H "Authorization: Bearer $TOKEN"

# Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

## 🚀 Deployment

### Deploy ke Vercel (Frontend)

1. **Push code ke GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import project di Vercel**
   - Login ke [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import repository
   - Set root directory: `frontend`

3. **Configure environment variables**
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Access via Vercel URL

### Deploy Backend (Railway/Render)

#### Railway
1. Login ke [Railway](https://railway.app)
2. New Project → Deploy from GitHub
3. Select repository
4. Set environment variables dari `.env`
5. Railway auto-detects Node.js dan deploy

#### Render
1. Login ke [Render](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables

### Environment Variables untuk Production

**Backend:**
```env
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-frontend-url.vercel.app
JWT_SECRET=generate-strong-random-secret
JWT_EXPIRE=7d
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_URL=your-db-connection-string
HASIL_CACHE_TTL_MS=300000
```

**Frontend:**
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Post-Deployment Checklist

- ✅ Test login dengan credentials default
- ✅ Verify CORS dari frontend ke backend
- ✅ Check Supabase connection & migrations applied
- ✅ Test CRUD operations (kandidat, kriteria, penilaian)
- ✅ Test WASPAS calculation & ranking
- ✅ Test PDF export functionality
- ✅ Test session management & logout
- ✅ Monitor error logs

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Failed**
```
Error: connection to Supabase failed
```
**Solution:**
- Check `SUPABASE_DB_URL` format
- Verify Supabase project is active
- Check network firewall rules
- Apply migrations via Supabase SQL Editor

**JWT Token Invalid**
```
Error: jwt malformed / jwt expired
```
**Solution:**
- Check `JWT_SECRET` is set correctly
- Verify token is included in request header
- Re-login to get fresh token

**CORS Error**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Solution:**
- Update `CORS_ORIGIN` in backend `.env`
- Ensure exact match with frontend URL (no trailing slash)
- Restart backend server

### Frontend Issues

**API Connection Refused**
```
Error: Network Error / Connection refused
```
**Solution:**
- Verify backend is running (`http://localhost:5000/api/health`)
- Check `REACT_APP_API_URL` in frontend `.env`
- Restart frontend dev server

**Export PDF Blank/Failed**
```
Error: Failed to export PDF
```
**Solution:**
- Check browser console for detailed error
- Verify data is loaded before export
- Try using "Print" button as alternative
- Clear browser cache

**Session Expired**
```
Error: Session expired, please login again
```
**Solution:**
- Normal after 30 min inactivity or 7 days
- Simply re-login
- Check backend JWT_EXPIRE setting

### Performance Issues

**Slow Hasil Calculation**
```
Hasil page takes long to load
```
**Solution:**
- Caching is enabled (60s default)
- Increase `HASIL_CACHE_TTL_MS` in backend
- Check Supabase query performance
- Verify indexes are created

**PDF Export Slow/Large**
```
PDF file size > 5MB
```
**Solution:**
- Use "Export PDF" (vector text) instead of image-based
- Reduce table data if possible
- Vector PDF typically < 100KB

## 📝 Catatan Pengembang

### Arsitektur Layered

Sistem mengikuti pola **Layered Architecture** dengan separation of concerns:

```
┌─────────────────────────────────────┐
│         Controller Layer            │  ← HTTP Request/Response
│  (KandidatController, dll)          │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         Service Layer               │  ← Business Logic & Validation
│  (KandidatService, WaspasService)   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         Repository Layer            │  ← Database Access
│  (KandidatRepository, dll)          │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│         Database                    │  ← Supabase PostgreSQL
│  (kandidat, kriteria, penilaian)    │
└─────────────────────────────────────┘
```

**Keuntungan:**
- ✅ Separation of concerns
- ✅ Easy to test & maintain
- ✅ Business logic terisolasi
- ✅ Database queries centralized

### Validasi Input

Semua input divalidasi di **Service Layer** sebelum masuk database:

```javascript
// Contoh validasi di KandidatService
validateKandidat(data) {
  if (!data.nama?.trim()) {
    throw new Error('Nama kandidat harus diisi');
  }
  if (data.usia < 17 || data.usia > 60) {
    throw new Error('Usia harus antara 17-60 tahun');
  }
}
```

### Error Handling

Semua error ditangani dengan konsisten:

**Success Response:**
```json
{
  "status": "success",
  "data": {...}
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Pesan error deskriptif"
}
```

### Performance Optimization

**1. Database Indexes**
```sql
CREATE INDEX idx_penilaian_kandidat ON penilaian(kandidat_id);
CREATE INDEX idx_penilaian_kriteria ON penilaian(kriteria_id);
```

**2. Query Optimization**
- Prefetch all penilaian in one query
- Build maps for O(1) lookup
- Eliminate N+1 query problem

**3. Caching**
```javascript
// In-memory cache for /api/hasil
const cache = {
  data: null,
  timestamp: null,
  ttl: process.env.HASIL_CACHE_TTL_MS || 60000
};
```

**4. Frontend Optimization**
- React.memo for expensive components
- useMemo/useCallback for computed values
- Debounce search inputs
- Lazy loading for modals

### Code Standards

**Backend:**
- ES6+ syntax
- Async/await over callbacks
- Descriptive variable names
- JSDoc comments for complex functions

**Frontend:**
- Functional components with hooks
- CSS modules or scoped CSS
- Accessibility (ARIA labels, semantic HTML)

### Security Best Practices

✅ **Implemented:**
- JWT token authentication
- Password hashing with bcryptjs
- SQL injection prevention (parameterized queries)
- CORS configuration
- Input validation & sanitization
- Session expiry & cleanup
- Protected routes

⚠️ **Recommendations untuk Production:**
- Rate limiting (express-rate-limit)
- HTTPS only
- Environment-specific secrets
- Regular security audits
- Database backups
- Monitoring & logging (Winston, Sentry)

## 📁 Struktur Folder

```
SPK-WASPAS/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── supabase.js
│   │   ├── database/
│   │   │   └── db.js
│   │   ├── repository/
│   │   │   ├── KandidatRepository.js
│   │   │   ├── KriteriaRepository.js
│   │   │   ├── PenilaianRepository.js
│   │   │   ├── UserRepository.js
│   │   │   └── SessionRepository.js
│   │   ├── service/
│   │   │   ├── KandidatService.js
│   │   │   ├── KriteriaService.js
│   │   │   ├── PenilaianService.js
│   │   │   ├── WaspasService.js
│   │   │   ├── AuthService.js
│   │   │   └── SessionService.js
│   │   ├── controller/
│   │   │   ├── KandidatController.js
│   │   │   ├── KriteriController.js
│   │   │   ├── PenilaianController.js
│   │   │   ├── WaspasController.js
│   │   │   └── AuthController.js
│   │   ├── routes/
│   │   │   ├── kandidat.js
│   │   │   ├── kriteria.js
│   │   │   ├── penilaian.js
│   │   │   ├── hasil.js
│   │   │   └── auth.js
│   │   ├── middleware/
│   │   │   └── jwt.js
│   │   ├── tools/
│   │   │   ├── runSupabaseMigrations.js
│   │   │   └── seedSupabase.js
│   │   └── index.js
│   ├── supabase/
│   │   └── migrations/
│   │       └── 001_init_schema.sql
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Form.jsx & Form.css
│   │   │   ├── Table.jsx & Table.css
│   │   │   ├── HeaderBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx & LoginPage.css
│   │   │   ├── Dashboard.jsx
│   │   │   ├── KandidatPage.jsx
│   │   │   ├── KriteriaPage.jsx
│   │   │   ├── PenilaianPage.jsx
│   │   │   ├── HasilPage.jsx & HasilPage.css
│   │   │   └── CRUD.css
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── services/
│   │   │   ├── apiService.js
│   │   │   └── authService.js
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   ├── useApi.js
│   │   │   └── useAuth.js
│   │   ├── App.jsx & App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── APPLY_MIGRATIONS.md
│   ├── MIGRATION_SUPABASE.md
│   └── SUPABASE_STATUS.md
├── .gitignore
└── README.md
```

### Database tidak terbuat
- Check Supabase connection string
- Apply migrations via Supabase SQL Editor
- See `APPLY_MIGRATIONS.md` for details

### CORS Error
- Pastikan `CORS_ORIGIN` di `.env` backend sesuai URL frontend
- No trailing slash in URL
- Restart backend server

### API tidak merespons
- Cek apakah backend server berjalan di port 5000
- Check `http://localhost:5000/api/health`
- Verify Supabase connection
- Lihat log di terminal backend

## 📚 Referensi

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- [WASPAS Method Paper](https://www.researchgate.net/publication/261363832_Optimization_of_Weighted_Aggregated_Sum_Product_Assessment)
- [JWT Best Practices](https://jwt.io/introduction)

## 👨‍💻 Kontribusi

Kontribusi sangat diterima! Untuk kontribusi:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

**Guidelines:**
- Follow existing code style
- Add tests untuk fitur baru
- Update documentation
- Descriptive commit messages

## 📄 Lisensi

MIT License

Copyright (c) 2025 SPK WASPAS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 📧 Kontak & Support

**Developer:** Toha Syafin Gi  
**Repository:** [github.com/tohasyafingi/SPK-WASPAS](https://github.com/tohasyafingi/SPK-WASPAS)

Untuk pertanyaan, bug reports, atau feature requests:
- 📫 Buat issue di GitHub
- 💬 Discussion tab di repository
- 📧 Email: [your-email@example.com]

## 🙏 Acknowledgments

- Pondok Pesantren yang telah menjadi inspirasi sistem ini
- Tim pengembang dan kontributor
- Komunitas open source

---

**Dikembangkan dengan ❤️ untuk Sistem Pendukung Keputusan Pemilihan Lurah Pondok Pesantren**

*Last Updated: December 30, 2025*
