# 🎯 START HERE - Panduan Awal

Selamat datang di **SPK WASPAS** - Sistem Pendukung Keputusan Pemilihan Lurah Pondok Pesantren!

Panduan ini akan membimbing Anda langkah demi langkah. 🚀

---

## 📋 PERSYARATAN (Prasyarat)

Pastikan Anda sudah memiliki:
- ✅ **Node.js v14+** (https://nodejs.org/)
- ✅ **Terminal/Command Prompt**
- ✅ **Browser modern** (Chrome, Firefox, Safari, Edge)

**Cek instalasi Node.js:**
```bash
node --version
npm --version
```

Harus muncul versi, misal:
```
v18.12.1
8.19.2
```

---

## 🚀 LANGKAH 1: Buka Backend (5 menit)

### 1.1 Buka Terminal/Command Prompt
- **Windows**: Tekan `Win + R`, ketik `cmd`, Enter
- **Mac/Linux**: Buka Terminal

### 1.2 Masuk ke folder backend
```bash
cd "c:\Users\ThinkPad\Documents\SMT 7\SPK\Sistem\backend"
```

Atau jika Anda di folder yang berbeda:
```bash
cd Sistem/backend
```

### 1.3 Install dependencies
```bash
npm install
```

Tunggu sampai selesai (bisa 1-2 menit). Jika ada warning, abaikan.

### 1.4 Jalankan server
```bash
npm start
```

**Jika berhasil, akan terlihat:**
```
╔═════════════════════════════════════════╗
║  SPK WASPAS Backend Server              ║
║  Listening on http://localhost:5000     ║
╚═════════════════════════════════════════╝
```

✅ **Backend siap!** Jangan tutup terminal ini.

---

## 🚀 LANGKAH 2: Buka Frontend (5 menit)

### 2.1 Buka Terminal BARU
Jangan tutup terminal backend yang tadi!

- **Windows**: Tekan `Win + R`, ketik `cmd`, Enter (atau Shift+Right Click → Open PowerShell)
- **Mac/Linux**: Buka Terminal baru

### 2.2 Masuk ke folder frontend
```bash
cd "c:\Users\ThinkPad\Documents\SMT 7\SPK\Sistem\frontend"
```

### 2.3 Install dependencies
```bash
npm install
```

Tunggu sampai selesai (bisa 2-3 menit).

### 2.4 Jalankan aplikasi
```bash
npm start
```

**Jika berhasil:**
- Browser secara otomatis membuka `http://localhost:3000`
- Jika tidak, buka manual: http://localhost:3000

✅ **Frontend siap!**

---

## 🎮 LANGKAH 3: Gunakan Sistem (15 menit)

Sekarang halaman utama tampil dengan menu di atas.

### 3.1 Buat Kriteria Penilaian

1. Klik menu **"Kriteria"**
2. Klik **"+ Tambah Kriteria"**
3. Isi form:
   - **Nama Kriteria**: "Kepribadian"
   - **Bobot**: 0.3
   - **Tipe**: Pilih "Benefit"
4. Klik **"Simpan"**

**Ulangi untuk kriteria lainnya:**
- Kriteria 2: "Pengalaman" (0.4, Benefit)
- Kriteria 3: "Loyalitas" (0.3, Benefit)

✅ Sekarang Anda punya 3 kriteria.

### 3.2 Input Data Kandidat

1. Klik menu **"Kandidat"**
2. Klik **"+ Tambah Kandidat"**
3. Isi form contoh:
   - **Nama**: "Ahmad Budiman"
   - **Asal Kamar**: "Kamar 5"
   - **Usia**: 22
   - **Masa Tinggal**: 3
   - **Keterangan**: (opsional)
4. Klik **"Simpan"**

**Ulangi untuk kandidat lain (minimal 2 kandidat):**
- Kandidat 2: "Budi Santoso"
- Kandidat 3: "Citra Dewi"

✅ Sekarang Anda punya 3 kandidat.

### 3.3 Input Penilaian

1. Klik menu **"Penilaian"**
2. Klik **"+ Tambah Penilaian"**
3. Isi form:
   - **Kandidat**: Pilih "Ahmad Budiman"
   - **Kriteria**: Pilih "Kepribadian"
   - **Nilai**: 85
4. Klik **"Simpan"**

**Lanjutkan untuk semua kombinasi** (3 kandidat × 3 kriteria = 9 penilaian):

| Kandidat | Kepribadian | Pengalaman | Loyalitas |
|----------|------------|-----------|-----------|
| Ahmad | 85 | 80 | 90 |
| Budi | 80 | 85 | 85 |
| Citra | 90 | 75 | 80 |

✅ Sekarang Anda punya 9 penilaian.

### 3.4 Lihat Hasil Ranking

1. Klik menu **"Hasil"** (tombol hijau)
2. Sistem otomatis menghitung ranking
3. Anda akan melihat:
   - Peringkat kandidat (🥇🥈🥉)
   - Nilai WSM, WPM, Qi
   - Statistik (pemenang, total kandidat)

4. Klik **"Edit"** pada baris kandidat untuk melihat detail perhitungan

✅ **Selesai!** Anda sudah menggunakan sistem SPK WASPAS!

---

## 🎯 RINGKASAN WORKFLOW

```
1. Buat Kriteria (3)
        ↓
2. Input Kandidat (3+)
        ↓
3. Isi Penilaian (semua kombinasi)
        ↓
4. Lihat Hasil Ranking
```

---

## ❓ FAQ (Pertanyaan Umum)

### Q: Bagaimana jika ada error?

**A:** Cek file `INSTALLATION_GUIDE.md` bagian Troubleshooting.

### Q: Bisakah saya edit data?

**A:** Ya! Klik tombol "Edit" di tabel untuk setiap data.

### Q: Bagaimana cara hapus data?

**A:** Klik tombol "Hapus", konfirmasi di popup.

### Q: Database disimpan di mana?

**A:** Di `backend/src/database/spk.db` (dibuat otomatis)

### Q: Bagaimana jika lupa input 1 penilaian?

**A:** Sistem akan error. Pastikan SEMUA kandidat punya penilaian untuk SEMUA kriteria.

### Q: Apakah data tersimpan permanent?

**A:** Ya, tersimpan di database SQLite sampai Anda hapus manual.

---

## 📚 DOKUMENTASI LENGKAP

Jika Anda ingin tahu lebih detail, baca file:

1. **README.md** - Dokumentasi lengkap & reference
2. **INSTALLATION_GUIDE.md** - Panduan instalasi & troubleshooting
3. **QUICK_REFERENCE.md** - Quick reference commands
4. **FILE_CHECKLIST.md** - Daftar semua file yang ada
5. **COMPLETION_REPORT.md** - Laporan proyek
6. **backend/README.md** - Dokumentasi backend teknis
7. **frontend/README.md** - Dokumentasi frontend teknis

---

## 🔄 SETELAH SELESAI

### Jika ingin hentikan sistem:

**Terminal Backend:**
```bash
Ctrl + C
```

**Terminal Frontend:**
```bash
Ctrl + C
```

### Jika ingin jalankan lagi:

**Terminal Backend:**
```bash
npm start
```

**Terminal Frontend (terminal baru):**
```bash
npm start
```

---

## 💡 TIPS BERGUNA

✅ **Gunakan skala nilai konsisten** (0-100 recommended)  
✅ **Bobot kriteria total sebaiknya 1.0** (optional)  
✅ **Lihat detail perhitungan** untuk memahami ranking  
✅ **Refresh halaman jika ada masalah** (Ctrl+R atau Cmd+R)  
✅ **Clear browser cache** jika stuck (Ctrl+Shift+Delete)  

---

## 🏆 NEXT STEPS

Setelah familiar dengan sistem:

1. ✅ Coba edit & hapus data
2. ✅ Baca algoritma WASPAS di dokumentasi
3. ✅ Lihat source code di folder backend/frontend
4. ✅ Customize sesuai kebutuhan Anda

---

## 📞 BANTUAN

**Ada masalah?**

1. Cek **INSTALLATION_GUIDE.md** → Troubleshooting
2. Cek **QUICK_REFERENCE.md** → FAQ
3. Lihat **browser console** (F12) untuk error messages
4. Lihat **terminal** untuk server error

---

## ✅ CHECKLIST AWAL

Sebelum mulai, pastikan:

- [ ] Node.js v14+ sudah terinstal
- [ ] Terminal sudah siap (2 window)
- [ ] Folder Sistem sudah ada
- [ ] Anda sudah baca panduan ini

---

## 🎉 SELAMAT DIMULAI!

Anda siap menggunakan **SPK WASPAS**!

Ikuti langkah-langkah di atas dan sistem siap digunakan dalam 15-20 menit.

**Nikmati! 🚀**

---

**Pertanyaan lebih lanjut? Baca dokumentasi lengkap di README.md**
