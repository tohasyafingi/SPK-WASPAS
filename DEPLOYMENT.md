# 🚀 Panduan Deploy ke Railway

Sistem SPK WASPAS siap untuk di-deploy ke Railway dengan mudah.

---

## 📋 Prerequisites

1. **Akun Railway** (daftar di https://railway.app)
2. **Git** sudah terinstal
3. **GitHub Repository** (connect Railway ke repo)
4. **Environment Variables** sudah dipahami

---

## 🏗️ Arsitektur Deployment Railway

Railway mendukung 2 pendekatan:

### ✅ Opsi 1: Monorepo (Rekomendasi)
- Satu repository dengan `backend/` dan `frontend/` folder
- Satu Railway project dengan 2 services
- Lebih mudah untuk maintain dan sync

### Opsi 2: Separate Repos
- Backend dan frontend di repository terpisah
- Railway project terpisah untuk masing-masing
- Lebih kompleks setup di awal

**Kami gunakan: Opsi 1 (Monorepo)** ✅

---

## 🎯 Langkah-Langkah Deploy

### Step 1: Siapkan Repository GitHub

```powershell
# Pastikan sudah di-commit dan push ke GitHub
cd SPK-WASPAS
git status
git push origin main
```

### Step 2: Connect Railway ke GitHub

1. Buka https://railway.app
2. Login dengan GitHub
3. Klik **New Project**
4. Pilih **Deploy from GitHub**
5. Authorize Railway untuk akses repository
6. Pilih repository `SPK-WASPAS`
7. Klik **Deploy Now**

Railway akan otomatis mendeteksi struktur monorepo.

### Step 3: Konfigurasi Backend Service

Di Railway dashboard:

1. **Settings → Environment**
   - Pastikan sudah ada environment variable:
     ```
     PORT=5000
     NODE_ENV=production
     JWT_SECRET=generate-random-key-here-min-32-chars
     CORS_ORIGIN=https://your-frontend-url.railway.app
     DB_PATH=/data/spk_waspas.db
     ```

2. **Deployment**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Port: `5000`

3. **PostgreSQL** (Optional - lebih production-ready)
   - Klik **+ Add Resource → PostgreSQL**
   - Gunakan **DATABASE_URL** environment variable

### Step 4: Konfigurasi Frontend Service

Di Railway dashboard:

1. **Settings → Environment**
   - REACT_APP_API_URL=`https://your-backend-url.railway.app/api`

2. **Build & Deploy**
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start` (atau custom server)
   - Port: `3000`

3. **Networking**
   - Domain: Railway auto-assign public URL
   - Update CORS_ORIGIN di backend dengan URL ini

### Step 5: Database Migration

Opsi 1: **SQLite** (Persisten di Railway)
```bash
# Railway sudah tahu DB_PATH=/data/spk_waspas.db
# Database akan dibuat otomatis saat startup
# Persisten via volume
```

Opsi 2: **PostgreSQL** (Recommended)
- Change backend code ke pg atau prisma
- Atau gunakan SQLite untuk MVP, upgrade later

### Step 6: Setup User Pertama

**Metode A: Railway Shell**
```bash
# Di Railway dashboard, buka Backend service
# Klik "Shell" tab
# Run:
node create-users.js
# atau
python init-db.py
```

**Metode B: Auto-seed via Node Script**
```bash
# Tambah ke backend/package.json:
"seed": "node seed-data.js"

# Di Railway, buat "Run" trigger untuk seed
```

**Metode C: API Call**
```bash
curl -X POST https://your-backend.railway.app/api/auth/users \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"admin"}'
```

---

## 🔐 Security Setup

### JWT Secret Generation

```powershell
# Generate random JWT_SECRET (32+ chars)
$secret = [System.Convert]::ToBase64String(([byte[]][char[]]"$(Get-Random -Count 32)")
Write-Host $secret

# atau gunakan openssl (jika tersedia)
openssl rand -base64 32
```

Masukkan value ini ke Railway environment variable `JWT_SECRET`.

### CORS Configuration

Update di Railway Backend environment:
```
CORS_ORIGIN=https://your-frontend-railway-url.railway.app
```

### SSL/HTTPS

Railway otomatis provide HTTPS untuk semua domain `.railway.app`.

---

## 📊 Database Options

### Option A: SQLite (Sekarang)

**Kelebihan:**
- Tidak perlu external database
- Setup simple
- Good untuk MVP

**Kekurangan:**
- Concurrent writes terbatas
- No horizontal scaling

**Setup:**
```env
DB_PATH=/data/spk_waspas.db
```

Railway akan mount `/data` folder sebagai persistent volume.

---

### Option B: PostgreSQL (Recommended untuk Production)

**Setup di Railway:**
1. New Resource → PostgreSQL
2. Copy CONNECTION_URL
3. Update backend .env:
   ```env
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```

**Code change needed:**
- Replace sqlite dengan `pg` package
- Update `db.js` untuk PostgreSQL connection

**Example:**
```javascript
import pkg from 'pg';
const { Client } = pkg;

const client = new Client(process.env.DATABASE_URL);
await client.connect();
```

---

## 🚨 Troubleshooting

### ❌ "Build failed"
- Cek logs di Railway dashboard
- Verify `package.json` di root folder
- Ensure Root Directory setting correct

### ❌ "Database not initializing"
- Railway `/data` folder must be writable
- Check permission dan error log
- Verify `DB_PATH` environment variable

### ❌ "Frontend can't reach backend"
- Verify `REACT_APP_API_URL` points ke correct backend URL
- Check CORS_ORIGIN di backend
- Rebuild frontend setelah update .env

### ❌ "Login not working"
- Verify JWT_SECRET set di backend
- Check user exist di database (via shell)
- Verify token format di frontend

---

## 📈 Monitoring & Logs

**Railway Dashboard:**
- Logs tab: lihat error dan startup message
- Deployments tab: history dan rollback
- Metrics tab: CPU, memory, requests

**Useful logs commands:**
```bash
# Di Railway Shell, check if users table exists
sqlite3 /data/spk_waspas.db ".tables"

# Check users records
sqlite3 /data/spk_waspas.db "SELECT * FROM users;"

# Test API
curl https://your-backend.railway.app/api/health
```

---

## 🔄 CI/CD & Auto-Deploy

Railway otomatis trigger deploy ketika:
- Push ke main branch
- PR merged ke main
- Redeploy dari dashboard

Untuk disable auto-deploy:
- Settings → Deployments → uncheck "Deploy on Push"

---

## 📝 Domain Configuration

### Custom Domain (Optional)

**Backend:**
1. Railway Settings → Domain
2. Add Custom Domain
3. Update DNS records (CNAME)
4. Update frontend `REACT_APP_API_URL`

**Frontend:**
1. Railway Settings → Domain
2. Add Custom Domain
3. Update DNS records (CNAME)

---

## 💾 Backup & Data

**SQLite Backup:**
```bash
# Di Railway shell
cp /data/spk_waspas.db /data/spk_waspas.db.bak

# Download via Railway file explorer
# atau setup automated backup ke S3
```

**PostgreSQL Backup:**
```bash
# Railway PostgreSQL automatically backup daily
# Restore via Railway dashboard if needed
```

---

## 🎯 Checklist Deploy

Sebelum go live:

- [ ] Repository di GitHub & Railway connected
- [ ] Backend environment variables lengkap (PORT, JWT_SECRET, CORS_ORIGIN, DB_PATH)
- [ ] Frontend environment variables lengkap (REACT_APP_API_URL)
- [ ] Database initialized & first user created
- [ ] Health check pass: `https://your-backend.railway.app/api/health`
- [ ] Frontend can login
- [ ] WASPAS calculation works
- [ ] SSL/HTTPS working
- [ ] Logs monitoring configured

---

## 🚀 Example: Full Deploy Summary

```
┌─────────────────────────────────────────┐
│ Railway Project: SPK-WASPAS             │
├─────────────────────────────────────────┤
│ Service 1: Backend                      │
│  - Root: backend/                       │
│  - URL: https://spk-backend.railway.app │
│  - Port: 5000                           │
│  - DB: SQLite /data/spk_waspas.db       │
├─────────────────────────────────────────┤
│ Service 2: Frontend                     │
│  - Root: frontend/                      │
│  - URL: https://spk-frontend.railway.app│
│  - Port: 3000                           │
│  - API: spk-backend.railway.app/api     │
├─────────────────────────────────────────┤
│ Status: ✅ LIVE                         │
│ Users: Can login & use system           │
│ Data: Persistent SQLite                 │
└─────────────────────────────────────────┘
```

---

## 📚 Referensi

- [Railway Documentation](https://docs.railway.app)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Railway Databases](https://docs.railway.app/databases)
- [Troubleshooting Railway Deployments](https://docs.railway.app/troubleshoot)

---

## 🆘 Support

Jika mengalami issue:

1. Check [Railway Logs](https://railway.app) → Logs tab
2. Verify environment variables
3. Test API manually dengan curl
4. Check GitHub Actions untuk build logs

---

**Selamat deploy ke Railway! 🎉**

