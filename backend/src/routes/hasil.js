/**
 * Routes untuk WASPAS (Hasil dan Perhitungan)
 */
import express from 'express';
import * as WaspasController from '../controller/WaspasController.js';

const router = express.Router();

/**
 * GET /api/hasil - Hitung dan get hasil ranking WASPAS
 */
router.get('/', WaspasController.hitungHasil);

/**
 * GET /api/hasil/:kandidatId/detail - Get detail perhitungan untuk satu kandidat
 */
router.get('/:kandidatId/detail', WaspasController.getDetailPerhitungan);

export default router;
