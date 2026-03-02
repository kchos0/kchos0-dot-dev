---
title: "Membangun Personal Web Minimalis"
date: "March 2, 2026"
featured: true
---
Halo! Di post pertama ini, saya ingin berbagi cerita tentang bagaimana saya membangun website ini dari nol. Website ini bukan sekadar portofolio, tapi juga eksperimen dalam menggunakan teknologi modern yang sangat *developer-friendly* tanpa mengorbankan performa.

Fokus utamanya ada tiga: **performa tinggi**, **desain minimalis**, dan **kemudahan pengelolaan konten**.

## Arsitektur & Teknologi

Website ini dibangun dengan stack yang sangat efisien:

### 1. Astro 5.0 (The Engine)
Saya memilih Astro karena filosofinya yang "Zero JS by default". Versi 5.0 membawa fitur **Content Layer** yang sangat membantu dalam mengelola data dari berbagai sumber (Markdown, JSON, API) dengan *type-safe*.
- **Islands Architecture**: Hanya bagian interaktif (seperti tombol copy kode atau toggle tema) yang menggunakan JavaScript.
- **Fast Build**: Proses pembuatan situs statis yang sangat cepat.

### 2. TinaCMS (The Content Editor)
Untuk CMS, saya menggunakan TinaCMS dengan konfigurasi **local-first**.
- **Real-time Editing**: Saya bisa melihat perubahan konten secara langsung di browser sebelum disimpan.
- **Git-backed**: Semua perubahan yang dilakukan di CMS akan disimpan sebagai file Markdown di repositori Git, sehingga saya tetap memiliki kendali penuh atas data saya.

### 3. Vanilla CSS & Custom Properties
Alih-alih menggunakan framework besar seperti Tailwind atau Bootstrap, saya memilih **CSS Murni**.
- **Design System**: Menggunakan *CSS Variables* untuk mengelola warna, jarak (*spacing*), dan tipografi.
- **Dark Mode**: Implementasi mode gelap yang sangat ringan menggunakan atribut `data-theme`.

---

## Mengapa Memilih Stack ini?

Saya menginginkan website yang tidak hanya cepat bagi pengunjung, tetapi juga nyaman bagi saya sebagai penulis. Dengan stack ini, saya mendapatkan:
- **Performa Sempurna**: Skor Lighthouse yang mencapai 100 di semua kategori.
- **Developer Experience**: Menulis artikel semudah melakukan `git push` atau menggunakan dashboard TinaCMS.

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
  const svdTheme = localStorage.getItem('theme');
  if (svdTheme) document.documentElement.setAttribute('data-theme', svdTheme);
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.setAttribute('data-theme', 'dark');
} catch (_) {}
```

### Modular Components
Awalnya, kode website ini cukup menumpuk di satu tempat. Lalu setelah konsiderasi, saya melakukan refaktor dengan memecah komponen menjadi lebih modular:
- `BaseHead.astro`: Untuk meta-data SEO dan Open Graph.
- `Sidebar.astro`: Navigasi vertikal yang responsif.
- `utils/date.ts`: Modul khusus untuk menangani format tanggal secara konsisten (misal: "Feb '26" di halaman depan).

### Syntax Highlighting dengan Shiki
Untuk artikel teknis, tampilan kode sangat penting. Saya menggunakan **Shiki** yang terintegrasi langsung dengan Astro. Shiki merender kode sesuai tema VS Code favorit, sehingga pembaca bisa melihat kode dengan pewarnaan yang nyaman di mata.

---

## Apa Selanjutnya?

Ini barulah permulaan. Nantinya saya akan menambahkan fitur-fitur menarik lainnya.

Bagi teman-teman yang ingin melihat kode sumbernya, silakan cek di [repositori GitHub saya](https://github.com/kchos0/kchos0-dot-dev). Terima kasih sudah mampir!
