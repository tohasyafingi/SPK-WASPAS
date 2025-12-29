# ⚠️ Railway Setup - FIX UNTUK MONOREPO

## 🔴 Masalah Build:
```
npm: not found
```

**Penyebab:** Railway coba build di root folder (tidak ada Node.js setup di sana), bukan di `backend/` atau `frontend/`

---

## ✅ SOLUSI: Configure Services dengan Benar

### ❌ SALAH - Ini yang menyebabkan error:
1. Deploy from GitHub (auto-detect)
2. Railway coba build di root → gagal (tidak ada package.json yang executable)

### ✅ BENAR - Langkah yang harus dilakukan:

#### **OPSI A: Delete & Recreate Services (Paling Clean)**

1. **Di Railway Dashboard:**
   - Buka project `SPK-WASPAS`
   - Klik "Settings" → "Danger Zone"
   - Delete semua services yang gagal
   - Delete project jika perlu (start fresh)

2. **Create Backend Service (Baru):**
   - Dashboard → **"+ New Service"** → **"Add Service from GitHub"**
   - Authorize & Select `SPK-WASPAS` repo
   - **PENTING:** Pada prompt "Select Template", pilih **"Node.js"**
   - Click "Create Service"
   
3. **Konfigurasi Backend (CRITICAL):**
   - Service terbuka di dashboard
   - Klik **"Settings"** tab (bukan "Deploy")
   - Cari **"Root Directory"** section
   - Ubah value menjadi: `backend` (tanpa slash)
   - Save
   
   - Scroll ke bawah, cari **"Build & Deploy"**:
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Port: `5000`
   - Save
   
   - Klik **"Variables"** tab:
     ```
     PORT=5000
     NODE_ENV=production
     JWT_SECRET=[GENERATE: openssl rand -base64 32]
     DB_PATH=/data/spk_waspas.db
     CORS_ORIGIN=[UPDATE SETELAH FRONTEND]
     ```
   - Save → Auto-redeploy with correct settings

4. **Create Frontend Service (Sama):**
   - Dashboard → **"+ New Service"** → **"Add Service from GitHub"**
   - Select `SPK-WASPAS` repo
   - Template: **"Node.js"**
   
5. **Konfigurasi Frontend:**
   - Settings tab:
     - **Root Directory:** `frontend` (CRITICAL!)
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Port: `3000`
   - Save
   
   - Variables tab:
     ```
     REACT_APP_API_URL=https://[backend-service-name].railway.app/api
     ```
   - Save

6. **Update Backend CORS (setelah frontend domain tahu):**
   - Kembali ke Backend service
   - Variables tab
   - Edit `CORS_ORIGIN` = `https://[frontend-service-name].railway.app`
   - Save → Auto-redeploy

7. **Test:**
   - Buka frontend URL di browser
   - Login: `admin` / `admin123` (run `node railway-setup.js` di backend shell jika user not exist)

---

#### **OPSI B: Jika Services Sudah Ada (Fix Existing)**

1. Buka Backend Service
2. **Settings** → **"Root Directory"** → set ke: `backend`
3. Save → Auto-redeploy
4. Repeat untuk Frontend dengan `frontend`

---

## 🔑 KEY POINTS

| Setting | Backend | Frontend |
|---------|---------|----------|
| **Root Directory** | `backend` | `frontend` |
| **Build Command** | `npm install` | `npm install && npm run build` |
| **Start Command** | `npm start` | `npm start` |
| **Port** | `5000` | `3000` |

⚠️ **Root Directory adalah PALING PENTING** - tanpa ini, Railway build di root → npm not found

---

## 🧪 Test Build

Setelah konfigurasi benar, di Railway dashboard:

1. Backend Service → **Logs** tab
   - Harus show: "✓ Database initialized" dan "listening on http://localhost:5000"
   
2. Frontend Service → **Logs** tab
   - Harus show: "Compiled successfully"

3. Health check:
   ```
   curl https://[backend-domain].railway.app/api/health
   ```

---

## 🔴 Jika Masih Error

1. **Verify Root Directory setting** (bukan build/deploy setting)
   - Settings tab → "Root Directory" field
   - Harus tepat `backend` atau `frontend`

2. **Check Logs** untuk error detail
   - Backend Logs tab → lihat build process
   - Frontend Logs tab → lihat build process

3. **Redeploy manually:**
   - Service → Menu (3 dots) → Redeploy

4. **Nuclear option** (jika semua gagal):
   - Delete service
   - Create new service dengan konfigurasi benar

---

## 📝 Summary

**Root Directory adalah SOLUSI:**
- Backend service: Root = `backend/`
- Frontend service: Root = `frontend/`
- Lalu Railway akan `cd` ke folder itu sebelum build

Tanpa ini, Railway build di root → tidak ada package.json → npm not found

