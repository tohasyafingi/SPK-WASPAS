/**
 * Routes untuk Kandidat
 */
import express from 'express';
import * as KandidatController from '../controller/KandidatController.js';

const router = express.Router();

/**
 * GET /api/kandidat - Get semua kandidat
 * POST /api/kandidat - Create kandidat baru
 */
router.get('/', KandidatController.getAllKandidat);
router.post('/', KandidatController.createKandidat);

/**
 * GET /api/kandidat/:id - Get kandidat by ID
 * PUT /api/kandidat/:id - Update kandidat
 * DELETE /api/kandidat/:id - Delete kandidat
 */
router.get('/:id', KandidatController.getKandidatById);
router.put('/:id', KandidatController.updateKandidat);
router.delete('/:id', KandidatController.deleteKandidat);

export default router;
