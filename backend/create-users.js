// Direct User Creation Script
// Run with: node create-users.js

import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./src/database/spk_waspas.db');

console.log('\n🔧 Creating initial users...\n');

async function createUsers() {
  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  // Insert admin
  db.run(
    `INSERT OR IGNORE INTO users (username, password, email, nama_lengkap, role, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['admin', adminPass, 'admin@pesantren.ac.id', 'Administrator', 'admin', 1],
    function(err) {
      if (err) {
        console.log('❌ Error creating admin:', err.message);
      } else if (this.changes > 0) {
        console.log('✅ Admin user created');
        console.log('   Username: admin');
        console.log('   Password: admin123\n');
      } else {
        console.log('⚠️  Admin already exists\n');
      }
    }
  );

  // Insert user
  db.run(
    `INSERT OR IGNORE INTO users (username, password, email, nama_lengkap, role, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['user', userPass, 'user@pesantren.ac.id', 'Regular User', 'user', 1],
    function(err) {
      if (err) {
        console.log('❌ Error creating user:', err.message);
      } else if (this.changes > 0) {
        console.log('✅ Regular user created');
        console.log('   Username: user');
        console.log('   Password: user123\n');
      } else {
        console.log('⚠️  User already exists\n');
      }
      
      // Close database after both inserts
      setTimeout(() => {
        db.close();
        console.log('✅ Done!\n');
      }, 100);
    }
  );
}

createUsers().catch(err => {
  console.error('❌ Error:', err.message);
  db.close();
});
