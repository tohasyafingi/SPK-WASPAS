import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path ke database
const dbPath = path.join(__dirname, 'src', 'database', 'spk_waspas.db');
const db = new sqlite3.Database(dbPath);

/**
 * Seed Script - Create Initial Users
 * 
 * Creates default admin and user accounts for testing
 */

async function seedUsers() {
  console.log('\n🌱 Starting database seeding...\n');

  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Create admin user
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (username, password, email, nama_lengkap, role, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['admin', adminPassword, 'admin@pesantren.ac.id', 'Administrator', 'admin', 1],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              console.log('⚠️  Admin user already exists, skipping...');
              resolve();
            } else {
              reject(err);
            }
          } else {
            console.log('✅ Admin user created successfully');
            console.log('   Username: admin');
            console.log('   Password: admin123');
            console.log('   Role: admin');
            resolve();
          }
        }
      );
    });

    console.log('\n✅ Database seeding completed!\n');
    console.log('📋 Demo Credentials:');
    console.log('   ┌─────────────┬──────────┬────────┐');
    console.log('   │ Username    │ Password │ Role   │');
    console.log('   ├─────────────┼──────────┼────────┤');
    console.log('   │ admin       │ admin123 │ admin  │');
    console.log('   └─────────────┴──────────┴────────┘\n');
    console.log('⚠️  IMPORTANT: Change these passwords in production!\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err.message);
      } else {
        console.log('📦 Database connection closed');
      }
    });
  }
}

// Create users table if not exists, then seed
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
  if (err) {
    console.error('❌ Error checking users table:', err.message);
    db.close();
    process.exit(1);
  }

  if (!row) {
    console.log('⚠️  Users table does not exist. Creating table...\n');
    
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        nama_lengkap TEXT,
        role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
        is_active INTEGER DEFAULT 1,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (createErr) => {
      if (createErr) {
        console.error('❌ Error creating users table:', createErr.message);
        db.close();
        process.exit(1);
      }
      console.log('✅ Users table created successfully!\n');
      seedUsers();
    });
  } else {
    // Table exists, proceed with seeding
    seedUsers();
  }
});
