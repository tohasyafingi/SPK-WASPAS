/**
 * Kriteria Controller
 * Handle HTTP requests untuk Kriteria
 */
import KriteriaService from '../service/KriteriaService.js';

export const getAllKriteria = async (req, res) => {
  try {
    const kriterias = await KriteriaService.getAll();
    res.json({
      status: 'success',
      data: kriterias
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getKriteriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const kriteria = await KriteriaService.getById(parseInt(id));
    res.json({
      status: 'success',
      data: kriteria
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

export const createKriteria = async (req, res) => {
  try {
    const { nama_kriteria, bobot, tipe, skala } = req.body;

    const id = await KriteriaService.create({
      nama_kriteria,
      bobot: parseFloat(bobot),
      tipe,
      skala
    });

    res.status(201).json({
      status: 'success',
      message: 'Kriteria berhasil ditambahkan',
      data: { id }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateKriteria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_kriteria, bobot, tipe, skala } = req.body;

    const kriteria = await KriteriaService.update(parseInt(id), {
      nama_kriteria,
      bobot: parseFloat(bobot),
      tipe,
      skala
    });

    res.json({
      status: 'success',
      message: 'Kriteria berhasil diperbarui',
      data: kriteria
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const deleteKriteria = async (req, res) => {
  try {
    const { id } = req.params;
    await KriteriaService.delete(parseInt(id));

    res.json({
      status: 'success',
      message: 'Kriteria berhasil dihapus'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
