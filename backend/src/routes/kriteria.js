/**
 * Routes untuk Kriteria
 */
import express from 'express';
import * as KriteriaController from '../controller/KriteriController.js';

const router = express.Router();

/**
 * GET /api/kriteria - Get semua kriteria
 * POST /api/kriteria - Create kriteria baru
 */
router.get('/', KriteriaController.getAllKriteria);
router.post('/', KriteriaController.createKriteria);

/**
 * GET /api/kriteria/:id - Get kriteria by ID
 * PUT /api/kriteria/:id - Update kriteria
 * DELETE /api/kriteria/:id - Delete kriteria
 */
router.get('/:id', KriteriaController.getKriteriaById);
router.put('/:id', KriteriaController.updateKriteria);
router.delete('/:id', KriteriaController.deleteKriteria);

export default router;
