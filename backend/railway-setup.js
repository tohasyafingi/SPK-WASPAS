#!/usr/bin/env node
/**
 * Railway Post-Deploy Script
 * Jalankan auto-setup user pertama setelah deployment dengan Supabase
 * 
 * Usage: node railway-setup.js
 */
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123',
  email: 'admin@spk.local',
  nama_lengkap: 'Administrator',
  role: 'admin'
};

const DEFAULT_USER = {
  username: 'user',
  password: 'user123',
  email: 'user@spk.local',
  nama_lengkap: 'Regular User',
  role: 'user'
};

async function setupUsers() {
  try {
    console.log('🚀 Railway Post-Deploy Setup Started');
    console.log('📦 Initializing Supabase connection...');

    // Check if admin already exists
    const { data: adminExists } = await supabase
      .from('users')
      .select('id')
      .eq('username', 'admin')
      .single();
    
    if (adminExists) {
      console.log('✅ Admin user already exists, skipping setup');
      return;
    }

    console.log('👤 Creating default users...');

    // Create admin user
    try {
      const hashedAdminPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      const { error: adminError } = await supabase
        .from('users')
        .insert([{
          username: DEFAULT_ADMIN.username,
          password: hashedAdminPassword,
          email: DEFAULT_ADMIN.email,
          nama_lengkap: DEFAULT_ADMIN.nama_lengkap,
          role: DEFAULT_ADMIN.role,
          is_active: true
        }]);
      
      if (adminError) throw adminError;
      console.log('✅ Admin user created');
    } catch (err) {
      console.error('⚠️  Failed to create admin:', err.message);
    }

    // Create regular user
    try {
      const hashedUserPassword = await bcrypt.hash(DEFAULT_USER.password, 10);
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          username: DEFAULT_USER.username,
          password: hashedUserPassword,
          email: DEFAULT_USER.email,
          nama_lengkap: DEFAULT_USER.nama_lengkap,
          role: DEFAULT_USER.role,
          is_active: true
        }]);
      
      if (userError) throw userError;
      console.log('✅ Regular user created');
    } catch (err) {
      console.error('⚠️  Failed to create user:', err.message);
    }

    console.log('\n✅ Setup Complete!');
    console.log('\n📝 Demo Credentials:');
    console.log(`  Admin  → ${DEFAULT_ADMIN.username} / ${DEFAULT_ADMIN.password}`);
    console.log(`  User   → ${DEFAULT_USER.username} / ${DEFAULT_USER.password}`);
    console.log('\n⚠️  CHANGE PASSWORDS IN PRODUCTION!\n');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupUsers().then(() => {
  process.exit(0);
});
