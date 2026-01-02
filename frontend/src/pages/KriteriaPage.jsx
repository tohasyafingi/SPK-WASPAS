import React, { useState, useEffect } from 'react';
import Form from '../components/Form';
import Table from '../components/Table';
import Modal from '../components/Modal';
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
  const { loading, request } = useApi();

  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState(null);

  const kriteriaFields = [
    { name: 'nama_kriteria', label: 'Nama Kriteria', type: 'text', required: true, placeholder: 'Masukkan nama kriteria' },
    { name: 'bobot', label: 'Bobot (0-1)', type: 'number', required: true, min: 0.01, max: 1, step: 0.01 },
    {
      name: 'skala',
      label: 'Skala Penilaian',
      type: 'select',
      required: true,
      options: [
        { value: '1-10', label: '1-10' },
        { value: '1-100', label: '1-100' },
        { value: 'persen', label: 'Persen (%)' },
        { value: 'jumlah', label: 'Jumlah (count)' }
      ]
    },
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

  // Load data kriteria
  useEffect(() => {
    loadKriterias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateTotalBobot = (newBobot, excludeId = null) => {
    const currentTotal = kriterias
      .filter(k => k.id !== excludeId)
      .reduce((sum, k) => sum + parseFloat(k.bobot || 0), 0);
    const newTotal = currentTotal + parseFloat(newBobot || 0);
    return newTotal;
  };

  const handleCreate = async (formData) => {
    const totalBobot = validateTotalBobot(formData.bobot);
    
    if (totalBobot > 1.0) {
      alert(`Total bobot tidak boleh melebihi 1.0!\n\nTotal saat ini: ${totalBobot.toFixed(2)}`);
      return;
    }

    try {
      await request(() => kriteriaAPI.create(formData));
      setShowForm(false);
      await loadKriterias();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleUpdate = async (formData) => {
    const totalBobot = validateTotalBobot(formData.bobot, editingId);
    
    if (totalBobot > 1.0) {
      alert(`Total bobot tidak boleh melebihi 1.0!\n\nTotal saat ini: ${totalBobot.toFixed(2)}`);
      return;
    }

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
    setEditingData({ ...row, skala: row.skala || '1-10' });
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
    { key: 'bobot', label: 'Bobot', align: 'center' },
    { key: 'skala', label: 'Skala', align: 'center' },
    { key: 'tipe', label: 'Tipe', render: (row) => (
      row.tipe === 'benefit' ? (
        <><TbTrendingUp style={{ marginRight: '4px', verticalAlign: 'middle' }} />Benefit</>
      ) : (
        <><TbTrendingDown style={{ marginRight: '4px', verticalAlign: 'middle' }} />Cost</>
      )
    ) }
  ];

  const totalBobotSaat = kriterias.reduce((sum, k) => sum + parseFloat(k.bobot || 0), 0);

  return (
    <div className="page-container">
      <h1>Manajemen Kriteria</h1>

      <div style={{
        backgroundColor: '#f0f8ff',
        border: '1px solid #4CAF50',
        borderRadius: '6px',
        padding: '12px 16px',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <strong>Total Bobot Kriteria:</strong> <span style={{
          color: totalBobotSaat > 1.0 ? '#d32f2f' : '#4CAF50',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>{totalBobotSaat.toFixed(2)}</span> / 1.00
        {totalBobotSaat > 1.0 && <span style={{ color: '#d32f2f', marginLeft: '8px' }}>❌ Melebihi batas maksimal!</span>}
        {totalBobotSaat === 1.0 && <span style={{ color: '#4CAF50', marginLeft: '8px' }}>✅ Sempurna!</span>}
      </div>

      <button 
        className="btn-primary"
        onClick={() => setShowForm(true)}
      >
        + Tambah Kriteria
      </button>

      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title="Tambah Kriteria Baru"
        size="medium"
      >
        <Form
          title=""
          fields={kriteriaFields}
          onSubmit={handleCreate}
          onCancel={handleCancel}
          loading={loading}
        />
      </Modal>

      <Modal
        isOpen={!!editingId}
        onClose={handleCancel}
        title="Edit Kriteria"
        size="medium"
      >
        <Form
          title=""
          fields={kriteriaFields}
          initialData={editingData}
          onSubmit={handleUpdate}
          onCancel={handleCancel}
          loading={loading}
        />
      </Modal>

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
