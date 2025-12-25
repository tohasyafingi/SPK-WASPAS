// Debug login issue
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./src/database/spk_waspas.db');

console.log('\n🔍 Debugging login issue...\n');

// 1. Check if users exist
db.all('SELECT id, username, role, is_active, LENGTH(password) as pass_length FROM users', [], (err, rows) => {
  if (err) {
    console.error('❌ Error querying users:', err.message);
    db.close();
    return;
  }

  console.log('📋 Users in database:');
  console.table(rows);

  // 2. Get admin user and test password
  db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err2, user) => {
    if (err2) {
      console.error('❌ Error getting admin:', err2.message);
      db.close();
      return;
    }

    if (!user) {
      console.log('❌ Admin user not found!');
      db.close();
      return;
    }

    console.log('\n🔐 Testing password comparison for admin:');
    console.log('Stored hash:', user.password);
    console.log('Testing password: admin123');

    try {
      const match = await bcrypt.compare('admin123', user.password);
      console.log('Password match result:', match);

      if (!match) {
        console.log('\n❌ Password does NOT match!');
        console.log('This is the problem - hash in database is not correct.');
      } else {
        console.log('\n✅ Password MATCHES!');
        console.log('Login should work. Check AuthService or API endpoint.');
      }
    } catch (error) {
      console.error('❌ Error comparing password:', error.message);
    }

    db.close();
  });
});
