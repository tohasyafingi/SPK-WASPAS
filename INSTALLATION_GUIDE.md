# 📋 PANDUAN INSTALASI DAN PENGGUNAAN

## 🎯 Panduan Cepat (Quick Start)

### Prasyarat
- ✅ Node.js v14+ ([Download](https://nodejs.org/))
- ✅ NPM (include dengan Node.js)
- ✅ Terminal/Command Prompt

### Step 1: Buka Backend
```bash
cd backend
npm install
npm start
```
✅ Backend berjalan di `http://localhost:5000`

### Step 2: Buka Frontend (Terminal Baru)
```bash
cd frontend
npm install
npm start
```
✅ Frontend berjalan di `http://localhost:3000`

**Selesai!** Aplikasi siap digunakan.

---

## 📖 Panduan Lengkap

### A. INSTALASI BACKEND

#### 1. Masuk folder backend
```bash
cd backend
```

#### 2. Install dependencies
```bash
npm install
```

Ini akan menginstal:
- `express` - Web framework
- `sqlite3` - Database
- `sqlite` - Query builder
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variables

#### 3. Konfigurasi (Opsional)
File `.env` sudah ada dengan konfigurasi default:
```
PORT=5000
NODE_ENV=development
DB_PATH=./src/database/spk.db
CORS_ORIGIN=http://localhost:3000
```

#### 4. Jalankan server
**Production:**
```bash
npm start
```

**Development (with auto-reload):**
```bash
npm run dev
```

#### 5. Verifikasi
Buka browser ke `http://localhost:5000/api/health`

Jika berhasil, akan melihat:
```json
{
  "status": "success",
  "message": "SPK WASPAS Backend is running"
}
```

---

### B. INSTALASI FRONTEND

#### 1. Masuk folder frontend
```bash
cd frontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Konfigurasi (Opsional)
Jika backend di URL berbeda, buat file `.env.local`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### 4. Jalankan aplikasi
```bash
npm start
```

Browser secara otomatis membuka `http://localhost:3000`

#### 5. Verifikasi
- ✅ Halaman Dashboard muncul
- ✅ Navbar navigation tersedia
- ✅ Tidak ada error di console

---

## 🎮 CARA MENGGUNAKAN SISTEM

### 1️⃣ Setup Kriteria Penilaian

**Langkah:**
1. Klik menu **"Kriteria"** di navbar
2. Klik tombol **"+ Tambah Kriteria"**
3. Isi form:
   - **Nama Kriteria**: Contoh "Kepribadian"
   - **Bobot**: Contoh 0.4 (rentang 0-1)
   - **Tipe**: Pilih "Benefit" atau "Cost"
4. Klik **"Simpan"**

**Contoh Kriteria yang Bisa Ditambahkan:**
- Kepribadian (0.3, Benefit)
- Pengalaman Organisasi (0.4, Benefit)
- Loyalitas (0.3, Benefit)

📝 **Catatan:** Bobot total semua kriteria tidak harus tepat 1, tapi untuk hasil optimal sebaiknya 1.

---

### 2️⃣ Input Data Kandidat

**Langkah:**
1. Klik menu **"Kandidat"** di navbar
2. Klik tombol **"+ Tambah Kandidat"**
3. Isi form:
   - **Nama Kandidat**: Nama calon lurah
   - **Asal Kamar**: Kamar atau blok asal
   - **Usia**: Umur dalam angka
   - **Masa Tinggal**: Tahun di pesantren
   - **Keterangan**: Deskripsi (opsional)
4. Klik **"Simpan"**

**Contoh Input:**
```
Nama: Ahmad Budiman
Asal Kamar: Kamar 5
Usia: 22
Masa Tinggal: 3
Keterangan: Siswa aktif dan berprestasi
```

---

### 3️⃣ Input Penilaian Kandidat

**Langkah:**
1. Klik menu **"Penilaian"** di navbar
2. Klik tombol **"+ Tambah Penilaian"**
3. Isi form:
   - **Kandidat**: Pilih nama kandidat
   - **Kriteria**: Pilih kriteria
   - **Nilai**: Masukkan nilai/skor
4. Klik **"Simpan"**

**Contoh Input:**
```
Kandidat: Ahmad Budiman
Kriteria: Kepribadian
Nilai: 85
```

📝 **Catatan:** Setiap kombinasi Kandidat-Kriteria harus memiliki satu penilaian.

**Tips:** Masukkan semua penilaian untuk semua kandidat terhadap semua kriteria sebelum melihat hasil.

---

### 4️⃣ Lihat Hasil Ranking WASPAS

**Langkah:**
1. Klik menu **"Hasil"** di navbar (tombol hijau)
2. Sistem otomatis menghitung ranking
3. Tabel menampilkan:
   - **Peringkat**: 🥇🥈🥉
   - **Nama Kandidat**
   - **Nilai WSM, WPM, Qi**

**Halaman Hasil Menampilkan:**
- 📊 Statistik (Total kandidat, pemenang)
- 🏆 Peringkat lengkap
- 📈 Nilai akhir (Qi) setiap kandidat

**Melihat Detail Perhitungan:**
1. Di tabel hasil, klik tombol **"Edit"** pada baris kandidat
2. Modal popup menampilkan:
   - Nilai asli dan normalisasi
   - Bobot kriteria
   - Kontribusi ke WSM
   - Langkah-langkah perhitungan

---

## 🔄 MENGEDIT DATA

### Edit Kandidat
1. Ke menu **"Kandidat"**
2. Klik tombol **"Edit"** pada kandidat yang ingin diubah
3. Ubah data yang diperlukan
4. Klik **"Simpan"**

### Edit Kriteria
1. Ke menu **"Kriteria"**
2. Klik tombol **"Edit"** pada kriteria
3. Ubah data
4. Klik **"Simpan"**

### Edit Penilaian
1. Ke menu **"Penilaian"**
2. Klik tombol **"Edit"** pada penilaian
3. Ubah nilai (Kandidat dan Kriteria tidak bisa diubah)
4. Klik **"Simpan"**

---

## 🗑️ MENGHAPUS DATA

### Hapus Kandidat
1. Ke menu **"Kandidat"**
2. Klik tombol **"Hapus"** pada baris
3. Konfirmasi penghapusan
4. ✅ Data terhapus (penilaian juga ikut terhapus)

### Hapus Kriteria
1. Ke menu **"Kriteria"**
2. Klik tombol **"Hapus"**
3. Konfirmasi penghapusan
4. ✅ Data terhapus (penilaian juga ikut terhapus)

### Hapus Penilaian
1. Ke menu **"Penilaian"**
2. Klik tombol **"Hapus"**
3. Konfirmasi
4. ✅ Data terhapus

---

## 📊 CONTOH KASUS LENGKAP

### Skenario: Pemilihan Lurah 3 Kandidat

**Step 1: Buat Kriteria (3 kriteria)**

| No | Nama Kriteria | Bobot | Tipe |
|----|---------------|-------|------|
| 1 | Kepribadian | 0.3 | Benefit |
| 2 | Pengalaman | 0.4 | Benefit |
| 3 | Loyalitas | 0.3 | Benefit |

**Step 2: Input Kandidat (3 kandidat)**

| No | Nama | Kamar | Usia | Masa Tinggal |
|----|------|-------|------|--------------|
| 1 | Ahmad | 5 | 22 | 3 |
| 2 | Budi | 7 | 21 | 2 |
| 3 | Citra | 3 | 23 | 4 |

**Step 3: Input Penilaian (9 data)**

| Kandidat | Kepribadian | Pengalaman | Loyalitas |
|----------|------------|-----------|-----------|
| Ahmad | 85 | 80 | 90 |
| Budi | 80 | 85 | 85 |
| Citra | 90 | 75 | 80 |

**Step 4: Lihat Hasil**

Sistem akan menampilkan ranking berdasarkan perhitungan WASPAS:
- Normalisasi setiap nilai
- Hitung WSM dan WPM
- Agregasi menjadi Qi
- Sort berdasarkan Qi tertinggi

---

## 🔍 TROUBLESHOOTING

### ❌ Aplikasi tidak bisa diakses

**Masalah: Halaman kosong atau error**

**Solusi:**
1. Pastikan backend berjalan
   ```bash
   # Buka terminal baru, cek server
   curl http://localhost:5000/api/health
   ```

2. Restart kedua server
3. Clear browser cache (Ctrl+Shift+Delete)

### ❌ Form tidak bisa diklik

**Masalah: Button disabled atau tidak responsif**

**Solusi:**
1. Tunggu sampai loading selesai
2. Cek browser console (F12) untuk error
3. Refresh halaman
4. Pastikan ada data Kriteria yang dibuat

### ❌ Tidak bisa input Penilaian

**Masalah: Dropdown Kandidat/Kriteria kosong**

**Solusi:**
1. Buat Kriteria terlebih dahulu (menu Kriteria)
2. Buat Kandidat (menu Kandidat)
3. Baru input Penilaian
4. Refresh halaman jika masih kosong

### ❌ Error "Penilaian untuk kandidat X dan kriteria Y sudah ada"

**Masalah: Duplikasi penilaian**

**Solusi:**
1. Edit penilaian yang sudah ada (jangan membuat baru)
2. Atau hapus penilaian lama, buat yang baru

### ❌ Hasil tidak muncul

**Masalah: Tabel hasil kosong**

**Solusi:**
1. Pastikan semua kandidat memiliki penilaian lengkap untuk SEMUA kriteria
2. Contoh: 3 kandidat × 3 kriteria = harus 9 data penilaian
3. Refresh halaman Hasil
4. Cek browser console untuk error message

---

## 💡 TIPS & TRICKS

### 🚀 Tips Performance
- Gunakan nama Kriteria yang singkat dan jelas
- Masukkan nilai penilaian dalam skala yang konsisten (0-100 recommended)
- Hapus data yang tidak diperlukan untuk mempercepat perhitungan

### 📱 Tips Mobile
- Aplikasi responsif, tapi lebih nyaman di desktop
- Untuk mobile: landscape mode lebih baik

### 📊 Tips Analisa
- Lihat detail perhitungan untuk memahami ranking
- Bandingkan nilai WSM dan WPM untuk insight
- Ubah bobot kriteria untuk melihat perbedaan hasil

---

## 📞 DUKUNGAN

### Jika Mengalami Masalah

1. **Cek Log Terminal Backend**
   - Buka terminal backend
   - Lihat message error yang muncul

2. **Cek Browser Console**
   - Buka DevTools (F12)
   - Tab "Console" untuk error messages
   - Tab "Network" untuk API calls

3. **Restart Aplikasi**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Restart keduanya

4. **Reset Database** (Jika perlu)
   - Hapus file `backend/src/database/spk.db`
   - Restart server
   - Database akan dibuat otomatis

---

## 📚 REFERENSI TAMBAHAN

- **Dokumentasi Backend**: `backend/README.md`
- **Dokumentasi Frontend**: `frontend/README.md`
- **Dokumentasi Lengkap**: `README.md`
- **WASPAS Method**: Wikipedia WASPAS

---

**Selamat menggunakan Sistem SPK WASPAS! 🎉**

Jika ada pertanyaan, lihat dokumentasi atau hubungi developer.
