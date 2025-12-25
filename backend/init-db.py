import sqlite3
import hashlib
import os

# Path to database
db_path = os.path.join('src', 'database', 'spk_waspas.db')

print(f'\n📂 Database: {db_path}')
print(f'   Exists: {os.path.exists(db_path)}\n')

# Connect
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print(f'📋 Existing tables: {[t[0] for t in tables]}\n')

# Create users table if not exists
print('🔧 Creating users table...')
cursor.execute('''
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
''')

# Insert admin (password: admin123)
# bcrypt hash for 'admin123' with salt rounds=10
admin_hash = '$2a$10$ZQ.F8Xu2QHK8Bh5YlQ6j5OzQCr8YQ3HK1C3vXLqKE3B5VnO9Vz.Vu'

try:
    cursor.execute('''
      INSERT INTO users (username, password, email, nama_lengkap, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    ''', ('admin', admin_hash, 'admin@pesantren.ac.id', 'Administrator', 'admin', 1))
    print('✅ Admin user created')
except sqlite3.IntegrityError:
    print('⚠️  Admin user already exists')

# Insert user (password: user123)
user_hash = '$2a$10$xHVJ5k8L.V2TQ7K9B3nYxOpN5yQ7LR9xVnQ3BK8zQvYK5zR9YQ5Xa'

try:
    cursor.execute('''
      INSERT INTO users (username, password, email, nama_lengkap, role, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    ''', ('user', user_hash, 'user@pesantren.ac.id', 'Regular User', 'user', 1))
    print('✅ Regular user created')
except sqlite3.IntegrityError:
    print('⚠️  User already exists')

conn.commit()

# Verify
cursor.execute("SELECT username, role FROM users")
users = cursor.fetchall()
print(f'\n📋 Users in database: {users}\n')

conn.close()
print('✅ Done!\n')
