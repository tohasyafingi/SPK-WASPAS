/**
 * Kriteria Repository
 * Handle semua operasi database untuk tabel Kriteria
 */
import { getDatabase } from '../database/db.js';

class KriteriaRepository {
  /**
   * Get semua kriteria
   */
  async getAll() {
    const db = getDatabase();
    return await db.all('SELECT * FROM kriteria ORDER BY id');
  }

  /**
   * Get kriteria by ID
   */
  async getById(id) {
    const db = getDatabase();
    return await db.get('SELECT * FROM kriteria WHERE id = ?', [id]);
  }

  /**
   * Create kriteria baru
   */
  async create(kriteriaData) {
    const db = getDatabase();
    const { nama_kriteria, bobot, tipe } = kriteriaData;

    const result = await db.run(
      `INSERT INTO kriteria (nama_kriteria, bobot, tipe)
       VALUES (?, ?, ?)`,
      [nama_kriteria, bobot, tipe]
    );

    return result.lastID;
  }

  /**
   * Update kriteria
   */
  async update(id, kriteriaData) {
    const db = getDatabase();
    const { nama_kriteria, bobot, tipe } = kriteriaData;

    await db.run(
      `UPDATE kriteria 
       SET nama_kriteria = ?, bobot = ?, tipe = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [nama_kriteria, bobot, tipe, id]
    );

    return await this.getById(id);
  }

  /**
   * Delete kriteria
   */
  async delete(id) {
    const db = getDatabase();
    await db.run('DELETE FROM kriteria WHERE id = ?', [id]);
  }

  /**
   * Get kriteria count
   */
  async count() {
    const db = getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM kriteria');
    return result.count;
  }

  /**
   * Get total bobot (untuk validasi bahwa bobot = 1)
   */
  async getTotalBobot() {
    const db = getDatabase();
    const result = await db.get('SELECT SUM(bobot) as total FROM kriteria');
    return result.total || 0;
  }
}

export default new KriteriaRepository();
