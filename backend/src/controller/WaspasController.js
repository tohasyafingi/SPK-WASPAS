/**
 * WASPAS Controller
 * Handle HTTP requests untuk perhitungan WASPAS
 */
import WaspasService from '../service/WaspasService.js';

// Simple in-memory cache for /api/hasil
let hasilCache = {
  data: null,
  timestamp: 0
};
const HASIL_CACHE_TTL_MS = parseInt(process.env.HASIL_CACHE_TTL_MS || '60000', 10); // default 60s

export const hitungHasil = async (req, res) => {
  try {
    const now = Date.now();
    const isFresh = hasilCache.data && (now - hasilCache.timestamp < HASIL_CACHE_TTL_MS);

    if (isFresh) {
      res.setHeader('X-Cache', 'HIT');
      return res.json({
        status: 'success',
        message: 'Perhitungan WASPAS (cached)',
        data: hasilCache.data
      });
    }

    const hasil = await WaspasService.hitungHasil();
    hasilCache = { data: hasil, timestamp: now };
    res.setHeader('X-Cache', 'MISS');
    return res.json({
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
