# 🚀 Quick Deploy to Railway

## Prerequisites
- GitHub akun dengan repository `SPK-WASPAS`
- Railway akun (https://railway.app)

## 5 Menit Deploy

### Step 1: Push ke GitHub
```powershell
cd SPK-WASPAS
git push origin main
```

### Step 2: Railway Dashboard
1. Login ke https://railway.app
2. Klik **New Project**
3. Pilih **Deploy from GitHub**
4. Authorize → Pilih `SPK-WASPAS`
5. Klik **Deploy Now**

### Step 3: Backend Environment Variables
Railway → Backend Service → Settings → Variables:
```
PORT=5000
NODE_ENV=production
JWT_SECRET=[generate random 32+ chars]
CORS_ORIGIN=https://[your-frontend-url].railway.app
DB_PATH=/data/spk_waspas.db
```

### Step 4: Frontend Environment Variables
Railway → Frontend Service → Settings → Variables:
```
REACT_APP_API_URL=https://[your-backend-url].railway.app/api
```

### Step 5: Setup First User
Railway → Backend Service → Shell tab:
```bash
node railway-setup.js
```

### Done! 🎉
- Backend: `https://[backend-name].railway.app`
- Frontend: `https://[frontend-name].railway.app`
- Login: `admin` / `admin123`

---

## Troubleshooting

**Build failed?**
- Check Logs tab in Railway
- Verify package.json exists in backend & frontend

**Can't login?**
- Run `node railway-setup.js` in Backend Shell
- Check logs for JWT errors

**Frontend can't reach backend?**
- Update `REACT_APP_API_URL` env var
- Rebuild frontend (trigger redeploy)

---

Lihat **[DEPLOYMENT.md](DEPLOYMENT.md)** untuk guide lengkap.
