#!/usr/bin/env node
/**
 * Railway Post-Deploy Script
 * Jalankan auto-setup user pertama setelah deployment
 * 
 * Usage: node railway-setup.js
 */
import { initDatabase, getDatabase } from './src/database/db.js';
import * as UserRepository from './src/repository/UserRepository.js';
import * as AuthService from './src/service/AuthService.js';
import bcrypt from 'bcryptjs';

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
    console.log('📦 Initializing database...');

    // Initialize database
    await initDatabase();
    const db = getDatabase();

    // Check if admin already exists
    const adminExists = await UserRepository.getByUsername('admin');
    
    if (adminExists) {
      console.log('✅ Admin user already exists, skipping setup');
      return;
    }

    console.log('👤 Creating default users...');

    // Create admin user
    try {
      const hashedAdminPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      await db.run(
        `INSERT INTO users (username, password, email, nama_lengkap, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          DEFAULT_ADMIN.username,
          hashedAdminPassword,
          DEFAULT_ADMIN.email,
          DEFAULT_ADMIN.nama_lengkap,
          DEFAULT_ADMIN.role,
          1
        ]
      );
      console.log('✅ Admin user created');
    } catch (err) {
      console.error('⚠️  Failed to create admin:', err.message);
    }

    // Create regular user
    try {
      const hashedUserPassword = await bcrypt.hash(DEFAULT_USER.password, 10);
      await db.run(
        `INSERT INTO users (username, password, email, nama_lengkap, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          DEFAULT_USER.username,
          hashedUserPassword,
          DEFAULT_USER.email,
          DEFAULT_USER.nama_lengkap,
          DEFAULT_USER.role,
          1
        ]
      );
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
