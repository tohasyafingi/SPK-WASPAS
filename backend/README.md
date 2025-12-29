# Backend - SPK WASPAS

Express.js Backend untuk Sistem Pendukung Keputusan WASPAS dengan autentikasi JWT, normalisasi bobot otomatis, dan dukungan skala kriteria.

## 📦 Setup

```powershell
# dari folder backend
npm install

# run production
npm start

# atau development (auto-reload)
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 📁 Struktur Folder

```
src/
├── config/
│   └── database.js          # Database configuration
├── database/
│   └── db.js                # Database initialization & connection
├── repository/
│   ├── KandidatRepository.js   # Data access layer untuk Kandidat
│   ├── KriteriaRepository.js   # Data access layer untuk Kriteria
│   └── PenilaianRepository.js  # Data access layer untuk Penilaian
├── service/
│   ├── KandidatService.js      # Business logic untuk Kandidat
│   ├── KriteriaService.js      # Business logic untuk Kriteria
│   ├── PenilaianService.js     # Business logic untuk Penilaian
│   └── WaspasService.js        # Business logic untuk WASPAS
├── controller/
│   ├── KandidatController.js   # HTTP handlers untuk Kandidat
│   ├── KriteriController.js    # HTTP handlers untuk Kriteria
│   ├── PenilaianController.js  # HTTP handlers untuk Penilaian
│   └── WaspasController.js     # HTTP handlers untuk WASPAS
├── routes/
│   ├── kandidat.js             # Routes untuk Kandidat
│   ├── kriteria.js             # Routes untuk Kriteria
│   ├── penilaian.js            # Routes untuk Penilaian
│   └── hasil.js                # Routes untuk WASPAS Hasil
└── index.js                 # Main Express app
```

## 🏗️ Layered Architecture

### 1. Controller Layer
- Menangani HTTP requests
- Parsing request body
- Memanggil Service layer
- Return HTTP response

### 2. Service Layer
- Business logic
- Data validation
- Error handling
- Orchestration

### 3. Repository Layer
- Database operations
- Query execution
- Data abstraction

### 4. Database Layer
- SQLite connection
- Schema initialization
- Query execution

## 📊 Database Schema

### Kandidat Table
```javascript
{
  id: INTEGER PRIMARY KEY,
  nama: TEXT NOT NULL,
  asal_kamar: TEXT NOT NULL,
  usia: INTEGER NOT NULL,
  masa_tinggal: INTEGER NOT NULL,
  keterangan: TEXT,
  created_at: DATETIME,
  updated_at: DATETIME
}
```

### Kriteria Table
```javascript
{
  id: INTEGER PRIMARY KEY,
  nama_kriteria: TEXT NOT NULL UNIQUE,
   bobot: REAL NOT NULL (0 < bobot <= 1),
  tipe: TEXT NOT NULL ('benefit' | 'cost'),
   skala: TEXT NOT NULL ('1-10' | '1-100' | 'persen' | 'jumlah') DEFAULT '1-10',
  created_at: DATETIME,
  updated_at: DATETIME
}
```

### Penilaian Table
```javascript
{
  id: INTEGER PRIMARY KEY,
  kandidat_id: INTEGER NOT NULL (FK),
  kriteria_id: INTEGER NOT NULL (FK),
  nilai: REAL NOT NULL,
  created_at: DATETIME,
  updated_at: DATETIME,
  UNIQUE(kandidat_id, kriteria_id)
}
```

### Users Table (Auth)
```javascript
{
   id: INTEGER PRIMARY KEY,
   username: TEXT NOT NULL UNIQUE,
   password: TEXT NOT NULL,
   email: TEXT,
   nama_lengkap: TEXT,
   is_active: INTEGER DEFAULT 1,
   last_login: DATETIME,
   created_at: DATETIME,
   updated_at: DATETIME
}
```

## 🔄 Request/Response Flow

```
1. Client sends HTTP Request
   ↓
2. Express Router matches endpoint
   ↓
3. Controller receives request
   ↓
4. Service processes business logic
   ↓
5. Repository accesses database
   ↓
6. Database returns data
   ↓
