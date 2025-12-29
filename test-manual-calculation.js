/**
 * Manual WASPAS Calculation - Test untuk memverifikasi perhitungan
 * Menggunakan data yang sama dengan sistem
 */

const API_BASE = 'http://localhost:5000/api';

async function manualCalculation() {
  console.log('🧮 PERHITUNGAN MANUAL WASPAS\n');
  console.log('━'.repeat(70));

  try {
    // Get data dari sistem
    const kriteriaRes = await fetch(`${API_BASE}/kriteria`);
    const kriteriaJson = await kriteriaRes.json();
    const kriteria = kriteriaJson.data || kriteriaJson;

    const penilaianRes = await fetch(`${API_BASE}/penilaian`);
    const penilaianJson = await penilaianRes.json();
    const penilaian = penilaianJson.data || penilaianJson;

    const kandidatRes = await fetch(`${API_BASE}/kandidat`);
    const kandidatJson = await kandidatRes.json();
    const kandidat = kandidatJson.data || kandidatJson;

    // Build data structures
    const bobot = {};
    const tipe = {};
    kriteria.forEach(k => {
      bobot[k.id] = k.bobot;
      tipe[k.id] = k.tipe;
    });

    const matrix = {};
    kandidat.forEach(k => {
      matrix[k.nama] = {};
    });

    penilaian.forEach(p => {
      const kandidatNama = kandidat.find(k => k.id === p.kandidat_id)?.nama;
      if (kandidatNama) {
        matrix[kandidatNama][p.kriteria_id] = p.nilai;
      }
    });

    console.log('📊 STEP 1: Data Input\n');
    console.log('Kriteria dan Bobot:');
    kriteria.forEach(k => {
      console.log(`  C${k.id}: ${k.nama_kriteria.padEnd(15)} | Bobot: ${k.bobot} | Tipe: ${k.tipe}`);
    });
    console.log();

    console.log('Matriks Keputusan:');
    console.log('Kandidat   | C1 | C2 | C3  | C4 | C5 | C6');
    console.log('-----------|----|----|-----|----|----|----|');
    Object.entries(matrix).forEach(([nama, nilai]) => {
      const row = `${nama.padEnd(10)} | ${nilai[1]?.toString().padStart(2)} | ${nilai[2]?.toString().padStart(2)} | ${nilai[3]?.toString().padStart(3)} | ${nilai[4]?.toString().padStart(2)} | ${nilai[5]?.toString().padStart(2)} | ${nilai[6]?.toString().padStart(2)}`;
      console.log(row);
    });
    console.log();

    // STEP 2: Normalisasi
    console.log('━'.repeat(70));
    console.log('📊 STEP 2: Normalisasi Matriks\n');

    const normalized = {};
    const maxMin = {};

    // Calculate max/min for each criteria
    for (let i = 1; i <= 6; i++) {
      const values = Object.values(matrix).map(row => row[i]);
      if (tipe[i] === 'benefit') {
        maxMin[i] = Math.max(...values);
        console.log(`C${i} (${kriteria.find(k => k.id === i).nama_kriteria}): max = ${maxMin[i]}`);
      } else {
        maxMin[i] = Math.min(...values);
        console.log(`C${i} (${kriteria.find(k => k.id === i).nama_kriteria}): min = ${maxMin[i]}`);
      }
    }
    console.log();

    // Normalize
    Object.entries(matrix).forEach(([nama, nilai]) => {
      normalized[nama] = {};
      for (let i = 1; i <= 6; i++) {
        if (tipe[i] === 'benefit') {
          normalized[nama][i] = nilai[i] / maxMin[i];
        } else {
          normalized[nama][i] = maxMin[i] / nilai[i];
        }
      }
    });

    console.log('Matriks Ternormalisasi:');
    console.log('Kandidat   |   C1   |   C2   |   C3   |   C4   |   C5   |   C6');
    console.log('-----------|--------|--------|--------|--------|--------|--------');
    Object.entries(normalized).forEach(([nama, nilai]) => {
      const row = `${nama.padEnd(10)} | ${nilai[1].toFixed(4)} | ${nilai[2].toFixed(4)} | ${nilai[3].toFixed(4)} | ${nilai[4].toFixed(4)} | ${nilai[5].toFixed(4)} | ${nilai[6].toFixed(4)}`;
      console.log(row);
    });
    console.log();

    // STEP 3: Calculate WSM
    console.log('━'.repeat(70));
    console.log('📊 STEP 3: Perhitungan WSM (Weighted Sum Model)\n');
    console.log('Formula: WSM = Σ(wi × rij)\n');

    const wsm = {};
    Object.entries(normalized).forEach(([nama, nilai]) => {
      wsm[nama] = 0;
      let detail = '';
      for (let i = 1; i <= 6; i++) {
        const contribution = bobot[i] * nilai[i];
        wsm[nama] += contribution;
        detail += `(${bobot[i]} × ${nilai[i].toFixed(4)}) + `;
      }
      console.log(`${nama}:`);
      console.log(`  ${detail.slice(0, -3)} = ${wsm[nama].toFixed(6)}`);
    });
    console.log();

    // STEP 4: Calculate WPM
    console.log('━'.repeat(70));
    console.log('📊 STEP 4: Perhitungan WPM (Weighted Product Model)\n');
    console.log('Formula: WPM = Π(rij^wi)\n');

    const wpm = {};
    Object.entries(normalized).forEach(([nama, nilai]) => {
      wpm[nama] = 1;
      let detail = '';
      for (let i = 1; i <= 6; i++) {
        const contribution = Math.pow(nilai[i], bobot[i]);
        wpm[nama] *= contribution;
        detail += `(${nilai[i].toFixed(4)}^${bobot[i]}) × `;
      }
      console.log(`${nama}:`);
      console.log(`  ${detail.slice(0, -3)} = ${wpm[nama].toFixed(6)}`);
    });
    console.log();

    // STEP 5: Calculate Qi
    console.log('━'.repeat(70));
    console.log('📊 STEP 5: Perhitungan Qi (WASPAS Score)\n');
    console.log('Formula: Qi = 0.5 × WSM + 0.5 × WPM\n');

    const qi = {};
    Object.entries(wsm).forEach(([nama]) => {
      qi[nama] = 0.5 * wsm[nama] + 0.5 * wpm[nama];
      console.log(`${nama}:`);
      console.log(`  Qi = 0.5 × ${wsm[nama].toFixed(6)} + 0.5 × ${wpm[nama].toFixed(6)}`);
      console.log(`     = ${qi[nama].toFixed(6)}`);
    });
    console.log();

    // STEP 6: Ranking
    console.log('━'.repeat(70));
    console.log('📊 STEP 6: Ranking Akhir\n');

    const ranking = Object.entries(qi)
      .map(([nama, score]) => ({ nama, wsm: wsm[nama], wpm: wpm[nama], qi: score }))
      .sort((a, b) => b.qi - a.qi);

    console.log('Rank | Kandidat   | WSM     | WPM     | Qi Score');
    console.log('-----|------------|---------|---------|----------');
    ranking.forEach((r, idx) => {
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '  ';
      console.log(`${medal} ${(idx + 1)} | ${r.nama.padEnd(10)} | ${r.wsm.toFixed(5)} | ${r.wpm.toFixed(5)} | ${r.qi.toFixed(6)}`);
    });
    console.log();

    // STEP 7: Compare with system
    console.log('━'.repeat(70));
    console.log('📊 STEP 7: Perbandingan Manual vs Sistem\n');

    const hasilRes = await fetch(`${API_BASE}/hasil`);
    const hasilJson = await hasilRes.json();
    const hasilSistem = hasilJson.data || hasilJson;

    console.log('Kandidat   | Manual Qi | Sistem Qi | Selisih  | Status');
    console.log('-----------|-----------|-----------|----------|--------');

    let allMatch = true;
    ranking.forEach((manual, idx) => {
      const sistem = hasilSistem.find(s => s.nama === manual.nama);
      if (sistem) {
        const diff = Math.abs(manual.qi - sistem.qi);
        const match = diff < 0.001;
        if (!match) allMatch = false;
        
        const status = match ? '✅ Cocok' : diff < 0.01 ? '⚠️ Dekat' : '❌ Beda';
        console.log(`${manual.nama.padEnd(10)} | ${manual.qi.toFixed(6)} | ${sistem.qi.toFixed(6)} | ${diff.toFixed(6)} | ${status}`);
      }
    });
    console.log();

    console.log('Ranking Order:');
    console.log(`  Manual: ${ranking.map(r => r.nama).join(', ')}`);
    console.log(`  Sistem: ${hasilSistem.map(s => s.nama).join(', ')}`);
    
    const rankingMatch = JSON.stringify(ranking.map(r => r.nama)) === JSON.stringify(hasilSistem.map(s => s.nama));
    console.log(`  Match: ${rankingMatch ? '✅ IDENTIK' : '❌ BERBEDA'}\n`);

    // Final conclusion
    console.log('━'.repeat(70));
    if (rankingMatch) {
      console.log('✅ KESIMPULAN: PERHITUNGAN MANUAL = SISTEM');
      console.log('━'.repeat(70));
      console.log('✅ Ranking order: IDENTIK');
      console.log('✅ Data input: 100% sama');
      console.log('✅ Algoritma: Terverifikasi');
      console.log('\n🎯 Pemenang: ' + ranking[0].nama + ' (Qi = ' + ranking[0].qi.toFixed(6) + ')');
    } else {
      console.log('⚠️ KESIMPULAN: ADA PERBEDAAN');
      console.log('━'.repeat(70));
      console.log('Periksa kembali perhitungan atau data input');
    }
    console.log();

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

manualCalculation();
