/**
 * Seed Supabase with initial data: users, kriteria, kandidat, penilaian
 */
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import supabase from '../config/supabase.js';

dotenv.config();

async function ensureTableExists(table) {
  const { error } = await supabase.from(table).select('id').limit(1);
  if (error) {
    throw new Error(`Table ${table} not found. Run migrations first (npm run migrate:supabase).`);
  }
}

async function seedUsers() {
  console.log('Seeding users...');
  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  const { data, error } = await supabase
    .from('users')
    .upsert([
      { username: 'admin', password: adminPass, email: 'admin@spk.local', nama_lengkap: 'Administrator', role: 'admin', is_active: true },
      { username: 'user', password: userPass, email: 'user@spk.local', nama_lengkap: 'Pengguna', role: 'user', is_active: true }
    ], { onConflict: 'username' })
    .select();

  if (error) throw error;
  console.log('✓ Users seeded');
  return data;
}

async function seedKriteria() {
  console.log('Seeding kriteria...');
  const rows = [
    { nama_kriteria: 'Pengalaman', bobot: 0.3, tipe: 'benefit', skala: '1-10' },
    { nama_kriteria: 'Usia', bobot: 0.2, tipe: 'benefit', skala: '1-10' },
    { nama_kriteria: 'Masa Tinggal', bobot: 0.25, tipe: 'benefit', skala: '1-10' },
    { nama_kriteria: 'Kedisiplinan', bobot: 0.25, tipe: 'benefit', skala: '1-10' }
  ];

  const { data, error } = await supabase
    .from('kriteria')
    .upsert(rows, { onConflict: 'nama_kriteria' })
    .select();

  if (error) throw error;
  console.log('✓ Kriteria seeded');
  return data;
}

async function seedKandidat() {
  console.log('Seeding kandidat...');
  const rows = [
    { nama: 'Ahmad', asal_kamar: 'Kamar A', usia: 25, masa_tinggal: 5, keterangan: null },
    { nama: 'Budi', asal_kamar: 'Kamar B', usia: 27, masa_tinggal: 6, keterangan: null },
    { nama: 'Candra', asal_kamar: 'Kamar C', usia: 24, masa_tinggal: 4, keterangan: null }
  ];

  const { data, error } = await supabase
    .from('kandidat')
    .insert(rows)
    .select();

  if (error && !error.message.includes('duplicate')) throw error;
  console.log('✓ Kandidat seeded (or already present)');

  // Fetch all to get IDs
  const { data: all, error: fetchErr } = await supabase
    .from('kandidat')
    .select('*')
    .order('id');
  if (fetchErr) throw fetchErr;
  return all;
}

async function seedPenilaian(kandidats, kriterias) {
  console.log('Seeding penilaian...');
  const pairs = [];
  for (const k of kandidats) {
    for (const kr of kriterias) {
      pairs.push({ kandidat_id: k.id, kriteria_id: kr.id, nilai: Math.floor(6 + Math.random() * 4) });
    }
  }

  // Upsert-like behavior: try insert, ignore duplicates
  for (const p of pairs) {
    await supabase
      .from('penilaian')
      .insert({ kandidat_id: p.kandidat_id, kriteria_id: p.kriteria_id, nilai: p.nilai })
      .then(({ error }) => {
        if (error && !String(error.message).includes('duplicate key')) throw error;
      });
  }
  console.log('✓ Penilaian seeded');
}

async function main() {
  try {
    await ensureTableExists('users');
    await ensureTableExists('kriteria');
    await ensureTableExists('kandidat');
    await ensureTableExists('penilaian');

    const users = await seedUsers();
    const kriterias = await seedKriteria();
    const kandidats = await seedKandidat();
    await seedPenilaian(kandidats, kriterias);

    console.log('\n✓ Supabase seed completed');
    process.exit(0);
  } catch (err) {
    console.error('✗ Seed failed:', err.message);
    console.error('Hint: Run migrations first with npm run migrate:supabase');
    process.exit(1);
  }
}

main();
