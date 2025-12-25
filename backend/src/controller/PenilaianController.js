/**
 * Penilaian Controller
 * Handle HTTP requests untuk Penilaian
 */
import PenilaianService from '../service/PenilaianService.js';

export const getAllPenilaian = async (req, res) => {
  try {
    const penilaians = await PenilaianService.getAll();
    res.json({
      status: 'success',
      data: penilaians
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getPenilaianById = async (req, res) => {
  try {
    const { id } = req.params;
    const penilaian = await PenilaianService.getById(parseInt(id));
    res.json({
      status: 'success',
      data: penilaian
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getPenilaianByKandidatId = async (req, res) => {
  try {
    const { kandidatId } = req.params;
    const penilaians = await PenilaianService.getByKandidatId(parseInt(kandidatId));
    res.json({
      status: 'success',
      data: penilaians
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

export const createPenilaian = async (req, res) => {
  try {
    const { kandidat_id, kriteria_id, nilai } = req.body;

    const id = await PenilaianService.create({
      kandidat_id: parseInt(kandidat_id),
      kriteria_id: parseInt(kriteria_id),
      nilai: parseFloat(nilai)
    });

    res.status(201).json({
      status: 'success',
      message: 'Penilaian berhasil ditambahkan',
      data: { id }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updatePenilaian = async (req, res) => {
  try {
    const { id } = req.params;
    const { nilai } = req.body;

    const penilaian = await PenilaianService.update(parseInt(id), {
      nilai: parseFloat(nilai)
    });

    res.json({
      status: 'success',
      message: 'Penilaian berhasil diperbarui',
      data: penilaian
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const deletePenilaian = async (req, res) => {
  try {
    const { id } = req.params;
    await PenilaianService.delete(parseInt(id));

    res.json({
      status: 'success',
      message: 'Penilaian berhasil dihapus'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
