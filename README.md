# SPK WASPAS - Sistem Pendukung Keputusan Pemilihan Lurah Pondok Pesantren

Sistem informasi berbasis web untuk mendukung pengambilan keputusan pemilihan Lurah Pondok Pesantren menggunakan metode **WASPAS (Weighted Aggregated Sum Product Assessment)**. Sistem mencakup autentikasi JWT, tampilan penilaian pivot, form CRUD berbasis modal, dukungan skala kriteria, dan normalisasi bobot otomatis.

## 📋 Daftar Isi

- [Stack Teknologi](#stack-teknologi)
- [Fitur Utama](#fitur-utama)
- [Instalasi](#instalasi)
- [Menjalankan Sistem](#menjalankan-sistem)
- [Struktur Database](#struktur-database)
- [API Documentation](#api-documentation)
- [Metode WASPAS](#metode-waspas)
- [Autentikasi](#autentikasi)
- [Lisensi](#lisensi)

## 🛠️ Stack Teknologi

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Architecture**: Layered Architecture (Controller, Service, Repository)

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Fetch API
- **Styling**: CSS3 (sticky header/sidebar, tabel responsif)

## ✨ Fitur Utama

### 1. Manajemen Kandidat
- ✅ Create, Read, Update, Delete (CRUD) data calon Lurah
- ✅ Validasi input (nama, asal kamar, usia, masa tinggal)
- ✅ Tampilan daftar kandidat responsif

### 2. Manajemen Kriteria
- ✅ CRUD kriteria penilaian
- ✅ Pengaturan bobot kriteria (0-1, dinormalisasi otomatis saat perhitungan)
- ✅ Tipe kriteria: Benefit atau Cost
- ✅ Skala kriteria: 1-10, 1-100, persen, jumlah (mengarahkan placeholder, batas nilai, dan langkah input)
- ✅ Pengecekan duplikasi kriteria

### 3. Manajemen Penilaian
- ✅ Input penilaian kandidat untuk setiap kriteria
- ✅ Validasi data penilaian, batas nilai sesuai skala kriteria
- ✅ Tampilan penilaian format pivot (baris: kandidat, kolom: kriteria)
- ✅ Edit massal penilaian per kandidat via modal
- ✅ Kolom numerik rata tengah

### 4. Perhitungan WASPAS
- ✅ Normalisasi nilai otomatis
- ✅ Kalkulasi WSM (Weighted Sum Model)
- ✅ Kalkulasi WPM (Weighted Product Model)
- ✅ Agregasi hasil dengan formula WASPAS
- ✅ Normalisasi bobot (Σ w = 1) sebelum perhitungan

### 5. Hasil dan Ranking
- ✅ Tampilan ranking kandidat berdasarkan nilai Qi
- ✅ Visualisasi peringkat dengan badge (🥇🥈🥉)
- ✅ Detail perhitungan per kandidat
- ✅ Statistik ringkas (total kandidat, pemenang, dll)
 - ✅ Kolom numerik (WSM, WPM, Qi, usia, masa tinggal) rata tengah

### 6. UX & Keamanan
- ✅ Semua form CRUD dalam modal (tambah/edit)
- ✅ Header sticky dan sidebar fixed
- ✅ Halaman dilindungi dengan ProtectedRoute (login diperlukan)

## 📦 Instalasi

### Prerequisites
- Node.js v14 atau lebih tinggi
- npm atau yarn
- Git (opsional)

### Clone Repository
```powershell
git clone <repository-url>
cd SPK-WASPAS
```

### Backend Setup

1. **Masuk ke folder backend**
```powershell
cd backend
```

2. **Install dependencies**
```powershell
npm install
```

3. **Buat file .env** (sudah tersedia sebagai template)
```
PORT=5000
NODE_ENV=development
DB_PATH=./src/database/spk.db
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=change-this-in-production
```

4. **Database akan dibuat otomatis** saat server pertama kali dijalankan

### Frontend Setup

1. **Masuk ke folder frontend**
```powershell
cd frontend
```

2. **Install dependencies**
```powershell
npm install
```

3. **Buat file .env.local** (opsional, jika backend tidak di localhost:5000)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Menjalankan Sistem

### Terminal 1: Jalankan Backend

```powershell
cd backend
npm install

# jalankan server
npm start

# development dengan auto-reload
npm run dev
```

Server backend akan berjalan di: **http://localhost:5000**

### Terminal 2: Jalankan Frontend

```powershell
cd frontend
npm install
npm start
```

Browser secara otomatis akan membuka aplikasi di: **http://localhost:3000**

## 📊 Struktur Database

### Tabel: Kandidat
```sql
CREATE TABLE kandidat (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  asal_kamar TEXT NOT NULL,
  usia INTEGER NOT NULL,
  masa_tinggal INTEGER NOT NULL,
  keterangan TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel: Kriteria
```sql
CREATE TABLE kriteria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_kriteria TEXT NOT NULL UNIQUE,
  bobot REAL NOT NULL CHECK(bobot > 0 AND bobot <= 1),
  tipe TEXT NOT NULL CHECK(tipe IN ('benefit', 'cost')),
  skala TEXT NOT NULL DEFAULT '1-10' CHECK(skala IN ('1-10','1-100','persen','jumlah')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabel: Penilaian
```sql
CREATE TABLE penilaian (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kandidat_id INTEGER NOT NULL,
  kriteria_id INTEGER NOT NULL,
  nilai REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kandidat_id) REFERENCES kandidat(id) ON DELETE CASCADE,
  FOREIGN KEY (kriteria_id) REFERENCES kriteria(id) ON DELETE CASCADE,
  UNIQUE(kandidat_id, kriteria_id)
);
```

## 📡 API Documentation

### Kandidat Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/kandidat` | Get semua kandidat |
| POST | `/api/kandidat` | Buat kandidat baru |
| GET | `/api/kandidat/:id` | Get kandidat by ID |
| PUT | `/api/kandidat/:id` | Update kandidat |
| DELETE | `/api/kandidat/:id` | Delete kandidat |

### Kriteria Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/kriteria` | Get semua kriteria |
| POST | `/api/kriteria` | Buat kriteria baru |
| GET | `/api/kriteria/:id` | Get kriteria by ID |
| PUT | `/api/kriteria/:id` | Update kriteria |
| DELETE | `/api/kriteria/:id` | Delete kriteria |

### Penilaian Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/penilaian` | Get semua penilaian |
| POST | `/api/penilaian` | Buat penilaian baru |
| GET | `/api/penilaian/:id` | Get penilaian by ID |
| PUT | `/api/penilaian/:id` | Update penilaian |
| DELETE | `/api/penilaian/:id` | Delete penilaian |
| GET | `/api/penilaian/kandidat/:kandidatId` | Get penilaian by kandidat |

### WASPAS Hasil Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/hasil` | Hitung dan dapatkan ranking WASPAS |
| GET | `/api/hasil/:kandidatId/detail` | Detail perhitungan kandidat |

### Health Check

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Check status server |

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
# Get semua kandidat
curl http://localhost:5000/api/kandidat

# Create kandidat baru
curl -X POST http://localhost:5000/api/kandidat \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Amin Santoso",
    "asal_kamar": "Kamar 5",
    "usia": 22,
    "masa_tinggal": 3,
    "keterangan": "Siswa aktif"
  }'

# Get hasil ranking
curl http://localhost:5000/api/hasil

# Login (JWT) dan cek profil
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
# gunakan token dari respons untuk memanggil endpoint protected
```

## 🔐 Autentikasi

- Login: `POST /api/auth/login` (username, password)
- Info user saat ini: `GET /api/auth/me` (header `Authorization: Bearer <token>`)
- Sessions, logout, ganti password tersedia; CRUD user untuk admin.

Quick setup akun demo:
```powershell
cd backend; python init-db.py
# atau
cd backend; node create-users.js
```

## 📝 Catatan Pengembang

### Arsitektur Layered

Sistem mengikuti pola Layered Architecture:
- **Controller**: Menerima request HTTP
- **Service**: Business logic dan validasi
- **Repository**: Akses data ke database

### Validasi Input

Semua input divalidasi di layer Service sebelum masuk database

### Error Handling

Semua error ditangani dengan konsisten:
```json
{
  "status": "error",
  "message": "Pesan error deskriptif"
}
```

## 🐛 Troubleshooting

### Database tidak terbuat
- Pastikan folder `backend/src/database/` writable
- Restart server backend

### CORS Error
- Pastikan `CORS_ORIGIN` di `.env` backend sesuai URL frontend
- Default: `http://localhost:3000`

### API tidak merespons
- Cek apakah backend server berjalan di port 5000
- Cek koneksi database
- Lihat log di terminal backend

## 📚 Referensi

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [WASPAS Method Paper](https://en.wikipedia.org/wiki/WASPAS)

## 👨‍💻 Kontribusi

Silakan buat pull request atau issue untuk perbaikan dan fitur baru.

## 📄 Lisensi

MIT License - Silakan gunakan untuk keperluan pendidikan dan komersial.

## 📧 Kontak

Untuk pertanyaan atau feedback, silakan hubungi developer.

---

**Dibuat dengan ❤️ untuk Sistem Pendukung Keputusan Pemilihan Lurah Pondok Pesantren**
