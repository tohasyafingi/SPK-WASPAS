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

Untuk monorepo dengan backend (Node.js) + frontend (React), Railway support:

### ✅ Recommended: Separate Services (Satu project, 2 services)
- Satu GitHub repository dengan `backend/` dan `frontend/`
- Satu Railway project dengan 2 services terpisah
- Setiap service dengan konfigurasi sendiri (root dir, build cmd, start cmd)
- Lebih mudah untuk scale dan monitor

**Kami gunakan: Approach ini** ✅

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

Di Railway dashboard setelah deploy otomatis mendeteksi:

1. **Klik "New Service" → Add from GitHub**
   - Pilih `SPK-WASPAS` repository
   - Railway akan tanya template, pilih `Node.js`

2. **Settings → Deploy**
   - Root Directory: `backend` ⭐ PENTING
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Port: `5000`

3. **Settings → Variables**
   - PORT: `5000`
   - NODE_ENV: `production`
   - JWT_SECRET: [generate random string 32+ chars]
   - CORS_ORIGIN: [akan update setelah frontend deploy]
   - DB_PATH: `/data/spk_waspas.db`

Backend siap! Railway akan auto-build & deploy.

### Step 4: Konfigurasi Frontend Service

Tambah service baru untuk frontend:

1. **New Service → Add from GitHub**
   - Pilih `SPK-WASPAS` repository (sama)
   - Railway akan tanya template, pilih `Node.js` (walaupun React)

2. **Settings → Deploy**
   - Root Directory: `frontend` ⭐ PENTING
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Port: `3000`

3. **Settings → Variables**
   - REACT_APP_API_URL: `https://[backend-service-name].railway.app/api`
   - (Ganti [backend-service-name] dengan nama service backend di Railway)

Frontend siap! Railway akan auto-build & deploy.

### Step 6: Setup First User

**Method 1: Railway Shell** (Recommended)
```bash
# Di Railway Backend service
# Klik "Shell" tab → run:
node railway-setup.js

# Tunggu hingga selesai, akan create admin & user
```

**Method 2: Manual via Node Script**
```bash
cd backend
node create-users.js
```

Setelah selesai, demo credentials:
```
Admin:  admin / admin123
User:   user  / user123
```

⚠️ **CHANGE PASSWORDS IMMEDIATELY IN PRODUCTION!**

---

## 📊 Railway Services Configuration Summary

Setelah semua setup, Railway project Anda akan terlihat:

```
Railway Project: SPK-WASPAS
├── Service 1: spk-backend
│   ├─ Status: Running ✅
│   ├─ URL: https://spk-backend-xxx.railway.app
│   ├─ Port: 5000
│   ├─ Root Dir: backend/
│   ├─ Env: NODE_ENV=production, JWT_SECRET=..., etc
│   └─ DB: SQLite /data/spk_waspas.db
│
└── Service 2: spk-frontend
    ├─ Status: Running ✅
    ├─ URL: https://spk-frontend-xxx.railway.app
    ├─ Port: 3000
    ├─ Root Dir: frontend/
    ├─ Env: REACT_APP_API_URL=https://spk-backend-xxx.railway.app/api
    └─ Build: npm install && npm run build
```

---

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

