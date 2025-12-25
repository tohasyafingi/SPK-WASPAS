# Frontend - SPK WASPAS

React Frontend untuk Sistem Pendukung Keputusan WASPAS

## 📦 Setup

```bash
npm install
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Struktur Folder

```
src/
├── components/
│   ├── Form.jsx           # Komponen form generic CRUD
│   ├── Form.css
│   ├── Table.jsx          # Komponen tabel responsif
│   └── Table.css
├── pages/
│   ├── KandidatPage.jsx   # Halaman CRUD Kandidat
│   ├── KriteriaPage.jsx   # Halaman CRUD Kriteria
│   ├── PenilaianPage.jsx  # Halaman CRUD Penilaian
│   ├── HasilPage.jsx      # Halaman Hasil Ranking
│   ├── CRUD.css
│   └── HasilPage.css
├── services/
│   └── apiService.js      # API service untuk call backend
├── config/
│   └── api.js             # API endpoints configuration
├── hooks/
│   └── useApi.js          # Custom hook untuk API calls
├── App.jsx                # Main App component
├── App.css
├── index.js               # Entry point
└── index.html
```

## 🎯 Halaman-Halaman

### 1. Dashboard (/)
- Informasi tentang sistem
- Petunjuk cara penggunaan
- Overview metode WASPAS

### 2. Manajemen Kandidat (/kandidat)
- Daftar semua kandidat
- Tambah kandidat baru
- Edit data kandidat
- Hapus kandidat

### 3. Manajemen Kriteria (/kriteria)
- Daftar semua kriteria
- Tambah kriteria baru
- Set bobot dan tipe kriteria
- Edit dan hapus kriteria

### 4. Manajemen Penilaian (/penilaian)
- Input penilaian untuk setiap kandidat-kriteria
- Edit dan hapus penilaian
- Validasi data penilaian

### 5. Hasil Ranking (/hasil)
- Tampilkan ranking kandidat berdasarkan nilai Qi
- Visualisasi dengan badge peringkat
- Detail perhitungan per kandidat
- Statistik ringkas

## 🔌 API Integration

Semua API calls menggunakan fetch API yang di-wrapper di `apiService.js`:

```javascript
import { kandidatAPI, kriteriaAPI, penilaianAPI, hasilAPI } from '../services/apiService';

// Contoh usage
const data = await kandidatAPI.getAll();
const result = await kandidatAPI.create({ nama, asal_kamar, usia, masa_tinggal });
```

## 🎨 Styling

Menggunakan CSS3 dengan design system:
- **Color**: Primary (#3498db), Success (#27ae60), Error (#e74c3c)
- **Layout**: Flexbox dan CSS Grid
- **Responsive**: Mobile-first approach

## 🧩 Custom Hooks

### useApi
Wrapper untuk API calls dengan loading dan error state:

```javascript
const { loading, error, request } = useApi();
const data = await request(() => kandidatAPI.getAll());
```

## 🔄 Component Reusability

### Form Component
Generic form untuk CRUD dengan:
- Dynamic fields (text, number, textarea, select)
- Built-in validation
- Error display
- Loading state

### Table Component
Generic table dengan:
- Custom columns
- Edit/Delete actions
- Loading dan error states
- Responsive design

## 🚀 Development Tips

1. **Hot Reload**: Gunakan `npm start` untuk development dengan auto-reload
2. **Network Tab**: Debug API calls di browser DevTools
3. **Console Errors**: Cek console browser untuk error messages
4. **API URL**: Default di `http://localhost:5000/api`, ubah di `.env.local` jika berbeda

## 📝 Best Practices

- ✅ Functional components dengan Hooks
- ✅ Proper error handling
- ✅ Loading states untuk UX
- ✅ Form validation
- ✅ Responsive design
- ✅ Clean code dengan comments
- ✅ Separation of concerns

## 🐛 Common Issues

### API Not Found
- Pastikan backend server berjalan
- Cek `REACT_APP_API_URL` di `.env.local`

### CORS Error
- Cek `CORS_ORIGIN` di backend `.env`

### Form Not Submitting
- Cek browser console untuk error messages
- Validasi data inputan

---

Dibuat dengan ❤️ menggunakan React
