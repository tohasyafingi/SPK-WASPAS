/**
 * Kriteria Service
 * Business logic untuk Kriteria
 */
import KriteriaRepository from '../repository/KriteriaRepository.supabase.js';

class KriteriaService {
  /**
   * Get semua kriteria
   */
  async getAll() {
    return await KriteriaRepository.getAll();
  }

  /**
   * Get kriteria by ID
   */
  async getById(id) {
    const kriteria = await KriteriaRepository.getById(id);
    if (!kriteria) {
      throw new Error(`Kriteria dengan ID ${id} tidak ditemukan`);
    }
    return kriteria;
  }

  /**
   * Create kriteria baru dengan validasi
   */
  async create(kriteriaData) {
    this._validateKriteriaData(kriteriaData);
    return await KriteriaRepository.create(kriteriaData);
  }

  /**
   * Update kriteria dengan validasi
   */
  async update(id, kriteriaData) {
    await this.getById(id); // Validate ID exists
    this._validateKriteriaData(kriteriaData);
    return await KriteriaRepository.update(id, kriteriaData);
  }

  /**
   * Delete kriteria
   */
  async delete(id) {
    await this.getById(id); // Validate ID exists
    await KriteriaRepository.delete(id);
  }

  /**
   * Validasi data kriteria
   */
  _validateKriteriaData(data) {
    if (!data.nama_kriteria || data.nama_kriteria.trim() === '') {
      throw new Error('Nama kriteria harus diisi');
    }

    if (typeof data.bobot !== 'number' || data.bobot <= 0 || data.bobot > 1) {
      throw new Error('Bobot harus berupa angka antara 0 < bobot ≤ 1');
    }

    if (!['benefit', 'cost'].includes(data.tipe)) {
      throw new Error('Tipe harus "benefit" atau "cost"');
    }

    const skala = data.skala || '1-10';
    if (!['1-10', '1-100', 'persen', 'jumlah'].includes(skala)) {
      throw new Error('Skala harus salah satu dari 1-10, 1-100, persen, atau jumlah');
    }

    // Normalisasi skala agar selalu terset
    data.skala = skala;
  }
}

export default new KriteriaService();