7. Service returns result
   ↓
8. Controller sends HTTP Response
   ↓
9. Client receives response
```

## 📡 API Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Optional message",
  "data": {}
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

## ⚙️ Environment Variables

```env
PORT=5000                          # Server port
NODE_ENV=development               # Environment
DB_PATH=./src/database/spk.db      # Database file path
CORS_ORIGIN=http://localhost:3000  # CORS origin
JWT_SECRET=change-this-in-production  # Secret untuk JWT
```

## 🧮 WASPAS Algorithm

### Normalisasi
```javascript
// Benefit: nilai / max_nilai
// Cost: min_nilai / nilai
```

### WSM (Weighted Sum Model)
```javascript
WSM = Σ(bobot × nilai_normalisasi)
```

### WPM (Weighted Product Model)
```javascript
WPM = Π(nilai_normalisasi ^ bobot)
```

### Agregasi WASPAS
```javascript
Qi = 0.5 × WSM + 0.5 × WPM
```

### Ranking
```javascript
Sort by Qi (descending)
```

### Catatan Bobot
- Input bobot pada tabel kriteria harus berada pada rentang 0 < bobot ≤ 1 (sesuai constraint DB)
- Sistem akan menormalkan bobot secara otomatis sehingga Σ w = 1 sebelum perhitungan WSM/WPM

## 🚀 Development Tips

1. **Hot Reload**: Gunakan `npm run dev` untuk auto-restart
2. **Logging**: Semua request di-log di console
3. **Error Handling**: Gunakan try-catch di Service layer
4. **Validation**: Validasi dilakukan di Service layer

## 🧪 Testing dengan cURL

```bash
# Health check
curl http://localhost:5000/api/health

# Get semua kandidat
curl http://localhost:5000/api/kandidat

# Create kandidat
curl -X POST http://localhost:5000/api/kandidat \
  -H "Content-Type: application/json" \
  -d '{"nama":"Test","asal_kamar":"Kamar 1","usia":20,"masa_tinggal":2}'

# Get semua kriteria
curl http://localhost:5000/api/kriteria

# Create kriteria
curl -X POST http://localhost:5000/api/kriteria \
  -H "Content-Type: application/json" \
  -d '{"nama_kriteria":"Kriteria 1","bobot":0.5,"tipe":"benefit"}'

# Get hasil ranking
curl http://localhost:5000/api/hasil
```

### Auth Endpoints (JWT)
```bash
# Login (public)
curl -X POST http://localhost:5000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"username":"admin","password":"admin123"}'

# With token (ganti <TOKEN>)
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer <TOKEN>"
```

Quick setup akun demo (pilih salah satu):
```powershell
# Python (paling mudah)
cd backend; python init-db.py

# Node.js script
cd backend; node create-users.js

# Seed awal (opsional, isi sampel)
cd backend; node seed.js
```

## 📝 Best Practices

- ✅ Separation of concerns (Controller, Service, Repository)
- ✅ Proper error handling
- ✅ Input validation at Service layer
- ✅ Database transactions untuk consistency
- ✅ RESTful API design
- ✅ CORS configuration
- ✅ Logging middleware

## 🐛 Troubleshooting

### Database Error
```
Error: database is locked
→ Restart server, pastikan hanya 1 instance yang berjalan
```

### CORS Error
```
Access-Control-Allow-Origin error
→ Update CORS_ORIGIN di .env sesuai frontend URL
```

### Validation Error
```
Pesan: "Bobot harus berupa angka antara 0 < bobot ≤ 1"
→ Pastikan input mengikuti format yang diharapkan
```

## 📚 Dependencies

- `express`: Web framework
- `sqlite3`: Database driver
- `sqlite`: Query builder
- `cors`: CORS middleware
- `dotenv`: Environment variables
 - `jsonwebtoken`: JWT handling
 - `bcryptjs`: Password hashing

## 🔐 Security Considerations

- Input validation di Service layer
- SQL injection protection via parameterized queries
- CORS configuration
- Error messages yang tidak membocorkan detail sistem

---

Dibuat dengan ❤️ menggunakan Express.js
