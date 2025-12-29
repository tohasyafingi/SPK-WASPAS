# ✅ Railway Deployment Checklist

## Pre-Deployment

- [x] Code committed & pushed to GitHub
- [x] .env.example files created for backend & frontend
- [x] package.json updated with engines & build scripts
- [x] Procfile configured
- [x] railway.json config files created
- [x] railway-setup.js script ready
- [x] .gitignore properly configured
- [x] DEPLOYMENT.md documentation complete

## Railway Setup

- [ ] GitHub repository connected to Railway
- [ ] Backend service created & builds successfully
- [ ] Frontend service created & builds successfully
- [ ] Backend environment variables set:
  - [ ] PORT=5000
  - [ ] NODE_ENV=production
  - [ ] JWT_SECRET=[random 32+ chars]
  - [ ] CORS_ORIGIN=https://[frontend-url].railway.app
  - [ ] DB_PATH=/data/spk_waspas.db
- [ ] Frontend environment variables set:
  - [ ] REACT_APP_API_URL=https://[backend-url].railway.app/api
- [ ] Database initialized (run railway-setup.js)
- [ ] First user created (admin/admin123)

## Testing

- [ ] Backend health check: `https://[backend-url].railway.app/api/health`
- [ ] Frontend loads: `https://[frontend-url].railway.app`
- [ ] Can login with admin/admin123
- [ ] Can access dashboard
- [ ] Can create kriteria
- [ ] Can create kandidat
- [ ] Can input penilaian
- [ ] Can view hasil ranking

## Post-Deployment

- [ ] Change admin password (production)
- [ ] Change default user password (production)
- [ ] Setup custom domains (optional)
- [ ] Setup monitoring/alerting
- [ ] Backup database (if using PostgreSQL)
- [ ] Document admin credentials securely

## Optional Enhancements

- [ ] Switch to PostgreSQL (more production-ready)
- [ ] Setup custom domain
- [ ] Enable HTTPS (Railway does this auto)
- [ ] Setup CI/CD pipeline (GitHub Actions)
- [ ] Add monitoring (Railway Metrics)
- [ ] Setup automated backups

---

## Quick Commands

```powershell
# Test backend health
curl https://[backend-url].railway.app/api/health

# Initialize database with setup script
# (Run in Railway Backend service Shell tab)
node railway-setup.js

# View logs
# (Check Logs tab in Railway dashboard)
```

---

## Support

- Documentasi: [DEPLOYMENT.md](DEPLOYMENT.md)
- Quick Start: [RAILWAY_QUICK_START.md](RAILWAY_QUICK_START.md)
- Railway Docs: https://docs.railway.app

