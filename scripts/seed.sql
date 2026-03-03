-- Seed: initial articles
-- Run via: turso db shell <db-name> < scripts/seed.sql

BEGIN;

-- Artikel pertama: Membangun Personal Web Minimalis
INSERT INTO articles (slug, title, description, date, featured, hidden, content)
VALUES (
  'membangun-web-ini',
  'Membangun Personal Web Minimalis',
  'Cerita tentang bagaimana saya membangun website ini dari nol menggunakan Astro, dengan fokus pada performa tinggi, desain minimalis, dan kemudahan pengelolaan konten.',
  '2026-03-02',
  1,
  0,
  'Halo! Di post pertama ini, saya ingin berbagi cerita tentang bagaimana saya membangun website ini dari nol. Website ini bukan sekadar portofolio, tapi juga eksperimen dalam menggunakan teknologi modern yang sangat *developer-friendly* tanpa mengorbankan performa.

Fokus utamanya ada tiga: **performa tinggi**, **desain minimalis**, dan **kemudahan pengelolaan konten**.

## Arsitektur & Teknologi

Website ini dibangun dengan stack yang sangat efisien:

### 1. Astro 5.0 (The Engine)
Saya memilih Astro karena filosofinya yang "Zero JS by default". Versi 5.0 membawa fitur **Content Layer** yang sangat membantu dalam mengelola data dari berbagai sumber (Markdown, JSON, API) dengan *type-safe*.
- **Islands Architecture**: Hanya bagian interaktif (seperti tombol copy kode atau toggle tema) yang menggunakan JavaScript.
- **Fast Build**: Proses pembuatan situs statis yang sangat cepat.

### 2. Cloudflare Pages + Turso (The New Stack)
Setelah migrasi, website ini kini berjalan di atas Cloudflare Workers dengan database Turso (SQLite edge). Artikel baru bisa ditambahkan langsung tanpa rebuild.

### 3. Vanilla CSS & Custom Properties
Alih-alih menggunakan framework besar seperti Tailwind atau Bootstrap, saya memilih **CSS Murni**.
- **Design System**: Menggunakan *CSS Variables* untuk mengelola warna, jarak (*spacing*), dan tipografi.
- **Dark Mode**: Implementasi mode gelap yang sangat ringan menggunakan atribut `data-theme`.

---

## Mengapa Memilih Stack ini?

Saya menginginkan website yang tidak hanya cepat bagi pengunjung, tetapi juga nyaman bagi saya sebagai penulis. Dengan stack ini, saya mendapatkan:
- **Performa Sempurna**: Skor Lighthouse yang mencapai 100 di semua kategori.
- **Developer Experience**: Menulis artikel semudah mengisi form di halaman admin.

![Skor Lighthouse 100/100/100/100](/assets/lighthouse-score.png)
*Skor Lighthouse sempurna*

---

## Detail Implementasi yang Menarik

Berikut adalah beberapa detail kecil yang membuat website ini tetap terasa premium meski minimalis:

### "No-Flash" Theme Logic
Salah satu masalah umum pada website dengan mode gelap adalah "flash" warna putih saat halaman baru dimuat. Untuk mengatasinya, saya menyisipkan skrip *inline* kecil di bagian `<head>`:

```javascript
// Menghindari flash tema saat reload
try {
  const svdTheme = localStorage.getItem(''theme'');
  if (svdTheme) document.documentElement.setAttribute(''data-theme'', svdTheme);
  else if (window.matchMedia(''(prefers-color-scheme: dark)'').matches)
    document.documentElement.setAttribute(''data-theme'', ''dark'');
} catch (_) {}
```

### Modular Components
Kode website ini dipecah menjadi komponen modular:
- `BaseHead.astro`: Untuk meta-data SEO dan Open Graph.
- `Sidebar.astro`: Navigasi vertikal yang responsif.
- `utils/date.ts`: Modul khusus untuk menangani format tanggal secara konsisten.

---

## Apa Selanjutnya?

Ini barulah permulaan. Nantinya saya akan menambahkan fitur-fitur menarik lainnya.

Bagi teman-teman yang ingin melihat kode sumbernya, silakan cek di [repositori GitHub saya](https://github.com/kchos0/kchos0-dot-dev). Terima kasih sudah mampir!'
)
ON CONFLICT(slug) DO UPDATE SET
  title       = excluded.title,
  description = excluded.description,
  date        = excluded.date,
  featured    = excluded.featured,
  hidden      = excluded.hidden,
  content     = excluded.content;

-- Artikel panduan penulisan (hidden — referensi internal)
INSERT INTO articles (slug, title, description, date, featured, hidden, content)
VALUES (
  'panduan-penulisan-artikel-super-lengkap',
  'Panduan Penulisan Artikel: Format Lengkap dan Template Praktis',
  'Panduan menulis artikel yang sangat lengkap, dari struktur hingga semua format Markdown yang bisa dipakai.',
  '2026-03-03',
  0,
  1,
  'Panduan ini dibuat sebagai acuan tetap setiap kali kamu menulis artikel baru. Tujuan utamanya adalah menjaga kualitas tulisan tetap rapi, enak dibaca, mudah dipindai, dan konsisten dari artikel ke artikel.

---

## Tujuan Panduan

Gunakan panduan ini untuk memastikan setiap artikel:

- punya struktur yang jelas dari pembuka sampai penutup,
- memakai format Markdown yang konsisten,
- mudah dipahami pembaca dengan tingkat teknis yang berbeda,
- siap dipublikasi tanpa perbaikan besar di akhir.

---

## Struktur Artikel yang Direkomendasikan

Urutan ini cocok untuk hampir semua topik:

1. Hook pembuka: masalah yang ingin diselesaikan.
2. Konteks: siapa target pembacanya dan kapan solusi ini dipakai.
3. Inti materi: langkah, konsep, dan contoh nyata.
4. Ringkasan: poin penting yang harus diingat.
5. Langkah lanjut: apa yang bisa dicoba setelah membaca.

Contoh outline cepat:

```markdown
## Masalah yang Sering Muncul
## Kenapa Ini Terjadi
## Solusi Langkah demi Langkah
## Contoh Implementasi
## Kesalahan Umum
## Penutup
```

---

## Format Markdown yang Bisa Dipakai

Berikut format yang direkomendasikan untuk artikel di website ini.

### 1) Heading

Gunakan heading untuk membagi topik agar pembaca bisa scan cepat.

```markdown
## Judul Bagian
### Judul Subbagian
```

Catatan:

- Hindari heading terlalu dalam jika tidak perlu.
- Gunakan urutan yang rapi, jangan lompat-lompat.

### 2) Paragraf dan Penekanan Teks

Gunakan format ini untuk memberi fokus pada kata penting.

```markdown
Ini paragraf biasa.

Ini **teks tebal** untuk penekanan utama.
Ini *teks miring* untuk penekanan ringan.
Ini ~~teks coret~~ untuk revisi atau konteks lama.
Ini `inline code` untuk nama file, command, atau identifier.
```

### 3) Daftar Bullet dan Numbered List

Pakai bullet list untuk poin sejajar, numbered list untuk urutan langkah.

```markdown
- Poin pertama
- Poin kedua
- Poin ketiga

1. Langkah pertama
2. Langkah kedua
3. Langkah ketiga
```

### 4) Checklist

Checklist cocok untuk workflow atau quality gate sebelum publish.

```markdown
- [ ] Judul sudah jelas
- [ ] Pembuka menjelaskan masalah
- [ ] Contoh kode sudah diuji
- [ ] Penutup berisi next step
```

### 5) Blockquote

Pakai blockquote untuk insight, catatan, atau kutipan penting.

```markdown
> Prinsip utama: jangan membuat pembaca menebak konteks.
> Jelaskan asumsi sebelum masuk ke solusi.
```

### 6) Link

Gunakan link deskriptif, hindari teks link yang terlalu generik.

```markdown
[Dokumentasi Astro](https://docs.astro.build)
[Repositori proyek contoh](https://github.com)
```

### 7) Gambar dan Caption

Jika pakai gambar, sertakan alt text dan caption agar konteks jelas.

```markdown
![Diagram alur publikasi](/assets/diagram-publikasi.png)
*Diagram alur dari draft sampai publish.*
```

### 8) Code Block

Code block wajib untuk contoh teknis. Sertakan bahasa agar lebih mudah dibaca.

````markdown
```bash
npm run dev
```

```ts
export function sum(a: number, b: number) {
  return a + b;
}
```
````

Tips code block:

- Fokus pada potongan kode yang relevan.
- Tambahkan penjelasan sebelum atau sesudah kode.
- Hindari blok kode terlalu panjang tanpa konteks.

### 9) Tabel

Tabel cocok untuk perbandingan singkat.

```markdown
| Kebutuhan          | Rekomendasi          | Alasan                        |
| ------------------ | -------------------- | ----------------------------- |
| Artikel tutorial   | Numbered list        | Jelas langkah demi langkah    |
| Artikel opini      | Heading per argumen  | Alur logika lebih rapi        |
| Artikel referensi  | Table + checklist    | Cepat dipindai                |
```

### 10) Horizontal Rule

Gunakan pemisah antar bagian besar.

```markdown
---
```

### 11) Catatan Keamanan Konten

Gunakan Markdown standar. Hindari mengandalkan HTML mentah untuk konten utama.

---

## Gaya Penulisan yang Direkomendasikan

- Pakai kalimat aktif dan langsung ke poin.
- Satu paragraf untuk satu ide utama.
- Jelaskan istilah teknis saat pertama kali muncul.
- Beri contoh nyata, bukan hanya teori.
- Hindari kata yang terlalu berputar-putar.

Formula sederhana per paragraf:

1. Klaim utama.
2. Alasan atau konteks.
3. Contoh singkat.

---

## Template Siap Pakai

Salin template ini saat membuat artikel baru.

````markdown
## Apa yang Akan Kamu Pelajari

Di artikel ini kita akan membahas:
- ...
- ...
- ...

## Latar Belakang

Masalah yang sering terjadi adalah ...

## Solusi Utama

### Langkah 1
...

### Langkah 2
...

### Langkah 3
...

## Contoh Implementasi

```bash
# command contoh
```

## Kesalahan Umum

- ...
- ...

## Ringkasan

Inti yang perlu diingat:
- ...
- ...
- ...

## Next Step

Setelah ini kamu bisa mencoba:
1. ...
2. ...
3. ...
````

---

## Checklist Sebelum Publish

- [ ] Judul spesifik dan menjelaskan manfaat.
- [ ] Description singkat, jelas, dan tidak klik bait.
- [ ] Struktur heading sudah konsisten.
- [ ] Semua link valid dan relevan.
- [ ] Semua code block sudah dicoba.
- [ ] Tidak ada bagian yang mengulang tanpa nilai tambah.
- [ ] Penutup memberi arahan lanjut.

---

## Penutup

Jika bingung mulai dari mana, gunakan Template Siap Pakai di atas, lalu isi secara bertahap. Lebih baik draft sederhana tapi selesai, daripada menunggu tulisan sempurna sejak paragraf pertama.

Panduan ini bisa terus diperbarui seiring perubahan gaya menulis dan kebutuhan konten. Jadikan ini dokumen hidup untuk menjaga standar kualitas tulisan tetap tinggi.'
)
ON CONFLICT(slug) DO UPDATE SET
  title       = excluded.title,
  description = excluded.description,
  date        = excluded.date,
  featured    = excluded.featured,
  hidden      = excluded.hidden,
  content     = excluded.content;

COMMIT;
