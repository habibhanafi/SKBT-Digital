# Template Form Permohonan SKBT — 3 Step

Template frontend untuk form Permohonan Surat Keterangan Bebas Temuan.

## Perubahan
1. Header website dihapus karena form akan di-embed ke CMS.
2. Form dibuat menjadi 3 step:
   - Step 1: Data Pemohon
   - Step 2: Dokumen Persyaratan
   - Step 3: Review Pengajuan
3. Dokumen ahli waris digabung ke Step 2.
4. Bagian Dokumen Ahli Waris hanya muncul jika memilih:
   "Pemberhentian Karena Meninggal Dunia".

## Dokumen Step 2
Dokumen umum:
- Surat Pengantar dari Dinas
- SK Terakhir
- KTP
- Riwayat Jabatan

Jika memilih pemberhentian karena meninggal dunia, otomatis ditambahkan:
- KTP Ahli Waris
- Surat Keterangan Meninggal
- Surat Ahli Waris

## Catatan
Ini masih versi frontend. Data belum dikirim ke Spreadsheet dan file belum diunggah ke Google Drive.

Tahap berikutnya dapat dihubungkan dengan Google Apps Script + Google Spreadsheet + Google Drive.
