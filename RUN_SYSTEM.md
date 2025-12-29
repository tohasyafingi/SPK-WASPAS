# 🚀 MULAI DI SINI - RUN YOUR SYSTEM

**Sistem SPK WASPAS siap untuk dijalankan!**

---

## ⚡ QUICK START (3 LANGKAH)

### Langkah 1: Buka PowerShell / CMD - Terminal Pertama
```powershell
cd backend
npm install
npm start
```

**Output yang diharapkan:**
```
Server running on port 5000
Database initialized
Ready to accept requests
```

**JANGAN tutup terminal ini!** ✅

---

### Langkah 2: Buka PowerShell / CMD - Terminal KEDUA (BARU)
```powershell
cd frontend
npm install
npm start
```

**Output yang diharapkan:**
```
Compiled successfully!
You can now view app in the browser.
Local: http://localhost:3000
```

Browser akan otomatis membuka `http://localhost:3000` ✅

---

### Langkah 3: Gunakan Sistem
Sekarang aplikasi sudah berjalan!

1. **Menu Kriteria** → Buat 3 kriteria
2. **Menu Kandidat** → Buat 3 kandidat  
3. **Menu Penilaian** → Isi penilaian
4. **Menu Hasil** → Lihat ranking

Selesai! 🎉

---

## 📋 QUICK START TABLE

| Langkah | Command | Terminal |
|---------|---------|----------|
| 1 | `cd backend` | Pertama |
| 2 | `npm install` | Pertama |
| 3 | `npm start` | Pertama (JANGAN TUTUP) |
| 4 | `cd frontend` | Baru (Terminal 2) |
| 5 | `npm install` | Terminal 2 |
| 6 | `npm start` | Terminal 2 |
| 7 | Buka browser | `http://localhost:3000` |

---

## 🎯 APA YANG TERJADI

### Terminal Pertama (Backend)
```
✓ Database created
✓ Server listening on port 5000
✓ CORS enabled
✓ Routes loaded
✓ Ready for API calls
```

### Terminal Kedua (Frontend)
```
✓ React compiled
✓ Listening on port 3000
✓ Auto-open browser
✓ Ready to use
```

### Browser
```
✓ Dashboard loaded
✓ Navbar visible
✓ Navigation working
✓ Ready for input
```

---

## ✅ VERIFIKASI SISTEM BERJALAN

### Test Backend
1. Buka browser
2. Kunjungi: `http://localhost:5000/api/health`
3. Seharusnya muncul:
```json
{
  "status": "ok",
  "timestamp": "2025-12-18T10:00:00Z"
}
```

### Test Frontend
1. Kunjungi: `http://localhost:3000`
2. Seharusnya muncul dashboard dengan menu:
   - Kriteria
   - Kandidat
   - Penilaian
   - Hasil

✅ Jika keduanya berjalan = **SISTEM OK!**

---

## 📚 DOKUMENTASI NEXT STEPS

Setelah sistem berjalan, baca:

1. **[START_HERE.md](START_HERE.md)** - Panduan awal
2. **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Contoh lengkap
3. **[README.md](README.md)** - Dokumentasi lengkap

---

## 🐛 TROUBLESHOOTING CEPAT

### ❌ "npm: command not found"
**Solusi**: Install Node.js dari https://nodejs.org
- Download LTS version
- Install dengan default settings
- Restart terminal

### ❌ "Port 5000 already in use"
**Solusi**: 
```powershell
# Terminal baru, cari process di port 5000
Get-NetTCPConnection -LocalPort 5000
# Atau restart komputer
```

### ❌ "Frontend tidak connect ke backend"
**Solusi**:
- Pastikan backend running di terminal pertama
- Cek terminal backend - ada error?
- Refresh browser (Ctrl+R)

### ❌ "Database error"
**Solusi**:
- Hapus folder `backend/src/database/spk.db`
- Restart backend server
- Database akan dibuat ulang

