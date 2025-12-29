import React, { useState, useEffect } from 'react';
import Form from '../components/Form';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { kandidatAPI } from '../services/apiService';
import { useApi } from '../hooks/useApi';
import './CRUD.css';

/**
 * Halaman CRUD Kandidat
 */
const KandidatPage = () => {
  const [kandidats, setKandidats] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const { loading, error, request } = useApi();

  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);

  const kandidatFields = [
    { name: 'nama', label: 'Nama Kandidat', type: 'text', required: true, placeholder: 'Masukkan nama' },
    { name: 'asal_kamar', label: 'Asal Kamar', type: 'text', required: true, placeholder: 'Masukkan asal kamar' },
    { name: 'usia', label: 'Usia', type: 'number', required: true, min: 0, max: 150 },
    { name: 'masa_tinggal', label: 'Masa Tinggal (tahun)', type: 'number', required: true, min: 0 },
    { name: 'keterangan', label: 'Keterangan', type: 'textarea', required: false }
  ];

  // Load data kandidat
  useEffect(() => {
    loadKandidats();
  }, []);

  const loadKandidats = async () => {
    try {
      setTableLoading(true);
      const response = await request(() => kandidatAPI.getAll());
      setKandidats(response.data || []);
      setTableError(null);
    } catch (err) {
      setTableError(err.message);
    } finally {
      setTableLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await request(() => kandidatAPI.create(formData));
      setShowForm(false);
      await loadKandidats();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await request(() => kandidatAPI.update(editingId, formData));
      setEditingId(null);
      setEditingData(null);
      await loadKandidats();
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
        await request(() => kandidatAPI.delete(id));
        await loadKandidats();
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
    { key: 'nama', label: 'Nama' },
    { key: 'asal_kamar', label: 'Asal Kamar' },
    { key: 'usia', label: 'Usia' },
    { key: 'masa_tinggal', label: 'Masa Tinggal' }
  ];

  return (
    <div className="page-container">
      <h1>Manajemen Kandidat</h1>

      <button 
        className="btn-primary"
        onClick={() => setShowForm(true)}
      >
        + Tambah Kandidat
      </button>

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title="Tambah Kandidat Baru"
        size="medium"
      >
        <Form
          title=""
          fields={kandidatFields}
          onSubmit={handleCreate}
          onCancel={handleCancel}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={!!editingId}
        onClose={handleCancel}
        title="Edit Kandidat"
        size="medium"
      >
        <Form
          title=""
          fields={kandidatFields}
          initialData={editingData}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          loading={loading}
        />
      </Modal>

      <Table
        columns={columns}
        data={[...kandidats]
          .sort((a, b) => (a.nama || '').localeCompare(b.nama || '', undefined, { sensitivity: 'base' }))
          .map((row, idx) => ({ ...row, no: idx + 1 }))}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={tableLoading}
        error={tableError}
      />
    </div>
  );
};

export default KandidatPage;
