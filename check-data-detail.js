/**
 * Check Data Penilaian Detail
 * Untuk memverifikasi data yang tersimpan di database
 */

const API_BASE = 'http://localhost:5000/api';

async function checkData() {
  console.log('🔍 Check Data Detail...\n');

  try {
    // Get penilaian
    const penilaianRes = await fetch(`${API_BASE}/penilaian`);
    const penilaianJson = await penilaianRes.json();
    const penilaian = penilaianJson.data || penilaianJson;

    // Get kandidat
    const kandidatRes = await fetch(`${API_BASE}/kandidat`);
    const kandidatJson = await kandidatRes.json();
    const kandidat = kandidatJson.data || kandidatJson;

    // Get kriteria
    const kriteriaRes = await fetch(`${API_BASE}/kriteria`);
    const kriteriaJson = await kriteriaRes.json();
    const kriteria = kriteriaJson.data || kriteriaJson;

    // Build lookup maps
    const kandidatMap = {};
    kandidat.forEach(k => {
      kandidatMap[k.id] = k.nama;
    });

    const kriteriaMap = {};
    kriteria.forEach(k => {
      kriteriaMap[k.id] = k.nama_kriteria;
    });

    // Group penilaian by kandidat
    const penilaianByKandidat = {};
    penilaian.forEach(p => {
      const nama = kandidatMap[p.kandidat_id];
      if (!penilaianByKandidat[nama]) {
        penilaianByKandidat[nama] = {};
      }
      penilaianByKandidat[nama][p.kriteria_id] = p.nilai;
    });

    // Display data
    console.log('📊 DATA PENILAIAN DI DATABASE:\n');
    console.log('Kandidat   | C1 | C2 | C3  | C4 | C5 | C6');
    console.log('-----------|----|----|-----|----|----|----|');

    const kandidatOrder = ['Syifa', 'Vitrotun', 'Talita', 'Idza', 'Birlina', 'Salis'];
    kandidatOrder.forEach(nama => {
      const nilai = penilaianByKandidat[nama];
      if (!nilai) {
        console.log(`${nama.padEnd(10)} | TIDAK ADA DATA`);
        return;
      }

      const c1 = (nilai[1] || 0).toString().padStart(2);
      const c2 = (nilai[2] || 0).toString().padStart(2);
      const c3 = (nilai[3] || 0).toString().padStart(3);
      const c4 = (nilai[4] || 0).toString().padStart(2);
      const c5 = (nilai[5] || 0).toString().padStart(2);
      const c6 = (nilai[6] || 0).toString().padStart(2);

      console.log(`${nama.padEnd(10)} | ${c1} | ${c2} | ${c3} | ${c4} | ${c5} | ${c6}`);
    });

    console.log('\n📊 DATA DARI GAMBAR (Expected):\n');
    console.log('Kandidat   | C1 | C2 | C3  | C4 | C5 | C6');
    console.log('-----------|----|----|-----|----|----|----|');
    console.log('Syifa      |  8 |  8 |  90 |  1 |  6 | 25');
    console.log('Vitrotun   |  7 |  8 |  88 |  1 |  5 | 24');
    console.log('Talita     |  9 | 10 |  85 |  1 |  4 | 21');
    console.log('Idza       |  8 |  9 |  87 |  1 |  4 | 22');
    console.log('Birlina    |  7 |  8 |  85 |  1 |  3 | 21');
    console.log('Salis      | 10 |  7 |  80 |  2 |  4 | 22');

    console.log('\n📋 KRITERIA:\n');
    kriteria.forEach(k => {
      console.log(`C${k.id}: ${k.nama_kriteria} (${k.tipe}, bobot ${k.bobot})`);
    });
    console.log();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkData();
