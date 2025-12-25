/**
 * Routes untuk Penilaian
 */
import express from 'express';
import * as PenilaianController from '../controller/PenilaianController.js';

const router = express.Router();

/**
 * GET /api/penilaian - Get semua penilaian
 * POST /api/penilaian - Create penilaian baru
 */
router.get('/', PenilaianController.getAllPenilaian);
router.post('/', PenilaianController.createPenilaian);

/**
 * GET /api/penilaian/:id - Get penilaian by ID
 * PUT /api/penilaian/:id - Update penilaian
 * DELETE /api/penilaian/:id - Delete penilaian
 */
router.get('/:id', PenilaianController.getPenilaianById);
router.put('/:id', PenilaianController.updatePenilaian);
router.delete('/:id', PenilaianController.deletePenilaian);

/**
 * GET /api/penilaian/kandidat/:kandidatId - Get penilaian by kandidat ID
 */
router.get('/kandidat/:kandidatId', PenilaianController.getPenilaianByKandidatId);

export default router;
