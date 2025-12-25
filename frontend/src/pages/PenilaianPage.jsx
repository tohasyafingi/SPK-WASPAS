import React, { useState, useEffect } from 'react';
import Form from '../components/Form';
import Table from '../components/Table';
import { penilaianAPI, kandidatAPI, kriteriaAPI } from '../services/apiService';
import { useApi } from '../hooks/useApi';
import './CRUD.css';
import { TbTrendingUp, TbTrendingDown } from 'react-icons/tb';

/**
 * Halaman CRUD Penilaian
 */
const PenilaianPage = () => {
  const [penilaians, setPenilaians] = useState([]);
  const [kandidats, setKandidats] = useState([]);
  const [kriterias, setKriterias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const { loading, error, request } = useApi();

  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);

  // Load data awal
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

  const handleCreate = async (formData) => {
    try {
      formData.kandidat_id = parseInt(formData.kandidat_id);
      formData.kriteria_id = parseInt(formData.kriteria_id);
      formData.nilai = parseFloat(formData.nilai);
      
      await request(() => penilaianAPI.create(formData));
      setShowForm(false);
      await loadAllData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      formData.nilai = parseFloat(formData.nilai);
      await request(() => penilaianAPI.update(editingId, formData));
      setEditingId(null);
      setEditingData(null);
      await loadAllData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setEditingData(row);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        await request(() => penilaianAPI.delete(id));
        await loadAllData();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingData(null);
  };

  const columns = [
    { key: 'no', label: 'No' },
    { key: 'nama', label: 'Kandidat' },
    { key: 'nama_kriteria', label: 'Kriteria' },
    { key: 'nilai', label: 'Nilai' },
    { key: 'tipe', label: 'Tipe', render: (row) => (
      row.tipe === 'benefit' ? (
        <><TbTrendingUp style={{ marginRight: '4px', verticalAlign: 'middle' }} />Benefit</>
      ) : (
        <><TbTrendingDown style={{ marginRight: '4px', verticalAlign: 'middle' }} />Cost</>
      )
    ) }
  ];

  return (
    <div className="page-container">
      <h1>Manajemen Penilaian</h1>
      
      {!showForm && !editingId && (
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Tambah Penilaian
        </button>
      )}

      {showForm && (
        <Form
          title="Tambah Penilaian Baru"
          fields={penilaianFields}
          onSubmit={handleCreate}
          onCancel={handleCancel}
          loading={loading}
        />
      )}

      {editingId && (
        <Form
          title="Edit Penilaian"
          fields={penilaianFields.filter(f => f.name !== 'kandidat_id' && f.name !== 'kriteria_id')}
          initialData={editingData}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          loading={loading}
        />
      )}

      <Table
        columns={columns}
        data={[...penilaians]
          .sort((a, b) => {
            const byNama = (a.nama || '').localeCompare(b.nama || '', undefined, { sensitivity: 'base' });
            if (byNama !== 0) return byNama;
            return (a.nama_kriteria || '').localeCompare(b.nama_kriteria || '', undefined, { sensitivity: 'base' });
          })
          .map((row, idx) => ({ ...row, no: idx + 1 }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
        error={tableError}
      />
    </div>
  );
};

export default PenilaianPage;
