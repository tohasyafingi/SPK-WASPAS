/**
 * Penilaian Repository (Supabase)
 * Handle semua operasi database untuk tabel Penilaian
 */
import supabase from '../config/supabase.js';

class PenilaianRepository {
  /**
   * Get semua penilaian
   */
  async getAll() {
    const { data, error } = await supabase
      .from('penilaian')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(`Failed to get penilaian: ${error.message}`);
    return data || [];
  }

  /**
   * Get penilaian by ID
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('penilaian')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Get penilaian by kandidat
   */
  async getByKandidat(kandidat_id) {
    const { data, error } = await supabase
      .from('penilaian')
      .select('*')
      .eq('kandidat_id', kandidat_id);

    if (error) throw new Error(`Failed to get penilaian: ${error.message}`);
    return data || [];
  }

  /**
   * Get penilaian by kandidat ID (alias for getByKandidat)
   */
  async getByKandidatId(kandidat_id) {
    return this.getByKandidat(kandidat_id);
  }

  /**
   * Get penilaian by kandidat and kriteria
   */
  async getByKandidatAndKriteria(kandidat_id, kriteria_id) {
    const { data, error } = await supabase
      .from('penilaian')
      .select('*')
      .eq('kandidat_id', kandidat_id)
      .eq('kriteria_id', kriteria_id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Get penilaian by kriteria ID
   */
  async getByKriteriaId(kriteria_id) {
    const { data, error } = await supabase
      .from('penilaian')
      .select('*')
      .eq('kriteria_id', kriteria_id);

    if (error) throw new Error(`Failed to get penilaian: ${error.message}`);
    return data || [];
  }

  /**
   * Create penilaian baru
   */
  async create(penilaianData) {
    const { kandidat_id, kriteria_id, nilai } = penilaianData;

    const { data, error } = await supabase
      .from('penilaian')
      .insert([
        {
          kandidat_id,
          kriteria_id,
          nilai: parseFloat(nilai)
        }
      ])
      .select();

    if (error) throw new Error(`Failed to create penilaian: ${error.message}`);
    return data[0].id;
  }

  /**
   * Update penilaian
   */
  async update(id, penilaianData) {
    const { nilai } = penilaianData;

    const { data, error } = await supabase
      .from('penilaian')
      .update({
        nilai: parseFloat(nilai),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw new Error(`Failed to update penilaian: ${error.message}`);
    return data[0];
  }

  /**
   * Delete penilaian
   */
  async delete(id) {
    const { error } = await supabase
      .from('penilaian')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete penilaian: ${error.message}`);
    return true;
  }

  /**
   * Delete penilaian by kandidat
   */
  async deleteByKandidat(kandidat_id) {
    const { error } = await supabase
      .from('penilaian')
      .delete()
      .eq('kandidat_id', kandidat_id);

    if (error) throw new Error(`Failed to delete penilaian: ${error.message}`);
    return true;
  }
}

export default new PenilaianRepository();
