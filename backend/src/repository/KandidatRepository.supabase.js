/**
 * Kandidat Repository (Supabase)
 * Handle semua operasi database untuk tabel Kandidat
 */
import supabase from '../config/supabase.js';

class KandidatRepository {
  /**
   * Get semua kandidat
   */
  async getAll() {
    const { data, error } = await supabase
      .from('kandidat')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw new Error(`Failed to get kandidat: ${error.message}`);
    return data || [];
  }

  /**
   * Get kandidat by ID
   */
  async getById(id) {
    const { data, error } = await supabase
      .from('kandidat')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  /**
   * Create kandidat baru
   */
  async create(kandidatData) {
    const { nama, asal_kamar, usia, masa_tinggal, keterangan } = kandidatData;

    const { data, error } = await supabase
      .from('kandidat')
      .insert([
        {
          nama,
          asal_kamar,
          usia,
          masa_tinggal,
          keterangan: keterangan || null
        }
      ])
      .select();

    if (error) throw new Error(`Failed to create kandidat: ${error.message}`);
    return data[0].id;
  }

  /**
   * Update kandidat
   */
  async update(id, kandidatData) {
    const { nama, asal_kamar, usia, masa_tinggal, keterangan } = kandidatData;

    const { data, error } = await supabase
      .from('kandidat')
      .update({
        nama,
        asal_kamar,
        usia,
        masa_tinggal,
        keterangan: keterangan || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw new Error(`Failed to update kandidat: ${error.message}`);
    return data[0];
  }

  /**
   * Delete kandidat
   */
  async delete(id) {
    const { error } = await supabase
      .from('kandidat')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete kandidat: ${error.message}`);
    return true;
  }

  /**
   * Get kandidat count
   */
  async count() {
    const { count, error } = await supabase
      .from('kandidat')
      .select('id', { count: 'exact', head: true });

    if (error) throw new Error(`Failed to count kandidat: ${error.message}`);
    return count || 0;
  }
}

export default new KandidatRepository();
