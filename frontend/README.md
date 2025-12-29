# Frontend - SPK WASPAS

React Frontend untuk Sistem Pendukung Keputusan WASPAS dengan autentikasi, tabel pivot penilaian, form modal, dan layout sticky.

## 📦 Setup

```powershell
npm install
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Struktur Folder

```
src/
├── components/
│   ├── Form.jsx             # Komponen form generic CRUD (modal-friendly)
│   ├── Form.css
│   ├── Modal.jsx            # Komponen modal reusable (sizes)
│   ├── Modal.css
│   ├── Table.jsx            # Komponen tabel responsif (align per kolom)
│   ├── Table.css
│   ├── HeaderBar.jsx        # Header sticky
│   ├── Sidebar.jsx          # Sidebar fixed
│   └── ProtectedRoute.jsx   # Guard route berbasis auth
├── pages/
│   ├── KandidatPage.jsx     # Halaman CRUD Kandidat (modal)
│   ├── KriteriaPage.jsx     # Halaman CRUD Kriteria (skala & bobot)
│   ├── PenilaianPage.jsx    # Halaman Penilaian (tabel pivot + edit massal via modal)
│   ├── HasilPage.jsx        # Halaman Hasil Ranking (detail modal)
│   ├── LoginPage.jsx        # Halaman Login
│   ├── Dashboard.jsx        # Beranda/dashboard
│   ├── CRUD.css
│   ├── HasilPage.css
│   └── LoginPage.css
├── layouts/
│   └── MainLayout.jsx       # Layout utama dengan header+sidebar
├── services/
│   ├── apiService.js        # API wrapper
│   └── authService.js       # Layanan auth (login/logout/getMe)
├── config/
│   └── api.js               # API endpoints configuration
├── hooks/
│   ├── useApi.js            # Custom hook untuk API calls
│   └── useAuth.js           # State auth (token, user)
├── App.jsx                # Main App component
├── App.css
├── index.js               # Entry point
└── public/index.html
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

### 2. Manajemen Kriteria (/kriteria)
- Daftar semua kriteria
- Tambah/Edit via modal
- Set bobot (0-1), tipe (benefit/cost), dan skala (1-10/1-100/persen/jumlah)
- Hapus kriteria

### 4. Manajemen Penilaian (/penilaian)
- Tampilan pivot (baris: kandidat, kolom: kriteria)
- Edit massal per kandidat via modal
- Validasi & pembatasan nilai berdasarkan skala kriteria

### 5. Hasil Ranking (/hasil)
- Tampilkan ranking kandidat berdasarkan nilai Qi
- Visualisasi dengan badge peringkat
- Detail perhitungan per kandidat
- Statistik ringkas

## 🔌 API Integration

Semua API calls menggunakan fetch API yang di-wrapper di `apiService.js`:

```javascript
import { kandidatAPI, kriteriaAPI, penilaianAPI, hasilAPI } from '../services/apiService';
import { login, getMe, logout } from '../services/authService';

// Contoh usage
const data = await kandidatAPI.getAll();
const result = await kandidatAPI.create({ nama, asal_kamar, usia, masa_tinggal });
```

## 🎨 Styling

Menggunakan CSS3 dengan design system:
- **Color**: Primary (#3498db), Success (#27ae60), Error (#e74c3c)
- **Layout**: Header sticky + Sidebar fixed
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
- Custom columns (support `align: 'left'|'center'|'right'`)
- Edit/Delete actions
- Loading dan error states
- Responsive design

## 🚀 Development Tips

1. **Hot Reload**: Gunakan `npm start` untuk development dengan auto-reload
2. **Network Tab**: Debug API calls di browser DevTools
3. **Console Errors**: Cek console browser untuk error messages
4. **API URL**: Default di `http://localhost:5000/api`, ubah di `.env.local` jika berbeda
5. **ProtectedRoute**: Lindungi halaman dengan token JWT dari login

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
