/**
 * Kriteria Repository (Supabase)
 * Handle semua operasi database untuk tabel Kriteria
 */
import supabase from '../config/supabase.js';

class KriteriaRepository {
  /**
   * Get semua kriteria
   */
  async getAll() {
    const { data, error } = await supabase
      .from('kriteria')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(`Failed to get kriteria: ${error.message}`);
    return data || [];
  }

  /**
   * Get kriteria by ID
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('kriteria')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Create kriteria baru
   */
  async create(kriteriaData) {
    const { nama_kriteria, bobot, tipe, skala } = kriteriaData;

    const { data, error } = await supabase
      .from('kriteria')
      .insert([
        {
          nama_kriteria,
          bobot: parseFloat(bobot),
          tipe,
          skala: skala || '1-10'
        }
      ])
      .select();

    if (error) throw new Error(`Failed to create kriteria: ${error.message}`);
    return data[0].id;
  }

  /**
   * Update kriteria
   */
  async update(id, kriteriaData) {
    const { nama_kriteria, bobot, tipe, skala } = kriteriaData;

    const { data, error } = await supabase
      .from('kriteria')
      .update({
        nama_kriteria,
        bobot: parseFloat(bobot),
        tipe,
        skala: skala || '1-10',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw new Error(`Failed to update kriteria: ${error.message}`);
    return data[0];
  }

  /**
   * Delete kriteria
   */
  async delete(id) {
    const { error } = await supabase
      .from('kriteria')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete kriteria: ${error.message}`);
    return true;
  }

  /**
   * Get kriteria count
   */
  async count() {
    const { count, error } = await supabase
      .from('kriteria')
      .select('id', { count: 'exact', head: true });

    if (error) throw new Error(`Failed to count kriteria: ${error.message}`);
    return count || 0;
  }
}

export default new KriteriaRepository();
