-- =========================================
-- SQL SCRIPT: FIX DATABASE KRITERIA
-- =========================================
-- Jalankan di Supabase Dashboard SQL Editor
-- URL: https://supabase.com/dashboard/project/qnacxxswfvnbmxgghqrg/editor
-- =========================================

-- Step 1: Delete semua kriteria kecuali Kepemimpinan (ID 1)
DELETE FROM kriteria WHERE id != 1;

-- Step 2: Delete semua penilaian lama
DELETE FROM penilaian;

-- Step 3: Insert kriteria 2-6 dengan ID eksplisit
INSERT INTO kriteria (id, nama_kriteria, bobot, tipe, skala) VALUES
  (2, 'Keilmuan', 0.20, 'benefit', '1-10'),
  (3, 'Kedisiplinan', 0.25, 'benefit', 'persen'),
  (4, 'Pelanggaran', 0.10, 'cost', 'jumlah'),
  (5, 'Masa Tinggal', 0.15, 'benefit', 'jumlah'),
  (6, 'Usia', 0.10, 'cost', 'jumlah')
ON CONFLICT (id) DO UPDATE SET
  nama_kriteria = EXCLUDED.nama_kriteria,
  bobot = EXCLUDED.bobot,
  tipe = EXCLUDED.tipe,
  skala = EXCLUDED.skala;

-- Step 4: Reset sequence agar ID berikutnya dimulai dari 7
SELECT setval('kriteria_id_seq', 6, true);

-- Step 5: Insert penilaian dari gambar
-- Sesuaikan kandidat_id dengan ID asli di database
-- Check kandidat_id dengan: SELECT id, nama FROM kandidat ORDER BY nama;

-- Syifa: 8, 8, 90, 1, 6, 25
INSERT INTO penilaian (kandidat_id, kriteria_id, nilai) VALUES
  ((SELECT id FROM kandidat WHERE nama = 'Syifa'), 1, 8),
  ((SELECT id FROM kandidat WHERE nama = 'Syifa'), 2, 8),
  ((SELECT id FROM kandidat WHERE nama = 'Syifa'), 3, 90),
  ((SELECT id FROM kandidat WHERE nama = 'Syifa'), 4, 1),
  ((SELECT id FROM kandidat WHERE nama = 'Syifa'), 5, 6),
  ((SELECT id FROM kandidat WHERE nama = 'Syifa'), 6, 25);

-- Vitrotun: 7, 8, 88, 1, 5, 24
INSERT INTO penilaian (kandidat_id, kriteria_id, nilai) VALUES
  ((SELECT id FROM kandidat WHERE nama = 'Vitrotun'), 1, 7),
  ((SELECT id FROM kandidat WHERE nama = 'Vitrotun'), 2, 8),
  ((SELECT id FROM kandidat WHERE nama = 'Vitrotun'), 3, 88),
  ((SELECT id FROM kandidat WHERE nama = 'Vitrotun'), 4, 1),
  ((SELECT id FROM kandidat WHERE nama = 'Vitrotun'), 5, 5),
  ((SELECT id FROM kandidat WHERE nama = 'Vitrotun'), 6, 24);

-- Talita: 9, 10, 85, 1, 4, 21
INSERT INTO penilaian (kandidat_id, kriteria_id, nilai) VALUES
  ((SELECT id FROM kandidat WHERE nama = 'Talita'), 1, 9),
  ((SELECT id FROM kandidat WHERE nama = 'Talita'), 2, 10),
  ((SELECT id FROM kandidat WHERE nama = 'Talita'), 3, 85),
  ((SELECT id FROM kandidat WHERE nama = 'Talita'), 4, 1),
  ((SELECT id FROM kandidat WHERE nama = 'Talita'), 5, 4),
  ((SELECT id FROM kandidat WHERE nama = 'Talita'), 6, 21);

-- Idza: 8, 9, 87, 1, 4, 22
INSERT INTO penilaian (kandidat_id, kriteria_id, nilai) VALUES
  ((SELECT id FROM kandidat WHERE nama = 'Idza'), 1, 8),
  ((SELECT id FROM kandidat WHERE nama = 'Idza'), 2, 9),
  ((SELECT id FROM kandidat WHERE nama = 'Idza'), 3, 87),
  ((SELECT id FROM kandidat WHERE nama = 'Idza'), 4, 1),
  ((SELECT id FROM kandidat WHERE nama = 'Idza'), 5, 4),
  ((SELECT id FROM kandidat WHERE nama = 'Idza'), 6, 22);

-- Birlina: 7, 8, 85, 1, 3, 21
INSERT INTO penilaian (kandidat_id, kriteria_id, nilai) VALUES
  ((SELECT id FROM kandidat WHERE nama = 'Birlina'), 1, 7),
  ((SELECT id FROM kandidat WHERE nama = 'Birlina'), 2, 8),
  ((SELECT id FROM kandidat WHERE nama = 'Birlina'), 3, 85),
  ((SELECT id FROM kandidat WHERE nama = 'Birlina'), 4, 1),
  ((SELECT id FROM kandidat WHERE nama = 'Birlina'), 5, 3),
  ((SELECT id FROM kandidat WHERE nama = 'Birlina'), 6, 21);

-- Salis: 10, 7, 80, 2, 4, 22
INSERT INTO penilaian (kandidat_id, kriteria_id, nilai) VALUES
  ((SELECT id FROM kandidat WHERE nama = 'Salis'), 1, 10),
  ((SELECT id FROM kandidat WHERE nama = 'Salis'), 2, 7),
  ((SELECT id FROM kandidat WHERE nama = 'Salis'), 3, 80),
  ((SELECT id FROM kandidat WHERE nama = 'Salis'), 4, 2),
  ((SELECT id FROM kandidat WHERE nama = 'Salis'), 5, 4),
  ((SELECT id FROM kandidat WHERE nama = 'Salis'), 6, 22);

-- Step 6: Verify hasil
SELECT 'KRITERIA' as tabel, COUNT(*) as jumlah FROM kriteria
UNION ALL
SELECT 'PENILAIAN' as tabel, COUNT(*) as jumlah FROM penilaian;

SELECT * FROM kriteria ORDER BY id;
SELECT k.nama as kandidat, kr.nama_kriteria, p.nilai 
FROM penilaian p
JOIN kandidat k ON k.id = p.kandidat_id
JOIN kriteria kr ON kr.id = p.kriteria_id
ORDER BY k.nama, kr.id;
