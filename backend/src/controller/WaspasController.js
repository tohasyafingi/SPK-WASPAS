/**
 * WASPAS Controller
 * Handle HTTP requests untuk perhitungan WASPAS
 */
import WaspasService from '../service/WaspasService.js';

export const hitungHasil = async (req, res) => {
  try {
    const hasil = await WaspasService.hitungHasil();
    res.json({
      status: 'success',
      message: 'Perhitungan WASPAS berhasil',
      data: hasil
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

export const getDetailPerhitungan = async (req, res) => {
  try {
    const { kandidatId } = req.params;
    const detail = await WaspasService.getDetailPerhitungan(parseInt(kandidatId));
    res.json({
      status: 'success',
      data: detail
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};
