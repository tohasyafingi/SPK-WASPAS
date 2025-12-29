/**
 * WASPAS Service
 * Implementasi algoritma WASPAS untuk SPK
 * 
 * WASPAS = Weighted Aggregated Sum Product Assessment
 * 
 * Algoritma:
 * 1. Normalisasi: r_ij = x_ij / max(x_j) untuk benefit, min(x_j) / x_ij untuk cost
 * 2. WSM (Weighted Sum Model): S_i = Σ(w_j * r_ij)
 * 3. WPM (Weighted Product Model): P_i = Π(r_ij ^ w_j)
 * 4. Agregasi: Q_i = 0.5 * S_i + 0.5 * P_i
 * 5. Ranking: Sort by Q_i (descending)
 */
import KandidatRepository from '../repository/KandidatRepository.supabase.js';
import KriteriaRepository from '../repository/KriteriaRepository.supabase.js';
import PenilaianRepository from '../repository/PenilaianRepository.supabase.js';

class WaspasService {
  /**
   * Hitung hasil WASPAS untuk semua kandidat
   */
  async hitungHasil() {
    try {
      const kandidats = await KandidatRepository.getAll();
      const kriterias = await KriteriaRepository.getAll();

      // Jika belum ada data kandidat atau kriteria, kembalikan hasil kosong tanpa error
      if (kandidats.length === 0 || kriterias.length === 0) {
        return [];
      }

      // Validasi semua kandidat memiliki semua penilaian
      for (const kandidat of kandidats) {
        const penilaians = await PenilaianRepository.getByKandidatId(kandidat.id);
        // Jika ada kandidat yang belum lengkap penilaiannya, kembalikan hasil kosong tanpa melempar error
        if (penilaians.length !== kriterias.length) {
          return [];
        }
      }

      // Pastikan bobot ternormalisasi (Σ w_j = 1)
      const totalBobot = kriterias.reduce((sum, k) => sum + (k.bobot || 0), 0);
      if (totalBobot <= 0) {
        throw new Error('Total bobot kriteria harus lebih besar dari 0');
      }
      const normalizedKriterias = kriterias.map(k => ({
        ...k,
        bobot_norm: k.bobot / totalBobot
      }));

      // Step 1: Normalisasi
      const normalisasiData = await this._normalisasi(kandidats, normalizedKriterias);

      // Step 2: Hitung WSM (Weighted Sum Model)
      const wsmResults = this._hitungWSM(normalisasiData, normalizedKriterias);

      // Step 3: Hitung WPM (Weighted Product Model)
      const wpmResults = this._hitungWPM(normalisasiData, normalizedKriterias);

      // Step 4: Agregasi (WASPAS)
      const hasil = this._agregasi(wsmResults, wpmResults, kandidats);

      return hasil;
    } catch (error) {
      console.error('Error dalam hitungHasil:', error);
      throw error;
    }
  }

  /**
   * Step 1: Normalisasi nilai
   * - Benefit: r_ij = x_ij / max(x_j)
   * - Cost: r_ij = min(x_j) / x_ij
   */
  async _normalisasi(kandidats, kriterias) {
    const normalisasiData = {};

    for (const kandidat of kandidats) {
      normalisasiData[kandidat.id] = {};

      for (const kriteria of kriterias) {
        // Dapatkan penilaian kandidat untuk kriteria ini
        const penilaian = await PenilaianRepository.getByKandidatAndKriteria(
          kandidat.id,
          kriteria.id
        );

        if (!penilaian) {
          throw new Error(
            `Penilaian tidak ditemukan untuk kandidat ${kandidat.id} dan kriteria ${kriteria.id}`
          );
        }

        const nilai = penilaian.nilai;

        // Dapatkan semua nilai untuk kriteria ini
        const allValues = await PenilaianRepository.getByKriteriaId(kriteria.id);
        const nilaiValues = allValues.map(p => p.nilai);

        let nilaiNormalisasi;

        if (kriteria.tipe === 'benefit') {
          // Normalisasi benefit: nilai / max
          const maxNilai = Math.max(...nilaiValues);
          nilaiNormalisasi = nilai / maxNilai;
        } else {
          // Normalisasi cost: min / nilai
          const minNilai = Math.min(...nilaiValues);
          nilaiNormalisasi = minNilai / nilai;
        }

        normalisasiData[kandidat.id][kriteria.id] = {
          nilai_asli: nilai,
          nilai_normalisasi: nilaiNormalisasi,
          tipe: kriteria.tipe,
          bobot_norm: kriteria.bobot_norm ?? kriteria.bobot
        };
      }
    }

    return normalisasiData;
  }

