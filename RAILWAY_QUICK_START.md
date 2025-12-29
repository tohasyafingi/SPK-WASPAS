# 🚀 Quick Deploy to Railway

## Prerequisites
- GitHub akun dengan repository `SPK-WASPAS`
- Railway akun (https://railway.app)

## 10 Menit Setup (2 Services Manual)

### Step 1: Push ke GitHub
```powershell
cd SPK-WASPAS
git push origin main
```

### Step 2: Buat Railway Project
1. Login ke https://railway.app
2. Klik **New Project**
3. Pilih **Deploy from GitHub**
4. Authorize → Pilih repository `SPK-WASPAS`
5. Klik **Deploy Now**

⚠️ Abaikan error "could not determine how to build" - akan kita fix dengan setup service manual

### Step 3: Setup Backend Service (Manual)

Di Railway Dashboard:

1. Klik **"+ New Service"** → **Add Service from GitHub**
2. Pilih `SPK-WASPAS` repository
3. Template: **Node.js**
4. **Settings → Deploy:**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Port: `5000`

5. **Settings → Variables:**
   ```
   PORT=5000
   NODE_ENV=production
   JWT_SECRET=[run: openssl rand -base64 32]
   DB_PATH=/data/spk_waspas.db
   CORS_ORIGIN=[update di step 5]
   ```

### Step 4: Setup Frontend Service (Manual)

1. **"+ New Service"** → **Add Service from GitHub**
2. Pilih `SPK-WASPAS` repository (sama)
3. Template: **Node.js**
4. **Settings → Deploy:**
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Port: `3000`

5. **Settings → Variables:**
   ```
   REACT_APP_API_URL=https://[backend-domain-dari-step-3].railway.app/api
   ```

### Step 5: Update Backend CORS

Backend service → Settings → Variables:
- Edit `CORS_ORIGIN` = `https://[frontend-domain].railway.app`
- Save (auto-redeploy)

### Step 6: Setup Users

Backend service → Shell tab:
```bash
node railway-setup.js
```

### Step 7: Test & Done! 🎉

- Frontend: `https://[frontend-domain].railway.app`
- Login: `admin` / `admin123`
- Change password immediately!

---

## Troubleshooting

**Build failed saat "Deploy from GitHub"?**
- Normal! Railway tidak bisa auto-detect monorepo
- Solution: Buat service manual (Step 3-4)
- Logs akan show "Railpack could not determine how to build" - IGNORE

**Backend service gagal start?**
- Check Logs tab
- Verify Root Directory = `backend/`
- Verify `npm start` works locally: `cd backend && npm start`

**Frontend blank/error?**
- Check browser console (F12) untuk API errors
- Verify `REACT_APP_API_URL` correct
- Test backend: `curl https://[backend-domain].railway.app/api/health`

**Can't login?**
- Run: `node railway-setup.js` di Backend Shell
- Check JWT_SECRET set di variables
- Verify user exist

**CORS error?**
- Check backend `CORS_ORIGIN` variable match frontend URL exactly
- Redeploy backend setelah update

---

## ℹ️ Useful Links

- **Full Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Checklist**: [RAILWAY_DEPLOYMENT_CHECKLIST.md](RAILWAY_DEPLOYMENT_CHECKLIST.md)
