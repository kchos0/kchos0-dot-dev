-- Migration: buat tabel articles & projects
-- Jalankan via: turso db shell <db-name> < scripts/migrate.sql

CREATE TABLE IF NOT EXISTS articles (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  slug      TEXT    UNIQUE NOT NULL,
  title     TEXT    NOT NULL,
  description TEXT,
  date      TEXT    NOT NULL,
  featured  INTEGER NOT NULL DEFAULT 0,  -- 0 = false, 1 = true
  hidden    INTEGER NOT NULL DEFAULT 0,  -- 0 = visible, 1 = hidden from public
  content   TEXT    NOT NULL
);

-- Migration untuk database yang sudah ada: tambah kolom hidden jika belum ada
ALTER TABLE articles ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0;

-- Migration: buat tabel projects
CREATE TABLE IF NOT EXISTS projects (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    UNIQUE NOT NULL,
  title       TEXT    NOT NULL,
  description TEXT,
  url         TEXT,
  date        TEXT    NOT NULL,
  featured    INTEGER NOT NULL DEFAULT 0,  -- 0 = false, 1 = true
  hidden      INTEGER NOT NULL DEFAULT 0,  -- 0 = visible, 1 = hidden from public
  content     TEXT
);

-- Seed: artikel pertama (dari src/content/writing/membangun-web-ini.md)
INSERT OR IGNORE INTO articles (slug, title, description, date, featured, content) VALUES (
  'membangun-web-ini',
  'Membangun Personal Web Minimalis',
  'Cerita tentang bagaimana saya membangun website ini dari nol menggunakan Astro, dengan fokus pada performa tinggi, desain minimalis, dan kemudahan pengelolaan konten.',
  '2026-03-02',
  1,
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
);
