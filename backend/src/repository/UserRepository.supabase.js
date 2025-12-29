/**
 * User Repository (Supabase)
 * Menangani semua operasi database untuk users
 */
import supabase from '../config/supabase.js';

/**
 * Get all users
 */
export async function getAll() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, nama_lengkap, role, is_active, last_login, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
}

/**
 * Get user by ID
 */
export async function getById(id) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, nama_lengkap, role, is_active, last_login, created_at')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

/**
 * Get user by username
 */
export async function getByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  } catch (error) {
    throw new Error(`Failed to get user by username: ${error.message}`);
  }
}

/**
 * Create new user
 */
export async function create(userData) {
  try {
    const { username, password, email, nama_lengkap, role } = userData;

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          username,
          password,
          email: email || null,
          nama_lengkap: nama_lengkap || null,
          role: role || 'user',
          is_active: true
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

/**
 * Update user
 */
export async function update(id, userData) {
  try {
    const { password, email, nama_lengkap, role, is_active } = userData;

    const updateData = {};
    if (password) updateData.password = password;
    if (email !== undefined) updateData.email = email;
    if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
    if (role !== undefined) updateData.role = role;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

/**
 * Delete user
 */
export async function deleteUser(id) {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

/**
 * Update last login
 */
export async function updateLastLogin(id) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    throw new Error(`Failed to update last login: ${error.message}`);
  }
}

/**
 * Get user count
 */
export async function count() {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;
    return count || 0;
  } catch (error) {
    throw new Error(`Failed to count users: ${error.message}`);
  }
}
