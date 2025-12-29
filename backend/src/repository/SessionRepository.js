/**
 * Session Repository (Supabase)
 * Handle session management
 */
import supabase from '../config/supabase.js';

const INACTIVITY_LIMIT_MINUTES = 30;

class SessionRepository {
  async countActiveSessionsByUserId(userId) {
    const now = new Date().toISOString();
    const { count, error } = await supabase
      .from('sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('expires_at', now);
    if (error) throw new Error(error.message);
    return count || 0;
  }

  async deactivateOldestSession(userId) {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('expires_at', now)
      .order('created_at', { ascending: true })
      .limit(1);
    if (error) throw new Error(error.message);
    const oldest = (data || [])[0];
    if (!oldest) return false;
    const { error: updErr } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('id', oldest.id);
    if (updErr) throw new Error(updErr.message);
    return true;
  }

  async createSession(userId, token, deviceName, deviceUa, ipAddress, expiresAt) {
    const now = new Date().toISOString();

    // Append timestamp to device name to avoid unique constraint on (user_id, device_name)
    const deviceNameUsed = `${deviceName} #${Date.now()}`;

    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          user_id: userId,
          token,
          device_name: deviceNameUsed,
          device_ua: deviceUa || null,
          ip_address: ipAddress || null,
          last_activity: now,
          expires_at: expiresAt,
          is_active: true
        }
      ])
      .select();
    if (error) throw new Error(error.message);
    return {
      sessionId: data[0]?.id,
      deviceNameUsed
    };
  }

  async getActiveSessionsByUserId(userId) {
    const now = new Date().toISOString();
    const cutoff = new Date(Date.now() - INACTIVITY_LIMIT_MINUTES * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('sessions')
      .select('id, device_name, device_ua, ip_address, last_activity, created_at, expires_at')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gt('expires_at', now)
      .gt('last_activity', cutoff)
      .order('last_activity', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }

  async invalidateSession(token) {
    const { error } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('token', token);
    if (error) throw new Error(error.message);
    return true;
  }

  async invalidateAllSessionsByUserId(userId) {
    const { error } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('user_id', userId);
    if (error) throw new Error(error.message);
    return true;
  }

  async getSessionByToken(token) {
    const now = new Date().toISOString();
    const cutoff = new Date(Date.now() - INACTIVITY_LIMIT_MINUTES * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .gt('expires_at', now)
      .gt('last_activity', cutoff)
      .single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    return data || null;
  }

  async updateSessionLastActivity(token) {
    const { error } = await supabase
      .from('sessions')
      .update({ last_activity: new Date().toISOString() })
      .eq('token', token);
    if (error) throw new Error(error.message);
    return true;
  }

  async cleanupExpiredSessions() {
    const now = new Date().toISOString();
    const cutoff = new Date(Date.now() - INACTIVITY_LIMIT_MINUTES * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('sessions')
      .delete()
      .or(`expires_at.lte.${now},last_activity.lte.${cutoff}`)
      .select('id');
    if (error) throw new Error(error.message);
    return { changes: (data || []).length };
  }
}

export default new SessionRepository();
