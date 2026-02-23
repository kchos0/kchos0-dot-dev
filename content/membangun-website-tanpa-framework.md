---
title: Membangun Website Personal Tanpa Framework
date: February 22, 2026
featured: true
---

Orang pertama kali buka website ini biasanya langsung nanya,  “Pakai framework apa sih?”

Jawabannya pendek: nggak pakai apa-apa.

### Kenapa engga pakai framework?

Sebenernya ini adalah website experiment ku sendiri.

Aku pengen tau apakah bisa membuat website tanpa framework di era modern ini dan masih tetep keliatan keren.
Jawabannya bisa kalian liat sendiri di web ini

### Zero-stack, beneran nol

Aku nyebut pendekatan ini **zero-stack**. Bener-bener nggak ada apa-apa di runtime:

- HTML polos buat kerangka
- CSS polos buat styling
- Python buat nge-build
- Markdown buat nulis konten

Itu aja. Nggak ada dependency lain yang hidup di production.

### Gimana caranya jalan?

Di root ada satu file aja yang jadi jantungannya: `build.py`.

Jalankan `python3 build.py`, lalu kira-kira begini prosesnya:

1. Baca `config.json` → nama situs, bio singkat, link sosmed, dll.
2. Ambil template utama dari `templates/base.html`
3. Scan seluruh file di folder `content/` yang berakhiran `.md`
4. Tiap file Markdown: ambil frontmatter-nya (judul, tanggal, featured atau nggak), konversi isi ke HTML
5. Gabungin semuanya ke template → jadi satu file HTML utuh
6. Simpan ke folder output

Selesai dalam 1–3 detik. Nggak ada hot-reload yang muter-muter, nggak ada config bundler yang bikin kepala cenat-cenut.

### Templatingnya ala kadarnya

Nggak pakai Jinja, nggak pakai Mustache, apalagi library aneh-aneh. Cukup `str.replace()` doang.

Contoh potongan kodenya kira-kira begini:

```python
def render_page(title, content_html, active_nav=''):
    html = base_template  # ini string panjang dari base.html
    html = html.replace('{{SITE_NAME}}', config['site_name'])
    html = html.replace('{{PAGE_TITLE}}', title)
    html = html.replace('{{CONTENT}}', content_html)
    # ... beberapa replace lain untuk nav, footer, dsb
    return html
```

Sederhana? Banget. Tapi cukup lah kalo cuma buat website personal gini.

## Nulis artikelnya gampang

Tiap tulisan tinggal bikin file .md baru di folder content/. Formatnya standar:

```
---
title: Judul yang Bikin Penasaran
date: February 22, 2026
featured: true
---

Isi ceritanya di sini. Bisa pake heading, list, 
code block, gambar, apa aja yang Markdown dukung.
```

Kalau kasih `featured: true`, otomatis muncul di bagian “Selected Writings” di homepage. Kalau nggak, ya cuma nongol di halaman `/writing`. Simple.

## Hasil akhirnya?

Folder berisi file `.html` statis polos. Bisa di-deploy ke mana aja:

- GitHub Pages Netlify / Vercel / Cloudflare Pages (gratis)
- Hosting murah biasa
- Bahkan router wifi juga bisa

Nggak butuh server, nggak butuh database, nggak butuh runtime apapun.

---

Mungkin kedengeran jadul, tapi justru itu poinnya.
Website ini kemungkinan besar masih bisa dibuka 10–15 tahun lagi selama browser masih ada. Nggak ada framework yang tiba-tiba deprecated, nggak ada breaking change di versi baru, nggak ada “npm install” yang gagal karena dependency mati.
Kadang pendekatan paling sederhana emang yang paling bandel dan awet.

---

Selanjutnya aku bakal ceritain gimana cara hosting website ini di Cloudflare Pages.
