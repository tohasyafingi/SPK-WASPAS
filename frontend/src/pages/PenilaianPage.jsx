import React, { useState, useEffect } from 'react';
import Form from '../components/Form';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { penilaianAPI, kandidatAPI, kriteriaAPI } from '../services/apiService';
import { useApi } from '../hooks/useApi';
import './CRUD.css';

/**
 * Halaman CRUD Penilaian
 */
const PenilaianPage = () => {
  const [penilaians, setPenilaians] = useState([]);
  const [kandidats, setKandidats] = useState([]);
  const [kriterias, setKriterias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedKandidat, setSelectedKandidat] = useState('');
  const [nilaiKriteria, setNilaiKriteria] = useState({});
  const { loading, request } = useApi();

  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);

  // Load data awal
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setTableLoading(true);
      const [pRes, kRes, krRes] = await Promise.all([
        request(() => penilaianAPI.getAll()),
        request(() => kandidatAPI.getAll()),
        request(() => kriteriaAPI.getAll())
      ]);
      
      setPenilaians(pRes.data || []);
      setKandidats(kRes.data || []);
      setKriterias(krRes.data || []);
      setTableError(null);
    } catch (err) {
      setTableError(err.message);
    } finally {
      setTableLoading(false);
    }
  };

  const penilaianFields = [
    { 
      name: 'kandidat_id', 
      label: 'Kandidat', 
      type: 'select', 
      required: true,
      options: kandidats.map(k => ({ value: k.id, label: k.nama }))
    },
    { 
      name: 'kriteria_id', 
      label: 'Kriteria', 
      type: 'select', 
      required: true,
      options: kriterias.map(kr => ({ value: kr.id, label: kr.nama_kriteria }))
    },
    { name: 'nilai', label: 'Nilai', type: 'number', required: true, min: 0, step: 0.01 }
  ];

  const getSkalaConfig = (skalaRaw) => {
    const skala = skalaRaw || '1-10';
    const map = {
      '1-10': { max: 10, step: 1, placeholder: '0 - 10', label: '1-10' },
      '1-100': { max: 100, step: 1, placeholder: '0 - 100', label: '1-100' },
      persen: { max: 100, step: 0.01, placeholder: '0 - 100%', label: 'Persen' },
      jumlah: { max: null, step: 1, placeholder: 'Masukkan jumlah', label: 'Jumlah' }
    };
    return map[skala] || map['1-10'];
  };

  const handleKandidatChange = (e) => {
    const kandidatId = e.target.value;
    setSelectedKandidat(kandidatId);
    
    // Reset nilai kriteria
    const initialNilai = {};
    kriterias.forEach(kr => {
      initialNilai[kr.id] = '';
    });
    setNilaiKriteria(initialNilai);
  };

  const handleNilaiChange = (kriteriaId, value) => {
    setNilaiKriteria(prev => ({
      ...prev,
      [kriteriaId]: value
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!selectedKandidat) {
      alert('Pilih kandidat terlebih dahulu!');
      return;
    }

    // Validasi semua kriteria sudah diisi
    const emptyKriteria = kriterias.filter(kr => !nilaiKriteria[kr.id] || nilaiKriteria[kr.id] === '');
    if (emptyKriteria.length > 0) {
      alert('Harap isi nilai untuk semua kriteria!');
      return;
    }

    try {
      // Simpan penilaian untuk setiap kriteria
      const promises = kriterias.map(kr => {
        const formData = {
          kandidat_id: parseInt(selectedKandidat),
          kriteria_id: kr.id,
          nilai: parseFloat(nilaiKriteria[kr.id])
        };
        return request(() => penilaianAPI.create(formData));
      });

      await Promise.all(promises);
      
      setShowForm(false);
      setSelectedKandidat('');
      setNilaiKriteria({});
      await loadAllData();
      alert('Data penilaian berhasil disimpan!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setSelectedKandidat('');
    setNilaiKriteria({});
  };

  const handleEditKandidat = (row) => {
    // Set kandidat yang akan diedit
    setSelectedKandidat(row.kandidat_id.toString());
    setEditingId(row.kandidat_id);
    
    // Load nilai penilaian yang sudah ada untuk kandidat ini
    const nilaiData = {};
    kriterias.forEach(kriteria => {
      const penilaian = penilaians.find(
        p => p.kandidat_id === row.kandidat_id && p.kriteria_id === kriteria.id
      );
      nilaiData[kriteria.id] = penilaian ? penilaian.nilai.toString() : '';
    });
    setNilaiKriteria(nilaiData);
    setShowForm(false);
  };

  const handleUpdateKandidat = async (e) => {
    e.preventDefault();
    
    if (!selectedKandidat) {
      alert('Kandidat tidak valid!');
      return;
    }

    // Validasi semua kriteria sudah diisi
    const emptyKriteria = kriterias.filter(kr => !nilaiKriteria[kr.id] || nilaiKriteria[kr.id] === '');
    if (emptyKriteria.length > 0) {
      alert('Harap isi nilai untuk semua kriteria!');
      return;
    }

    try {
      // Update penilaian untuk setiap kriteria
      const promises = kriterias.map(async (kr) => {
        const penilaian = penilaians.find(
          p => p.kandidat_id === parseInt(selectedKandidat) && p.kriteria_id === kr.id
        );
        
        const formData = {
          kandidat_id: parseInt(selectedKandidat),
          kriteria_id: kr.id,
          nilai: parseFloat(nilaiKriteria[kr.id])
        };

        if (penilaian) {
          // Update penilaian yang sudah ada
          return request(() => penilaianAPI.update(penilaian.id, formData));
        } else {
          // Buat penilaian baru jika belum ada
          return request(() => penilaianAPI.create(formData));
        }
      });

      await Promise.all(promises);
      
      setEditingId(null);
      setSelectedKandidat('');
      setNilaiKriteria({});
      await loadAllData();
      alert('Data penilaian berhasil diperbarui!');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteKandidat = async (kandidatId) => {
    if (window.confirm('Yakin ingin menghapus semua penilaian untuk kandidat ini?')) {
      try {
        // Hapus semua penilaian untuk kandidat ini
        const penilaianToDelete = penilaians.filter(p => p.kandidat_id === kandidatId);
        await Promise.all(penilaianToDelete.map(p => request(() => penilaianAPI.delete(p.id))));
        await loadAllData();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  // Transform data untuk tampilan tabel pivot
  const getPivotTableData = () => {
    const pivotData = [];
    
    kandidats.forEach((kandidat, index) => {
      const row = {
        id: kandidat.id, // Gunakan kandidat.id sebagai row id
        no: index + 1,
        kandidat_id: kandidat.id,
        kandidat: kandidat.nama
      };
      
      // Tambahkan nilai untuk setiap kriteria
      kriterias.forEach(kriteria => {
        const penilaian = penilaians.find(
          p => p.kandidat_id === kandidat.id && p.kriteria_id === kriteria.id
        );
        row[`kriteria_${kriteria.id}`] = penilaian ? penilaian.nilai : '-';
      });
      
      pivotData.push(row);
    });
    
    return pivotData;
  };

  // Generate kolom untuk tabel pivot
  const getPivotColumns = () => {
    const columns = [
      { key: 'no', label: 'No', align: 'center' },
      { key: 'kandidat', label: 'Kandidat' }
    ];
    
    // Tambahkan kolom untuk setiap kriteria
    kriterias.forEach(kriteria => {
      const { label } = getSkalaConfig(kriteria.skala);
      columns.push({
        key: `kriteria_${kriteria.id}`,
        label: `${kriteria.nama_kriteria} (${label})`,
        align: 'center'
      });
    });
    
    return columns;
  };

  return (
    <div className="page-container">
      <h1>Manajemen Penilaian</h1>

      <button 
        className="btn-primary"
        onClick={() => setShowForm(true)}
      >
        + Tambah Penilaian
      </button>

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title="Tambah Penilaian Baru"
        size="large"
      >
        <div>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="kandidat">
                Kandidat
                <span className="required">*</span>
              </label>
              <select
                id="kandidat"
                name="kandidat"
                value={selectedKandidat}
                onChange={handleKandidatChange}
                required
              >
                <option value="">-- Pilih Kandidat --</option>
                {kandidats.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                  </option>
                ))}
              </select>
            </div>

            {selectedKandidat && (
              <>
                <div style={{ 
                  marginTop: '20px', 
                  marginBottom: '15px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#2c3e50'
                }}>
                  Kriteria dan Nilai:
                </div>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '15px',
                  alignItems: 'center'
                }}>
                  <div style={{ 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#2c3e50',
                    paddingLeft: '5px'
                  }}>
                    Kriteria
                  </div>
                  <div style={{ 
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#2c3e50',
                    paddingLeft: '5px'
                  }}>
                    Nilai
                  </div>
                  {kriterias.map(kr => {
                    const { max, step, placeholder, label } = getSkalaConfig(kr.skala);
                    return (
                      <React.Fragment key={kr.id}>
                        <div style={{ 
                          padding: '12px',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid #e9ecef',
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#2c3e50',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span>{kr.nama_kriteria}</span>
                          <span style={{
                            background: '#e3eaf7',
                            color: '#1d4ed8',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            {label}
                          </span>
                        </div>
                        <div className="form-group" style={{ marginBottom: '0' }}>
                          <input
                            type="number"
                            step={step}
                            min={0}
                            max={max ?? undefined}
                            value={nilaiKriteria[kr.id] || ''}
                            onChange={(e) => handleNilaiChange(kr.id, e.target.value)}
                            placeholder={placeholder}
                            required
                            style={{
                              padding: '10px 12px',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading || !selectedKandidat}
              >
                {loading ? 'Loading...' : 'Simpan'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={handleCancel}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={!!editingId}
        onClose={handleCancel}
        title="Edit Penilaian"
        size="large"
      >
        <div>
          <form onSubmit={handleUpdateKandidat}>
            <div className="form-group">
              <label htmlFor="kandidat_edit">
                Kandidat
              </label>
              <input
                type="text"
                id="kandidat_edit"
                value={kandidats.find(k => k.id === editingId)?.nama || ''}
                disabled
                style={{ 
                  backgroundColor: '#f0f0f0',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            <div style={{ 
              marginTop: '20px', 
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Kriteria dan Nilai:
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '15px',
              alignItems: 'center'
            }}>
              <div style={{ 
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#2c3e50',
                paddingLeft: '5px'
              }}>
                Kriteria
              </div>
              <div style={{ 
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#2c3e50',
                paddingLeft: '5px'
              }}>
                Nilai
              </div>
              {kriterias.map(kr => {
                const { max, step, placeholder, label } = getSkalaConfig(kr.skala);
                return (
                  <React.Fragment key={kr.id}>
                    <div style={{ 
                      padding: '12px',
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#2c3e50',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span>{kr.nama_kriteria}</span>
                      <span style={{
                        background: '#e3eaf7',
                        color: '#1d4ed8',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {label}
                      </span>
                    </div>
                    <div className="form-group" style={{ marginBottom: '0' }}>
                      <input
                        type="number"
                        step={step}
                        min={0}
                        max={max ?? undefined}
                        value={nilaiKriteria[kr.id] || ''}
                        onChange={(e) => handleNilaiChange(kr.id, e.target.value)}
                        placeholder={placeholder}
                        required
                        style={{
                          padding: '10px 12px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Update'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={handleCancel}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Table
        columns={getPivotColumns()}
        data={getPivotTableData()}
        onEdit={handleEditKandidat}
        onDelete={handleDeleteKandidat}
        loading={tableLoading}
        error={tableError}
      />
    </div>
  );
};

export default PenilaianPage;
