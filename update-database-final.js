/**
 * Update Database Final - Sesuaikan dengan Data Gambar
 * 1. Fix kriteria structure (ID 1-6)
 * 2. Update penilaian dengan data dari gambar
 */

const API_BASE = 'http://localhost:5000/api';

async function updateDatabase() {
  console.log('🔧 Update database sesuai gambar...\n');

  try {
    // Step 1: Get dan delete kriteria yang salah
    console.log('📋 STEP 1: Cleanup kriteria...');
    const kriteriaRes = await fetch(`${API_BASE}/kriteria`);
    const kriteriaJson = await kriteriaRes.json();
    const kriteriaData = kriteriaJson.data || kriteriaJson;
    
    console.log(`Kriteria saat ini: ${kriteriaData.length}`);
    
    // Delete semua kriteria kecuali ID 1
    for (const k of kriteriaData) {
      if (k.id !== 1) {
        await fetch(`${API_BASE}/kriteria/${k.id}`, { method: 'DELETE' });
        console.log(`  ✓ Deleted: ${k.nama_kriteria} (ID ${k.id})`);
      }
    }
    console.log();

    // Step 2: Delete semua penilaian lama
    console.log('🗑️  STEP 2: Delete penilaian lama...');
    const penilaianRes = await fetch(`${API_BASE}/penilaian`);
    const penilaianJson = await penilaianRes.json();
    const penilaianData = penilaianJson.data || penilaianJson;
    
    for (const p of penilaianData) {
      await fetch(`${API_BASE}/penilaian/${p.id}`, { method: 'DELETE' });
    }
    console.log(`  ✓ Deleted ${penilaianData.length} penilaian\n`);

    // Step 3: Tampilkan instruksi SQL untuk Supabase Dashboard
    console.log('📝 STEP 3: Perbaiki kriteria dengan SQL...\n');
    console.log('⚠️  API tidak bisa specify ID, gunakan Supabase Dashboard SQL Editor:\n');
    console.log('🔗 Buka: https://supabase.com/dashboard/project/qnacxxswfvnbmxgghqrg/editor\n');
    console.log('Copy-paste SQL berikut ke SQL Editor, lalu tekan Run:\n');
    console.log('━'.repeat(70));
    console.log(`
-- 1. Delete kriteria selain Kepemimpinan
DELETE FROM kriteria WHERE id != 1;

-- 2. Insert kriteria 2-6 dengan ID eksplisit
INSERT INTO kriteria (id, nama_kriteria, bobot, tipe, skala) VALUES
  (2, 'Keilmuan', 0.20, 'benefit', '1-10'),
  (3, 'Kedisiplinan', 0.25, 'benefit', 'persen'),
  (4, 'Pelanggaran', 0.10, 'cost', 'jumlah'),
  (5, 'Masa Tinggal', 0.15, 'benefit', 'tahun'),
  (6, 'Usia', 0.10, 'cost', 'tahun')
ON CONFLICT (id) DO UPDATE SET
  nama_kriteria = EXCLUDED.nama_kriteria,
  bobot = EXCLUDED.bobot,
  tipe = EXCLUDED.tipe,
  skala = EXCLUDED.skala;

-- 3. Reset sequence
SELECT setval('kriteria_id_seq', 6, true);

-- 4. Verify
SELECT * FROM kriteria ORDER BY id;
    `);
    console.log('━'.repeat(70));
    console.log('\n✋ Jalankan SQL di atas dulu, lalu tekan ENTER untuk lanjut...');
    
    // Wait for user input
    await new Promise(resolve => {
      process.stdin.once('data', resolve);
    });

    console.log('\n📝 STEP 4: Insert penilaian dari gambar...\n');

    // Data dari gambar (Tabel II)
    const kandidatNilai = {
      'Syifa': [8, 8, 90, 1, 6, 25],
      'Vitrotun': [7, 8, 88, 1, 5, 24],
      'Talita': [9, 10, 85, 1, 4, 21],
      'Idza': [8, 9, 87, 1, 4, 22],
      'Birlina': [7, 8, 85, 1, 3, 21],
      'Salis': [10, 7, 80, 2, 4, 22]
    };

    // Get kandidat dari database
    const kandidatRes = await fetch(`${API_BASE}/kandidat`);
    const kandidatJson = await kandidatRes.json();
    const kandidatList = kandidatJson.data || kandidatJson;

    let successCount = 0;
    let failCount = 0;

    for (const kandidat of kandidatList) {
      const nilai = kandidatNilai[kandidat.nama];
      if (!nilai) {
        console.log(`⚠️  Kandidat ${kandidat.nama} tidak ada di data gambar`);
        continue;
      }

      console.log(`\n📊 ${kandidat.nama}:`);
      
      for (let kriteriaId = 1; kriteriaId <= 6; kriteriaId++) {
        const penilaian = {
          kandidat_id: kandidat.id,
          kriteria_id: kriteriaId,
          nilai: nilai[kriteriaId - 1]
        };

        const createRes = await fetch(`${API_BASE}/penilaian`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(penilaian)
        });

        if (createRes.ok) {
          successCount++;
          console.log(`  ✓ C${kriteriaId}: ${nilai[kriteriaId - 1]}`);
        } else {
          failCount++;
          const error = await createRes.text();
          console.log(`  ✗ C${kriteriaId}: Failed - ${error}`);
        }
      }
    }

    console.log(`\n✅ INSERT SELESAI:`);
    console.log(`   Berhasil: ${successCount}`);
    console.log(`   Gagal: ${failCount}\n`);

    // Step 5: Verify final data
    console.log('📋 STEP 5: Verify data final...\n');

    const finalKriteriaRes = await fetch(`${API_BASE}/kriteria`);
    const finalKriteriaJson = await finalKriteriaRes.json();
    const finalKriteria = finalKriteriaJson.data || finalKriteriaJson;

    console.log('Kriteria Final:');
    finalKriteria.forEach(k => {
      console.log(`  C${k.id}: ${k.nama_kriteria} (${k.bobot})`);
    });

    const finalPenilaianRes = await fetch(`${API_BASE}/penilaian`);
    const finalPenilaianJson = await finalPenilaianRes.json();
    const finalPenilaian = finalPenilaianJson.data || finalPenilaianJson;

    console.log(`\nTotal Penilaian: ${finalPenilaian.length}\n`);

    // Check if structure is correct
    const kriteriaIds = finalKriteria.map(k => k.id).sort((a, b) => a - b);
    const expectedIds = [1, 2, 3, 4, 5, 6];
    const structureOk = JSON.stringify(kriteriaIds) === JSON.stringify(expectedIds);

    if (structureOk && finalPenilaian.length === 36) {
      console.log('✅ DATABASE SUDAH BENAR!\n');
      console.log('🎯 Jalankan validasi:');
      console.log('   node compare-calculation.js\n');
    } else {
      console.log('⚠️  Ada masalah:');
      if (!structureOk) {
        console.log(`   - Kriteria ID tidak sesuai: ${kriteriaIds.join(', ')}`);
        console.log(`     Expected: ${expectedIds.join(', ')}`);
      }
      if (finalPenilaian.length !== 36) {
        console.log(`   - Penilaian count salah: ${finalPenilaian.length} (expected 36)`);
      }
      console.log();
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Pastikan backend sudah running di localhost:5000\n');
  }
}

// Run the update
console.log('Press Ctrl+C to cancel, or wait 2 seconds to start...\n');
setTimeout(() => {
  updateDatabase().then(() => process.exit(0));
}, 2000);
