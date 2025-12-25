/**
 * Kandidat Repository
 * Handle semua operasi database untuk tabel Kandidat
 */
import { getDatabase } from '../database/db.js';

class KandidatRepository {
  /**
   * Get semua kandidat
   */
  async getAll() {
    const db = getDatabase();
    return await db.all('SELECT * FROM kandidat ORDER BY id');
  }

  /**
   * Get kandidat by ID
   */
  async getById(id) {
    const db = getDatabase();
    return await db.get('SELECT * FROM kandidat WHERE id = ?', [id]);
  }

  /**
   * Create kandidat baru
   */
  async create(kandidatData) {
    const db = getDatabase();
    const { nama, asal_kamar, usia, masa_tinggal, keterangan } = kandidatData;

    const result = await db.run(
      `INSERT INTO kandidat (nama, asal_kamar, usia, masa_tinggal, keterangan)
       VALUES (?, ?, ?, ?, ?)`,
      [nama, asal_kamar, usia, masa_tinggal, keterangan || null]
    );

    return result.lastID;
  }

  /**
   * Update kandidat
   */
  async update(id, kandidatData) {
    const db = getDatabase();
    const { nama, asal_kamar, usia, masa_tinggal, keterangan } = kandidatData;

    await db.run(
      `UPDATE kandidat 
       SET nama = ?, asal_kamar = ?, usia = ?, masa_tinggal = ?, keterangan = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [nama, asal_kamar, usia, masa_tinggal, keterangan || null, id]
    );

    return await this.getById(id);
  }

  /**
   * Delete kandidat
   */
  async delete(id) {
    const db = getDatabase();
    await db.run('DELETE FROM kandidat WHERE id = ?', [id]);
  }

  /**
   * Get kandidat count
   */
  async count() {
    const db = getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM kandidat');
    return result.count;
  }
}

export default new KandidatRepository();