  /**
   * Step 2: Hitung WSM (Weighted Sum Model)
   * WSM_i = Σ(w_j * r_ij)
   */
  _hitungWSM(normalisasiData, kriterias) {
    const wsmResults = {};

    for (const kandidatId in normalisasiData) {
      let wsm = 0;

      for (const kriteria of kriterias) {
        const rij = normalisasiData[kandidatId][kriteria.id].nilai_normalisasi;
        const wj = kriteria.bobot_norm ?? kriteria.bobot;
        wsm += wj * rij;
      }

      wsmResults[kandidatId] = wsm;
    }

    return wsmResults;
  }

  /**
   * Step 3: Hitung WPM (Weighted Product Model)
   * WPM_i = Π(r_ij ^ w_j)
   */
  _hitungWPM(normalisasiData, kriterias) {
    const wpmResults = {};

    for (const kandidatId in normalisasiData) {
      let wpm = 1;

      for (const kriteria of kriterias) {
        const rij = normalisasiData[kandidatId][kriteria.id].nilai_normalisasi;
        const wj = kriteria.bobot_norm ?? kriteria.bobot;
        wpm *= Math.pow(rij, wj);
      }

      wpmResults[kandidatId] = wpm;
    }

    return wpmResults;
  }

  /**
   * Step 4: Agregasi WASPAS
   * Q_i = 0.5 * WSM + 0.5 * WPM
   * Lalu ranking berdasarkan Q_i (descending)
   */
  _agregasi(wsmResults, wpmResults, kandidats) {
    const hasil = [];

    for (const kandidat of kandidats) {
      const wsm = wsmResults[kandidat.id];
      const wpm = wpmResults[kandidat.id];
      const qi = 0.5 * wsm + 0.5 * wpm;

      hasil.push({
        rank: 0, // Will be set after sorting
        kandidat_id: kandidat.id,
        nama: kandidat.nama,
        asal_kamar: kandidat.asal_kamar,
        usia: kandidat.usia,
        masa_tinggal: kandidat.masa_tinggal,
        wsm: parseFloat(wsm.toFixed(6)),
        wpm: parseFloat(wpm.toFixed(6)),
        qi: parseFloat(qi.toFixed(6))
      });
    }

    // Sort by Q_i descending
    hasil.sort((a, b) => b.qi - a.qi);

    // Set ranking
    hasil.forEach((item, index) => {
      item.rank = index + 1;
    });

    return hasil;
  }

  /**
   * Dapatkan detail perhitungan untuk satu kandidat
   */
  async getDetailPerhitungan(kandidatId) {
    try {
      const kandidat = await KandidatRepository.getById(kandidatId);
      if (!kandidat) {
        throw new Error('Kandidat tidak ditemukan');
      }

      const kriteriasRaw = await KriteriaRepository.getAll();
      const totalBobot = kriteriasRaw.reduce((sum, k) => sum + (k.bobot || 0), 0);
      if (totalBobot <= 0) {
        throw new Error('Total bobot kriteria harus lebih besar dari 0');
      }
      const kriterias = kriteriasRaw.map(k => ({
        ...k,
        bobot_norm: k.bobot / totalBobot
      }));
      const penilaians = await PenilaianRepository.getByKandidatId(kandidatId);

      const detail = {
        kandidat_id: kandidat.id,
        nama: kandidat.nama,
        penilaian_detail: []
      };

      for (const kriteria of kriterias) {
        const penilaian = penilaians.find(p => p.kriteria_id === kriteria.id);
        if (penilaian) {
          // Dapatkan nilai normalisasi
          const allValues = await PenilaianRepository.getByKriteriaId(kriteria.id);
          const nilaiValues = allValues.map(p => p.nilai);

          let nilaiNormalisasi, rumus;

          if (kriteria.tipe === 'benefit') {
            const maxNilai = Math.max(...nilaiValues);
            nilaiNormalisasi = penilaian.nilai / maxNilai;
            rumus = `${penilaian.nilai} / ${maxNilai}`;
          } else {
            const minNilai = Math.min(...nilaiValues);
            nilaiNormalisasi = minNilai / penilaian.nilai;
            rumus = `${minNilai} / ${penilaian.nilai}`;
          }

          detail.penilaian_detail.push({
            kriteria_id: kriteria.id,
            nama_kriteria: kriteria.nama_kriteria,
            bobot: kriteria.bobot_norm,
            tipe: kriteria.tipe,
            nilai_asli: penilaian.nilai,
            nilai_normalisasi: parseFloat(nilaiNormalisasi.toFixed(6)),
            rumus_normalisasi: rumus,
            kontribusi_wsm: parseFloat((kriteria.bobot_norm * nilaiNormalisasi).toFixed(6)),
            kontribusi_wpm: parseFloat((kriteria.bobot_norm * Math.log(nilaiNormalisasi)).toFixed(6))
          });
        }
      }

      return detail;
    } catch (error) {
      console.error('Error dalam getDetailPerhitungan:', error);
      throw error;
    }
  }
}

export default new WaspasService();
