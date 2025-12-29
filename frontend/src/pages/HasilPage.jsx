import React, { useState, useEffect, useRef, useCallback } from 'react';
import Table from '../components/Table';
import { hasilAPI, kriteriaAPI } from '../services/apiService';
import { useApi } from '../hooks/useApi';
import './HasilPage.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

      // Enable lightweight export styles and simulate print look
      document.body.classList.add('export-mode', 'simulate-print');

      // Target only the table wrapper for export to reduce PDF size
      const targetNode = exportRef.current.querySelector('.table-wrapper') || exportRef.current;

      // Increase scale for crisper raster output (may increase size)
      const scale = Math.min(window.devicePixelRatio || 2, 2);
      const canvas = await html2canvas(targetNode, {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        letterRendering: true
      });

      // Use JPEG with quality compression instead of PNG
      const imgData = canvas.toDataURL('image/jpeg', 0.75);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
      while (heightLeft > 0) {
        position = -(imgHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`hasil_waspas_${dateStr}.pdf`);
    } catch (err) {
      alert('Gagal export PDF: ' + err.message);
    } finally {
      document.body.classList.remove('export-mode', 'simulate-print');
      setExporting(false);
    }
  };

  const handlePrintPDF = () => {
    try {
      setExporting(true);
      // Use export-mode to simplify visuals during print
      document.body.classList.add('export-mode');
      // Small timeout to allow style application before print dialog
      setTimeout(() => {
        window.print();
        document.body.classList.remove('export-mode');
        setExporting(false);
      }, 50);
    } catch (err) {
      document.body.classList.remove('export-mode');
      setExporting(false);
      alert('Gagal print PDF: ' + err.message);
    }
  };

  const handleExportPDFSharp = () => {
    try {
      if (!hasil || hasil.length === 0) {
        alert('Tidak ada data untuk diexport.');
        return;
      }
      setExporting(true);
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const dateStr = new Date().toISOString().slice(0, 10);
      const title = 'Hasil Ranking WASPAS';

      // Penjelasan singkat untuk pemahaman awam
      pdf.setFontSize(14);
      pdf.text(title, 12, 12);
      pdf.setFontSize(10);
      pdf.text(`Tanggal: ${dateStr}`, 12, 18);
      pdf.setFontSize(9);
      pdf.text('Penjelasan singkat:', 12, 24);
      pdf.setFontSize(8);
      pdf.text('• WSM = jumlah tertimbang nilai normalisasi', 12, 29);
      pdf.text('• WPM = perkalian tertimbang nilai normalisasi', 12, 33);
      pdf.text('• Qi = gabungan WSM & WPM (rata-rata); nilai lebih besar lebih baik', 12, 37);

      const head = [
        [
          'Peringkat',
          'Nama Kandidat',
          'Asal Kamar',
          'Usia',
          'Masa Tinggal',
          'Skor WSM',
          'Skor WPM',
          'Nilai Akhir (Qi)'
        ]
      ];
      const body = hasil.map(row => [
        row.rank,
        row.nama,
        row.asal_kamar,
        row.usia,
        row.masa_tinggal,
        Number(row.wsm).toFixed(6),
        Number(row.wpm).toFixed(6),
        Number(row.qi).toFixed(6)
      ]);

      autoTable(pdf, {
        head,
        body,
        startY: 42,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [44, 62, 80], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { top: 10, right: 10, bottom: 12, left: 10 },
        columnStyles: {
          0: { halign: 'right', cellWidth: 14 },      // rank
          1: { halign: 'left', cellWidth: 60 },       // nama
          2: { halign: 'left', cellWidth: 30 },       // asal kamar
          3: { halign: 'right', cellWidth: 16 },      // usia
          4: { halign: 'right', cellWidth: 24 },      // masa tinggal
          5: { halign: 'right', cellWidth: 24 },      // wsm
          6: { halign: 'right', cellWidth: 24 },      // wpm
          7: { halign: 'right', cellWidth: 24 },      // qi
        },
        didDrawPage: (data) => {
          const pageStr = `Halaman ${data.pageNumber}`;
          pdf.setFontSize(9);
          const pageWidth = pdf.internal.pageSize.getWidth();
          pdf.text(pageStr, pageWidth - 12 - pdf.getTextWidth(pageStr), pdf.internal.pageSize.getHeight() - 8);
        }
      });

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
      align: 'center',
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
    { key: 'asal_kamar', label: 'Asal Kamar', align: 'center' },
    { key: 'usia', label: 'Usia', align: 'center' },
    { key: 'masa_tinggal', label: 'Masa Tinggal', align: 'center' },
    { key: 'wsm', label: 'Skor WSM (Jumlah Tertimbang)', align: 'center', render: (row) => row.wsm.toFixed(6) },
    { key: 'wpm', label: 'Skor WPM (Perkalian Tertimbang)', align: 'center', render: (row) => row.wpm.toFixed(6) },
    { 
      key: 'qi', 
      label: 'Nilai Akhir (Qi)',
      align: 'center',
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
            onClick={handleExportPDFSharp}
            disabled={exporting || tableLoading}
            aria-label="Export PDF"
          >
            <FiFileText style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Export PDF
          </button>
          <button
            className="btn-export"
            onClick={handlePrintPDF}
            disabled={exporting || tableLoading}
            aria-label="Print "
          >
            <FiFileText style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            Print
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
          <p className="table-explainer">
            Penjelasan kolom: WSM = jumlah tertimbang nilai normalisasi; WPM = perkalian tertimbang nilai normalisasi; Qi = gabungan WSM & WPM (rata-rata). Semakin tinggi Qi, semakin baik peringkat.
          </p>
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
