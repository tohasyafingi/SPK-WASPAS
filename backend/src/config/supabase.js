/**
 * Supabase Configuration
 * Initialize Supabase client for PostgreSQL database
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase configuration: SUPABASE_URL and SUPABASE_ANON_KEY are required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
