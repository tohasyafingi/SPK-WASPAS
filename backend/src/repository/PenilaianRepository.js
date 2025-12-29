/**
 * Penilaian Repository
 * Handle semua operasi database untuk tabel Penilaian
 */
import { getDatabase } from '../database/db.js';

class PenilaianRepository {
  /**
   * Get semua penilaian
   */
  async getAll() {
    const db = getDatabase();
    return await db.all(`
      SELECT p.*, k.nama, kr.nama_kriteria, kr.tipe, kr.skala
      FROM penilaian p
      JOIN kandidat k ON p.kandidat_id = k.id
      JOIN kriteria kr ON p.kriteria_id = kr.id
      ORDER BY p.kandidat_id, p.kriteria_id
    `);
  }

  /**
   * Get penilaian by ID
   */
  async getById(id) {
    const db = getDatabase();
    return await db.get(`
      SELECT p.*, k.nama, kr.nama_kriteria, kr.tipe
      FROM penilaian p
      JOIN kandidat k ON p.kandidat_id = k.id
      JOIN kriteria kr ON p.kriteria_id = kr.id
      WHERE p.id = ?
    `, [id]);
  }

  /**
   * Get penilaian by kandidat_id dan kriteria_id
   */
  async getByKandidatAndKriteria(kandidat_id, kriteria_id) {
    const db = getDatabase();
    return await db.get(
      `SELECT * FROM penilaian WHERE kandidat_id = ? AND kriteria_id = ?`,
      [kandidat_id, kriteria_id]
    );
  }

  /**
   * Get semua penilaian untuk satu kandidat
   */
  async getByKandidatId(kandidat_id) {
    const db = getDatabase();
    return await db.all(`
      SELECT p.*, kr.nama_kriteria, kr.tipe, kr.bobot, kr.skala
      FROM penilaian p
      JOIN kriteria kr ON p.kriteria_id = kr.id
      WHERE p.kandidat_id = ?
      ORDER BY p.kriteria_id
    `, [kandidat_id]);
  }

  /**
   * Get semua penilaian untuk satu kriteria (untuk normalisasi)
   */
  async getByKriteriaId(kriteria_id) {
    const db = getDatabase();
    return await db.all(
      `SELECT * FROM penilaian WHERE kriteria_id = ? ORDER BY nilai DESC`,
      [kriteria_id]
    );
  }

  /**
   * Create penilaian baru
   */
  async create(penilaianData) {
    const db = getDatabase();
    const { kandidat_id, kriteria_id, nilai } = penilaianData;

    const result = await db.run(
      `INSERT INTO penilaian (kandidat_id, kriteria_id, nilai)
       VALUES (?, ?, ?)`,
      [kandidat_id, kriteria_id, nilai]
    );

    return result.lastID;
  }

  /**
   * Update penilaian
   */
  async update(id, penilaianData) {
    const db = getDatabase();
    const { nilai } = penilaianData;

    await db.run(
      `UPDATE penilaian 
       SET nilai = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [nilai, id]
    );

    return await this.getById(id);
  }

  /**
   * Delete penilaian
   */
  async delete(id) {
    const db = getDatabase();
    await db.run('DELETE FROM penilaian WHERE id = ?', [id]);
  }

  /**
   * Delete penilaian by kandidat_id dan kriteria_id
   */
  async deleteByKandidatAndKriteria(kandidat_id, kriteria_id) {
    const db = getDatabase();
    await db.run(
      `DELETE FROM penilaian WHERE kandidat_id = ? AND kriteria_id = ?`,
      [kandidat_id, kriteria_id]
    );
  }

  /**
   * Get penilaian count
   */
  async count() {
    const db = getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM penilaian');
    return result.count;
  }

  /**
   * Get max nilai untuk kriteria tertentu
   */
  async getMaxNilaiByKriteria(kriteria_id) {
    const db = getDatabase();
    const result = await db.get(
      `SELECT MAX(nilai) as max_nilai FROM penilaian WHERE kriteria_id = ?`,
      [kriteria_id]
    );
    return result.max_nilai || 0;
  }

  /**
   * Get min nilai untuk kriteria tertentu (untuk cost)
   */
  async getMinNilaiByKriteria(kriteria_id) {
    const db = getDatabase();
    const result = await db.get(
      `SELECT MIN(nilai) as min_nilai FROM penilaian WHERE kriteria_id = ?`,
      [kriteria_id]
    );
    return result.min_nilai || 0;
  }
}

export default new PenilaianRepository();
