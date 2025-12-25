import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./src/database/spk_waspas.db');

console.log('\n=== FINAL DATABASE CHECK ===\n');

db.get("SELECT * FROM users WHERE username = 'admin'", [], async (err, user) => {
  if (err) {
    console.error('Error:', err.message);
    db.close();
    return;
  }

  if (!user) {
    console.log('❌ Admin user NOT FOUND in database!');
    db.close();
    return;
  }

  console.log('✅ Admin user found:');
  console.log('   ID:', user.id);
  console.log('   Username:', user.username);
  console.log('   Role:', user.role);
  console.log('   Active:', user.is_active);
  console.log('   Password hash:', user.password);
  console.log('');

  // Test password
  console.log('Testing password "admin123"...');
  try {
    const match = await bcrypt.compare('admin123', user.password);
    console.log('Password match:', match ? '✅ YES' : '❌ NO');
    
    if (match) {
      console.log('\n🎉 DATABASE IS CORRECT!');
      console.log('Login should work from frontend at http://localhost:3000');
      console.log('\nCredentials:');
      console.log('  Username: admin');
      console.log('  Password: admin123');
    } else {
      console.log('\n❌ PASSWORD HASH IS WRONG!');
      console.log('Run: node reset-passwords.js');
    }
  } catch (e) {
    console.error('Error comparing:', e.message);
  }

  db.close();
});
