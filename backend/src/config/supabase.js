/**
 * Supabase Configuration
 * Initialize Supabase client for PostgreSQL database
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables early to avoid import order issues
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase configuration: SUPABASE_URL and SUPABASE_ANON_KEY are required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
