import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path ke database
const dbPath = path.join(__dirname, 'src', 'database', 'spk_waspas.db');
const db = new sqlite3.Database(dbPath);

/**
 * Seed Data - Input Kriteria, Kandidat, dan Penilaian
 * Berdasarkan Tabel I dan Tabel II
 */

async function seedData() {
  console.log('\n🌱 Starting data seeding...\n');

  try {
    // 1. Hapus data lama
    console.log('🗑️  Menghapus data lama...');
    await runQuery('DELETE FROM penilaian');
    await runQuery('DELETE FROM kriteria');
    await runQuery('DELETE FROM kandidat');
    console.log('✅ Data lama berhasil dihapus\n');

    // 2. Insert Kriteria
    console.log('📊 Menginput data Kriteria...');
    const kriterias = [
      { nama: 'Kepemimpinan', bobot: 0.20, tipe: 'benefit', skala: '1-10' },
      { nama: 'Keilmuan', bobot: 0.20, tipe: 'benefit', skala: '1-10' },
      { nama: 'Kedisiplinan', bobot: 0.25, tipe: 'benefit', skala: 'persen' },
      { nama: 'Pelanggaran', bobot: 0.10, tipe: 'cost', skala: 'jumlah' },
      { nama: 'Masa Tinggal', bobot: 0.15, tipe: 'benefit', skala: 'jumlah' },
      { nama: 'Usia', bobot: 0.10, tipe: 'cost', skala: 'jumlah' }
    ];

    const kriteriaIds = [];
    for (const k of kriterias) {
      const id = await runInsert(
        'INSERT INTO kriteria (nama_kriteria, bobot, tipe, skala) VALUES (?, ?, ?, ?)',
        [k.nama, k.bobot, k.tipe, k.skala]
      );
      kriteriaIds.push(id);
      console.log(`   ✓ ${k.nama} (${k.tipe}, bobot: ${k.bobot}, skala: ${k.skala})`);
    }
    console.log('✅ Kriteria berhasil diinput\n');

    // 3. Insert Kandidat
    console.log('👥 Menginput data Kandidat...');
    const kandidats = [
      { nama: 'Syifa', asal_kamar: 'Kamar A', usia: 25, masa_tinggal: 6 },
      { nama: 'Vitrotun', asal_kamar: 'Kamar B', usia: 24, masa_tinggal: 5 },
      { nama: 'Talita', asal_kamar: 'Kamar C', usia: 21, masa_tinggal: 4 },
      { nama: 'Idza', asal_kamar: 'Kamar D', usia: 22, masa_tinggal: 4 },
      { nama: 'Birlina', asal_kamar: 'Kamar E', usia: 21, masa_tinggal: 3 },
      { nama: 'Salis', asal_kamar: 'Kamar F', usia: 22, masa_tinggal: 4 }
    ];

    const kandidatIds = [];
    for (const k of kandidats) {
      const id = await runInsert(
        'INSERT INTO kandidat (nama, asal_kamar, usia, masa_tinggal) VALUES (?, ?, ?, ?)',
        [k.nama, k.asal_kamar, k.usia, k.masa_tinggal]
      );
      kandidatIds.push(id);
      console.log(`   ✓ ${k.nama} (${k.asal_kamar}, usia: ${k.usia}, masa tinggal: ${k.masa_tinggal} tahun)`);
    }
    console.log('✅ Kandidat berhasil diinput\n');

    // 4. Insert Penilaian
    console.log('📝 Menginput data Penilaian...');
    
    // Mapping: [Kepemimpinan, Keilmuan, Kedisiplinan, Pelanggaran, Masa Tinggal, Usia]
    const penilaians = [
      // Syifa
      [8, 8, 90, 1, 6, 25],
      // Vitrotun
      [7, 8, 88, 1, 5, 24],
      // Talita
      [9, 10, 85, 1, 4, 21],
      // Idza
      [8, 9, 87, 1, 4, 22],
      // Birlina
      [7, 8, 85, 1, 3, 21],
      // Salis
      [10, 7, 80, 2, 4, 22]
    ];

    for (let i = 0; i < kandidatIds.length; i++) {
      const kandidatId = kandidatIds[i];
      const kandidatNama = kandidats[i].nama;
      console.log(`   Penilaian untuk ${kandidatNama}:`);
      
      for (let j = 0; j < kriteriaIds.length; j++) {
        const kriteriaId = kriteriaIds[j];
        const nilai = penilaians[i][j];
        
        await runInsert(
          'INSERT INTO penilaian (kandidat_id, kriteria_id, nilai) VALUES (?, ?, ?)',
          [kandidatId, kriteriaId, nilai]
        );
        console.log(`      ✓ ${kriterias[j].nama}: ${nilai}`);
      }
    }
    console.log('✅ Penilaian berhasil diinput\n');

    // 5. Verifikasi data
    console.log('🔍 Verifikasi data...');
    const countKriteria = await runQuery('SELECT COUNT(*) as count FROM kriteria');
    const countKandidat = await runQuery('SELECT COUNT(*) as count FROM kandidat');
    const countPenilaian = await runQuery('SELECT COUNT(*) as count FROM penilaian');
    
    console.log(`   📊 Total Kriteria: ${countKriteria[0].count}`);
    console.log(`   👥 Total Kandidat: ${countKandidat[0].count}`);
    console.log(`   📝 Total Penilaian: ${countPenilaian[0].count}`);
    
    console.log('\n✅ Data seeding completed successfully!\n');
    console.log('📋 Ringkasan Data:');
    console.log('   ┌─────────────────────────────────────────┐');
    console.log('   │ Data berhasil diinput ke database      │');
    console.log('   │ - 6 Kriteria                            │');
    console.log('   │ - 6 Kandidat                            │');
    console.log('   │ - 36 Penilaian (6 kandidat × 6 kriteria)│');
    console.log('   └─────────────────────────────────────────┘\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
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

// Helper functions
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function runInsert(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

// Run seeding
seedData();
