// Reset User Passwords with Proper Bcrypt Hash
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./src/database/spk_waspas.db');

console.log('\n🔐 Resetting user passwords with proper bcrypt hash...\n');

async function resetPasswords() {
  try {
    // Hash passwords properly
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    console.log('Generated hashes:');
    console.log('Admin hash:', adminPassword);
    console.log('User hash:', userPassword);
    console.log('');

    // Update admin password
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET password = ? WHERE username = ?`,
        [adminPassword, 'admin'],
        function(err) {
          if (err) {
            reject(err);
          } else if (this.changes > 0) {
            console.log('✅ Admin password updated');
            console.log('   Username: admin');
            console.log('   Password: admin123\n');
            resolve();
          } else {
            console.log('⚠️  Admin user not found, creating...');
            // Insert if not exists
            db.run(
              `INSERT INTO users (username, password, email, nama_lengkap, role, is_active)
               VALUES (?, ?, ?, ?, ?, ?)`,
              ['admin', adminPassword, 'admin@pesantren.ac.id', 'Administrator', 'admin', 1],
              function(err2) {
                if (err2) reject(err2);
                else {
                  console.log('✅ Admin user created');
                  resolve();
                }
              }
            );
          }
        }
      );
    });

    // Update user password
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE users SET password = ? WHERE username = ?`,
        [userPassword, 'user'],
        function(err) {
          if (err) {
            reject(err);
          } else if (this.changes > 0) {
            console.log('✅ User password updated');
            console.log('   Username: user');
            console.log('   Password: user123\n');
            resolve();
          } else {
            console.log('⚠️  Regular user not found, creating...');
            // Insert if not exists
            db.run(
              `INSERT INTO users (username, password, email, nama_lengkap, role, is_active)
               VALUES (?, ?, ?, ?, ?, ?)`,
              ['user', userPassword, 'user@pesantren.ac.id', 'Regular User', 'user', 1],
              function(err2) {
                if (err2) reject(err2);
                else {
                  console.log('✅ Regular user created');
                  resolve();
                }
              }
            );
          }
        }
      );
    });

    console.log('✅ Password reset complete!\n');
    console.log('📋 You can now login with:');
    console.log('   Admin: admin / admin123');
    console.log('   User:  user / user123\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    db.close();
  }
}

resetPasswords();
