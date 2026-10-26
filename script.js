(function () {
  'use strict';

  /* Data proyek: ubah/tambah di sini */
  var projects = [
    { cat: 'desain', label: 'Desain Grafis', title: 'Desain Poster Kreatif', tools: 'Adobe Photoshop, Canva',
      short: 'Eksplorasi tipografi, warna, komposisi, dan penyampaian pesan melalui poster informatif.',
      desc: 'Eksplorasi tipografi, kontras warna, ritme komposisi visual, dan penyampaian pesan komunikasi melalui poster bertema sosial dan edukasi.' },
    { cat: 'seni', label: 'Seni Digital', title: 'Ilustrasi Digital', tools: 'Ibis Paint, Procreate',
      short: 'Eksplorasi karakter, bentuk, warna, dan teknik ilustrasi dengan aplikasi seni digital.',
      desc: 'Eksplorasi karakter, proporsi bentuk, gradasi warna, dan teknik arsir ilustrasi digital dengan sentuhan personal yang kaya ekspresi.' },
    { cat: 'seni', label: 'Seni Digital', title: 'Lukisan Digital', tools: 'Procreate, Ibis Paint',
      short: 'Eksplorasi bentuk dan warna melalui proses berkarya bebas di kanvas digital.',
      desc: 'Penerapan teknik sapuan kuas digital untuk menangkap suasana pencahayaan, siluet objek, serta eksperimen tekstur kanvas modern.' },
    { cat: 'desain', label: 'Desain Grafis', title: 'Desain Konten Media Sosial', tools: 'Canva, Adobe Photoshop',
      short: 'Tata letak visual yang konsisten untuk menyampaikan pesan informatif di media digital.',
      desc: 'Penyusunan konten edukasi dan promosi dengan palet warna konsisten, tipografi yang mudah dibaca, dan tata letak grid yang rapi.' },
    { cat: 'uiux', label: 'UI/UX', title: 'Eksplorasi UI/UX', tools: 'Figma, sketsa alur',
      short: 'Belajar menyusun hierarki informasi, alur interaksi, dan prototipe sistem informasi.',
      desc: 'Penyusunan arsitektur informasi, bagan alur pendaftaran pengguna, serta wireframe dasar aplikasi mobile yang ramah pengguna.' },
    { cat: 'multimedia', label: 'Multimedia', title: 'Proyek Multimedia', tools: 'CapCut',
      short: 'Eksplorasi penyuntingan klip video, audio, dan elemen motion.',
      desc: 'Penyuntingan video pendek, sinkronisasi audio latar, penyesuaian ritme potongan klip, serta eksperimen animasi tipografi singkat.' }
  ];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Menu mobile */
  var menuBtn = $('#menu-btn'), nav = $('#nav');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('a', nav).forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  /* Tandai menu sesuai bagian yang sedang dilihat */
  var links = $$('a', nav);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { io.observe(s); });
  }

  /* Foto profil: beri tahu jika file tidak ditemukan */
  var photo = $('.photo img');
  photo.addEventListener('error', function () { photo.classList.add('no-img'); photo.removeAttribute('src'); });

  /* Kartu proyek + filter */
  var grid = $('#project-grid');
  projects.forEach(function (p, i) {
    var card = document.createElement('article');
    card.className = 'card project';
    card.dataset.category = p.cat;
    card.innerHTML =
      '<div><span class="cat"></span><h3></h3><p></p></div>' +
      '<footer><span></span><button class="link-btn" type="button">Lihat detail</button></footer>';
    $('.cat', card).textContent = p.label;
    $('h3', card).textContent = p.title;
    $('p', card).textContent = p.short;
    $('footer span', card).textContent = p.tools;
    $('button', card).addEventListener('click', function () { openModal(i); });
    grid.appendChild(card);
  });

  $$('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.filter').forEach(function (b) { b.classList.toggle('active', b === btn); });
      var f = btn.dataset.filter;
      $$('.project', grid).forEach(function (c) { c.hidden = !(f === 'all' || c.dataset.category === f); });
    });
  });

  /* Modal detail */
  var modal = $('#modal'), lastFocus = null;
  function openModal(i) {
    var p = projects[i];
    lastFocus = document.activeElement;
    $('#m-cat').textContent = p.label;
    $('#m-title').textContent = p.title;
    $('#m-tools').textContent = p.tools;
    $('#m-desc').textContent = p.desc;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#m-close').focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $('#m-close').addEventListener('click', closeModal);
  $('#m-dismiss').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  /* Validasi formulir kontak */
  var form = $('#contact-form'), status = $('#form-status');
  var rules = {
    name: function (v) { return v.length > 0; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
    subject: function (v) { return v.length > 0; },
    message: function (v) { return v.length >= 10; }
  };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    Object.keys(rules).forEach(function (k) {
      var input = $('#f-' + k), err = $('#e-' + k);
      var valid = rules[k](input.value.trim());
      err.hidden = valid;
      input.setAttribute('aria-invalid', String(!valid));
      if (!valid && ok) input.focus();
      if (!valid) ok = false;
    });
    if (!ok) { status.hidden = true; return; }
    status.textContent = 'Terima kasih, ' + $('#f-name').value.trim() + '. Pesan Anda tercatat (mode demo, belum dikirim ke email).';
    status.hidden = false;
    form.reset();
  });
})();
