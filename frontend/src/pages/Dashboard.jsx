import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSummary } from '../services/apiService';
import logo from '../assets/logo.webp';

const Card = ({ title, value, sub, accent }) => (
  <div className="dash-card">
    <div className="dash-card__top">
      <div className="dash-card__dot" style={{ background: accent }} />
      <span className="dash-card__title">{title}</span>
    </div>
    <div className="dash-card__value">{value}</div>
    {sub && <div className="dash-card__sub">{sub}</div>}
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ kandidat: '-', kriteria: '-', penilaian: '-', penilaianCompleted: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await getSummary();
        if (mounted) setSummary(res);
      } catch (e) {
        if (mounted) setSummary({ kandidat: '-', kriteria: '-', penilaian: '-', penilaianCompleted: false });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const completionText = loading ? '...' : summary.penilaianCompleted ? 'Selesai' : 'Belum lengkap';
  const penilaianInfo = loading ? 'Memuat...' : `${summary.penilaian} nilai tersimpan`;

  return (
    <div className="dashboard-wrap">
      <div className="dash-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
            <img src={logo} alt="Logo Nawwir Quluubanaa" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
            <div>
              <p className="dash-kicker">Nawwir Quluubanaa</p>
              <h1>Selamat Datang!</h1>
            </div>
          </div>
          <p className="dash-sub">Pantau kandidat, kriteria, dan progres penilaian dalam satu layar.</p>
        </div>
        <div className="dash-actions">
          <button className="dash-btn primary" onClick={() => navigate('/penilaian')}>Isi Penilaian</button>
          <button className="dash-btn ghost" onClick={() => navigate('/hasil')}>Lihat Hasil</button>
        </div>
      </div>

      <div className="dash-grid">
        <Card
          title="Jumlah Kandidat"
          value={loading ? '...' : summary.kandidat}
          sub="Total kandidat terdaftar"
          accent="#22c55e"
        />
        <Card
          title="Jumlah Kriteria"
          value={loading ? '...' : summary.kriteria}
          sub="Dimensi penilaian"
          accent="#3b82f6"
        />
        <Card
          title="Penilaian"
          value={loading ? '...' : completionText}
          sub={penilaianInfo}
          accent="#f59e0b"
        />
      </div>

      <div className="dash-quick">
        <div className="dash-quick__item" onClick={() => navigate('/kandidat')}>
          <div className="dash-quick__title">Kelola Kandidat</div>
          <div className="dash-quick__desc">Tambah / ubah profil kandidat</div>
        </div>
        <div className="dash-quick__item" onClick={() => navigate('/kriteria')}>
          <div className="dash-quick__title">Kelola Kriteria</div>
          <div className="dash-quick__desc">Atur bobot dan tipe kriteria</div>
        </div>
        <div className="dash-quick__item" onClick={() => navigate('/penilaian')}>
          <div className="dash-quick__title">Isi Penilaian</div>
          <div className="dash-quick__desc">Lengkapi penilaian per kriteria</div>
        </div>
        <div className="dash-quick__item" onClick={() => navigate('/hasil')}>
          <div className="dash-quick__title">Hasil WASPAS</div>
          <div className="dash-quick__desc">Lihat peringkat akhir</div>
        </div>
      </div>
    </div>
  );
}
