import React, { useState, useEffect, useRef, useCallback } from 'react';
import Table from '../components/Table';
import { hasilAPI, kriteriaAPI } from '../services/apiService';
import { useApi } from '../hooks/useApi';
import './HasilPage.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FiRefreshCw, FiFileText, FiX } from 'react-icons/fi';
import { FaTrophy, FaMedal } from 'react-icons/fa';
import { TbTrendingUp, TbTrendingDown } from 'react-icons/tb';

/**
 * Halaman Hasil Ranking WASPAS
 */
const HasilPage = () => {
  const [hasil, setHasil] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [kriterias, setKriterias] = useState([]);
  const { loading, request } = useApi();
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);
  const [exporting, setExporting] = useState(false);
  const exportRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      setTableLoading(true);
      const [hasilRes, kriteriaRes] = await Promise.all([
        request(() => hasilAPI.getHasil()),
        request(() => kriteriaAPI.getAll())
      ]);
      
      setHasil(hasilRes.data || []);
      setKriterias(kriteriaRes.data || []);
      setTableError(null);
    } catch (err) {
      setTableError(err.message);
    } finally {
      setTableLoading(false);
    }
  }, [request]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleViewDetail = async (row) => {
    try {
      const kandidatId = row?.kandidat_id ?? row?.kandidatId ?? row?.id;
      if (!kandidatId) {
        alert('ID kandidat tidak ditemukan.');
        return;
      }
      const detailRes = await request(() => hasilAPI.getDetail(kandidatId));
      setSelectedDetail(detailRes.data);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCloseDetail = () => {
    setSelectedDetail(null);
  };

  const handleExportPDF = async () => {
    try {
      if (!exportRef.current) return;
      setExporting(true);
      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`hasil_waspas_${dateStr}.pdf`);
    } catch (err) {
      alert('Gagal export PDF: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const columns = [
    { 
      key: 'rank', 
      label: 'Peringkat',
      render: (row) => (
        <span className={`rank-badge rank-${row.rank}`}>
          {row.rank === 1 && <FaMedal style={{ marginRight: '4px' }} />}
          {row.rank === 2 && <FaMedal style={{ marginRight: '4px' }} />}
          {row.rank === 3 && <FaMedal style={{ marginRight: '4px' }} />}
          {row.rank}
        </span>
      )
    },
    { key: 'nama', label: 'Nama Kandidat' },
    { key: 'asal_kamar', label: 'Asal Kamar' },
    { key: 'usia', label: 'Usia' },
    { key: 'masa_tinggal', label: 'Masa Tinggal' },
    { key: 'wsm', label: 'WSM', render: (row) => row.wsm.toFixed(6) },
    { key: 'wpm', label: 'WPM', render: (row) => row.wpm.toFixed(6) },
    { 
      key: 'qi', 
      label: 'Nilai Akhir (Qi)',
      render: (row) => (
        <span className="qi-value">{row.qi.toFixed(6)}</span>
      )
    }
  ];

  return (
    <div className="hasil-container" ref={exportRef}>
      <div className="hasil-header">
        <h1>Hasil Ranking WASPAS</h1>
        <div className="header-actions">
          <button
            className="btn-export"
            onClick={handleExportPDF}
            disabled={exporting || tableLoading}
            aria-label="Export ke PDF"
          >
            <FiFileText style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Export PDF
          </button>
          <button 
            className="btn-refresh"
            onClick={loadData}
            disabled={loading}
          >
            <FiRefreshCw style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Refresh
          </button>
        </div>
      </div>

      {tableError && (
        <div className="error-message">
          {tableError}
        </div>
      )}

      {/* Statistik Singkat */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Kandidat</h3>
          <p className="stat-value">{hasil.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Kriteria</h3>
          <p className="stat-value">{kriterias.length}</p>
        </div>
        {hasil.length > 0 && (
          <>
            <div className="stat-card winner">
              <h3>Pemenang</h3>
              <p className="stat-value">
                <FaTrophy style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                {hasil[0].nama}
              </p>
              <p className="stat-subtitle">Nilai: {hasil[0].qi.toFixed(6)}</p>
            </div>
          </>
        )}
      </div>

      {/* Tabel Hasil */}
      <div className="table-wrapper">
        <h2>Ranking Kandidat</h2>
        {hasil.length > 0 && (
          <Table
            columns={columns}
            data={hasil}
            onEdit={handleViewDetail}
            editLabel="Detail"
            loading={tableLoading}
            error={null}
          />
        )}
        {hasil.length === 0 && !tableLoading && (
          <div className="no-data">
            <p>Tidak ada data. Pastikan Kandidat, Kriteria, dan Penilaian sudah lengkap.</p>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      {selectedDetail && (
        <div className="modal-overlay" onClick={handleCloseDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detail Perhitungan</h2>
              <button className="btn-close" onClick={handleCloseDetail}><FiX size={24} /></button>
            </div>
            
            <div className="modal-body">
              <h3>{selectedDetail.nama}</h3>
              
              <div className="detail-table">
                <table>
                  <thead>
                    <tr>
                      <th>Kriteria</th>
                      <th>Tipe</th>
                      <th>Nilai Asli</th>
                      <th>Bobot</th>
                      <th>Normalisasi</th>
                      <th>Kontribusi WSM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDetail.penilaian_detail.map((detail, idx) => (
                      <tr key={idx}>
                        <td>{detail.nama_kriteria}</td>
                        <td>
                          {detail.tipe === 'benefit' ? (
                            <><TbTrendingUp style={{ marginRight: '4px', verticalAlign: 'middle' }} />Benefit</>
                          ) : (
                            <><TbTrendingDown style={{ marginRight: '4px', verticalAlign: 'middle' }} />Cost</>
                          )}
                        </td>
                        <td>{detail.nilai_asli}</td>
                        <td>{detail.bobot}</td>
                        <td>{detail.nilai_normalisasi.toFixed(6)}</td>
                        <td>{detail.kontribusi_wsm.toFixed(6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="calculation-steps">
                <h4>Langkah-Langkah Perhitungan:</h4>
                <ol>
                  <li><strong>Normalisasi:</strong> Nilai dibagi nilai maksimum (untuk benefit) atau nilai minimum dibagi nilai (untuk cost)</li>
                  <li><strong>WSM:</strong> Jumlah dari (bobot × nilai normalisasi)</li>
                  <li><strong>WPM:</strong> Perkalian dari (nilai normalisasi ^ bobot)</li>
                  <li><strong>WASPAS:</strong> 0.5 × WSM + 0.5 × WPM</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HasilPage;
