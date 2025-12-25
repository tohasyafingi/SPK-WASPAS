import React, { useState, useEffect } from 'react';
import Form from '../components/Form';
import Table from '../components/Table';
import { kriteriaAPI } from '../services/apiService';
import { useApi } from '../hooks/useApi';
import './CRUD.css';
import { TbTrendingUp, TbTrendingDown } from 'react-icons/tb';

/**
 * Halaman CRUD Kriteria
 */
const KriteriaPage = () => {
  const [kriterias, setKriterias] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const { loading, error, request } = useApi();

  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);

  const kriteriaFields = [
    { name: 'nama_kriteria', label: 'Nama Kriteria', type: 'text', required: true, placeholder: 'Masukkan nama kriteria' },
    { name: 'bobot', label: 'Bobot (0-1)', type: 'number', required: true, min: 0.01, max: 1, step: 0.01 },
    { 
      name: 'tipe', 
      label: 'Tipe Kriteria', 
      type: 'select', 
      required: true,
      options: [
        { value: 'benefit', label: 'Benefit (Semakin Tinggi Semakin Baik)' },
        { value: 'cost', label: 'Cost (Semakin Rendah Semakin Baik)' }
      ]
    }
  ];

  // Load data kriteria
  useEffect(() => {
    loadKriterias();
  }, []);

  const loadKriterias = async () => {
    try {
      setTableLoading(true);
      const response = await request(() => kriteriaAPI.getAll());
      setKriterias(response.data || []);
      setTableError(null);
    } catch (err) {
      setTableError(err.message);
    } finally {
      setTableLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await request(() => kriteriaAPI.create(formData));
      setShowForm(false);
      await loadKriterias();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await request(() => kriteriaAPI.update(editingId, formData));
      setEditingId(null);
      setEditingData(null);
      await loadKriterias();
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
        await request(() => kriteriaAPI.delete(id));
        await loadKriterias();
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
    { key: 'nama_kriteria', label: 'Nama Kriteria' },
    { key: 'bobot', label: 'Bobot' },
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
      <h1>Manajemen Kriteria</h1>
      
      {!showForm && !editingId && (
        <button 
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Tambah Kriteria
        </button>
      )}

      {showForm && (
        <Form
          title="Tambah Kriteria Baru"
          fields={kriteriaFields}
          onSubmit={handleCreate}
          onCancel={handleCancel}
          loading={loading}
        />
      )}

      {editingId && (
        <Form
          title="Edit Kriteria"
          fields={kriteriaFields}
          initialData={editingData}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          loading={loading}
        />
      )}

      <Table
        columns={columns}
        data={[...kriterias]
          .sort((a, b) => (a.nama_kriteria || '').localeCompare(b.nama_kriteria || '', undefined, { sensitivity: 'base' }))
          .map((row, idx) => ({ ...row, no: idx + 1 }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
        error={tableError}
      />
    </div>
  );
};

export default KriteriaPage;
