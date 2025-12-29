/**
 * Penilaian Service
 * Business logic untuk Penilaian
 */
import PenilaianRepository from '../repository/PenilaianRepository.js';
import KandidatRepository from '../repository/KandidatRepository.js';
import KriteriaRepository from '../repository/KriteriaRepository.js';

class PenilaianService {
  /**
   * Get semua penilaian
   */
  async getAll() {
    return await PenilaianRepository.getAll();
  }

  /**
   * Get penilaian by ID
   */
  async getById(id) {
    const penilaian = await PenilaianRepository.getById(id);
    if (!penilaian) {
      throw new Error(`Penilaian dengan ID ${id} tidak ditemukan`);
    }
    return penilaian;
  }

  /**
   * Get penilaian by kandidat ID
   */
  async getByKandidatId(kandidat_id) {
    return await PenilaianRepository.getByKandidatId(kandidat_id);
  }

  /**
   * Create penilaian baru dengan validasi
   */
  async create(penilaianData) {
    await this._validatePenilaianData(penilaianData);
    return await PenilaianRepository.create(penilaianData);
  }

  /**
   * Update penilaian dengan validasi
   */
  async update(id, penilaianData) {
    const existing = await this.getById(id); // pastikan data ada

    // Gabungkan kandidat_id dan kriteria_id dari data lama jika tidak dikirim dari client
    const mergedData = {
      kandidat_id: penilaianData.kandidat_id || existing.kandidat_id,
      kriteria_id: penilaianData.kriteria_id || existing.kriteria_id,
      nilai: penilaianData.nilai
    };

    await this._validatePenilaianData(mergedData, false);
    return await PenilaianRepository.update(id, penilaianData);
  }

  /**
   * Delete penilaian
   */
  async delete(id) {
    await this.getById(id); // Validate ID exists
    await PenilaianRepository.delete(id);
  }

  /**
   * Validasi data penilaian
   */
  async _validatePenilaianData(data, checkDuplicate = true) {
    if (!data.kandidat_id) {
      throw new Error('Kandidat ID harus diisi');
    }

    if (!data.kriteria_id) {
      throw new Error('Kriteria ID harus diisi');
    }

    if (typeof data.nilai !== 'number' || data.nilai < 0) {
      throw new Error('Nilai harus berupa angka positif');
    }

    // Validasi kandidat exists
    const kandidat = await KandidatRepository.getById(data.kandidat_id);
    if (!kandidat) {
      throw new Error(`Kandidat dengan ID ${data.kandidat_id} tidak ditemukan`);
    }

    // Validasi kriteria exists
    const kriteria = await KriteriaRepository.getById(data.kriteria_id);
    if (!kriteria) {
      throw new Error(`Kriteria dengan ID ${data.kriteria_id} tidak ditemukan`);
    }

    // Check duplicate (untuk create)
    if (checkDuplicate) {
      const existing = await PenilaianRepository.getByKandidatAndKriteria(
        data.kandidat_id,
        data.kriteria_id
      );
      if (existing) {
        throw new Error(
          `Penilaian untuk kandidat ${data.kandidat_id} dan kriteria ${data.kriteria_id} sudah ada`
        );
      }
    }
  }
}

export default new PenilaianService();
