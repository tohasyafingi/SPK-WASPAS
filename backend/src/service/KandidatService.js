/**
 * Kandidat Service
 * Business logic untuk Kandidat
 */
import KandidatRepository from '../repository/KandidatRepository.js';

class KandidatService {
  /**
   * Get semua kandidat
   */
  async getAll() {
    return await KandidatRepository.getAll();
  }

  /**
   * Get kandidat by ID
   */
  async getById(id) {
    const kandidat = await KandidatRepository.getById(id);
    if (!kandidat) {
      throw new Error(`Kandidat dengan ID ${id} tidak ditemukan`);
    }
    return kandidat;
  }

  /**
   * Create kandidat baru dengan validasi
   */
  async create(kandidatData) {
    this._validateKandidatData(kandidatData);
    return await KandidatRepository.create(kandidatData);
  }

  /**
   * Update kandidat dengan validasi
   */
  async update(id, kandidatData) {
    await this.getById(id); // Validate ID exists
    this._validateKandidatData(kandidatData);
    return await KandidatRepository.update(id, kandidatData);
  }

  /**
   * Delete kandidat
   */
  async delete(id) {
    await this.getById(id); // Validate ID exists
    await KandidatRepository.delete(id);
  }

  /**
   * Validasi data kandidat
   */
  _validateKandidatData(data) {
    if (!data.nama || data.nama.trim() === '') {
      throw new Error('Nama kandidat harus diisi');
    }

    if (!data.asal_kamar || data.asal_kamar.trim() === '') {
      throw new Error('Asal kamar harus diisi');
    }

    if (!Number.isInteger(data.usia) || data.usia < 0 || data.usia > 150) {
      throw new Error('Usia harus berupa angka positif antara 0-150');
    }

    if (!Number.isInteger(data.masa_tinggal) || data.masa_tinggal < 0) {
      throw new Error('Masa tinggal harus berupa angka positif');
    }
  }
}

export default new KandidatService();