### ❌ "npm install gagal"
**Solusi**:
```powershell
# Clear npm cache
npm cache clean --force
# Hapus node_modules
Remove-Item -Recurse -Force node_modules
# Install ulang
npm install
```

---

## 🎓 WORKFLOW SETELAH STARTUP

### 1. Buat Kriteria (2 menit)
- Klik menu **Kriteria**
- Klik **+ Tambah Kriteria**
- Isi form:
  - Nama: "Kejujuran" 
  - Bobot: 0.4
  - Tipe: Benefit
- Klik **Simpan**
- Repeat untuk 2 kriteria lainnya

### 2. Buat Kandidat (2 menit)
- Klik menu **Kandidat**
- Klik **+ Tambah Kandidat**
- Isi form lengkap
- Klik **Simpan**
- Repeat untuk 3+ kandidat

### 3. Input Penilaian (5 menit)
- Klik menu **Penilaian**
- Tabel tampil pivot (baris: kandidat, kolom: kriteria)
- Klik **Edit** pada baris kandidat untuk ubah semua nilai sekaligus (modal)
- Input nilai sesuai skala kriteria (1-10, 1-100, %, jumlah)

### 4. Lihat Hasil (1 menit)
- Klik menu **Hasil**
- Lihat ranking otomatis
- Klik kandidat untuk detail perhitungan

✅ Done! System berhasil! 🎉

---

## 🌐 AKSES SISTEM

Setelah running, akses di:

| Item | URL |
|------|-----|
| Frontend App | `http://localhost:3000` |
| Backend API | `http://localhost:5000/api` |
| Health Check | `http://localhost:5000/api/health` |
| Database | `backend/src/database/spk.db` |

---

## ⏸️ STOP SISTEM

**Untuk menghentikan:**

```powershell
# Terminal pertama (Backend)
Ctrl+C

# Terminal kedua (Frontend)  
Ctrl+C
```

**Untuk restart:**
- Ulangi langkah di **Quick Start**

---

## 💡 TIPS & TRICKS

✅ **Buat data dummy lebih cepat** di `/INSTALLATION_GUIDE.md`  
✅ **Lihat API detail** di `/README.md` → API section  
✅ **Troubleshooting** di `/INSTALLATION_GUIDE.md` → Troubleshooting  
✅ **Backend code** di `backend/src/`  
✅ **Frontend code** di `frontend/src/`  

---

## 📞 PERLU BANTUAN?

1. Baca **[INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md)** - Troubleshooting
2. Baca **[START_HERE.md](START_HERE.md)** - FAQ
3. Cek browser console (F12)
4. Cek terminal logs (error messages)

---

## 🎯 SUMMARY

| Langkah | Command | Waktu |
|---------|---------|-------|
| Backend Setup | `cd backend && npm install && npm start` | 5 min |
| Frontend Setup | `cd frontend && npm install && npm start` | 5 min |
| Verifikasi | Buka `http://localhost:3000` | 1 min |
| Total | - | **~11 minutes** |

---

## ✨ SISTEM READY!

```
┌─────────────────────────────────────┐
│  ✅ Backend: Running on port 5000   │
│  ✅ Frontend: Running on port 3000  │
│  ✅ Database: SQLite initialized    │
│  ✅ API: 20+ endpoints ready        │
│  ✅ UI: Responsive & interactive    │
└─────────────────────────────────────┘
         🚀 READY TO USE! 🚀
```

---

## 🎉 SELAMAT!

Sistem SPK WASPAS Anda sudah aktif dan siap digunakan!

### Langkah Berikutnya:
1. ✅ Baca **[START_HERE.md](START_HERE.md)**
2. ✅ Ikuti workflow di bagian **WORKFLOW SETELAH STARTUP**
3. ✅ Input data contoh
4. ✅ Lihat hasil ranking

---

**Enjoy your SPK WASPAS System! 🚀**

---

**Last Updated**: December 29, 2025  
**Version**: 1.0.0 FINAL  
**Status**: ✅ PRODUCTION READY

---

**Mulai sekarang!** 👉 **Terminal pertama: `cd backend; npm install; npm start`**
