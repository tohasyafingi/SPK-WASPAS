/**
 * Kandidat Controller
 * Handle HTTP requests untuk Kandidat
 */
import KandidatService from '../service/KandidatService.js';

export const getAllKandidat = async (req, res) => {
  try {
    const kandidats = await KandidatService.getAll();
    res.json({
      status: 'success',
      data: kandidats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getKandidatById = async (req, res) => {
  try {
    const { id } = req.params;
    const kandidat = await KandidatService.getById(parseInt(id));
    res.json({
      status: 'success',
      data: kandidat
    });
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    });
  }
};

export const createKandidat = async (req, res) => {
  try {
    const { nama, asal_kamar, usia, masa_tinggal, keterangan } = req.body;

    const id = await KandidatService.create({
      nama,
      asal_kamar,
      usia: parseInt(usia),
      masa_tinggal: parseInt(masa_tinggal),
      keterangan
    });

    res.status(201).json({
      status: 'success',
      message: 'Kandidat berhasil ditambahkan',
      data: { id }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const updateKandidat = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, asal_kamar, usia, masa_tinggal, keterangan } = req.body;

    const kandidat = await KandidatService.update(parseInt(id), {
      nama,
      asal_kamar,
      usia: parseInt(usia),
      masa_tinggal: parseInt(masa_tinggal),
      keterangan
    });

    res.json({
      status: 'success',
      message: 'Kandidat berhasil diperbarui',
      data: kandidat
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const deleteKandidat = async (req, res) => {
  try {
    const { id } = req.params;
    await KandidatService.delete(parseInt(id));

    res.json({
      status: 'success',
      message: 'Kandidat berhasil dihapus'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
