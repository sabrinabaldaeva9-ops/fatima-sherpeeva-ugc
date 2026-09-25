document.addEventListener('DOMContentLoaded', async () => {

  if (typeof SETTINGS !== 'undefined') {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      ['instagram', 'telegram', 'whatsapp', 'email'].forEach(f => {
        if (data[f]) SETTINGS[f] = data[f];
      });
    } catch (e) {}
  }

  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in-view'));
  }

  document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('playing')) {
        const vid = card.querySelector('video');
        if (vid) { vid.pause(); vid.currentTime = 0; vid.remove(); }
        card.classList.remove('playing');
        return;
      }
      const video = document.createElement('video');
      video.src = card.dataset.video;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.addEventListener('error', () => { video.remove(); card.classList.remove('playing'); });
      card.insertBefore(video, card.firstChild);
      card.classList.add('playing');
    });
  });

  const filterPills = document.getElementById('filterPills');
  if (filterPills) {
    filterPills.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  }

  const contactGrid = document.getElementById('contactGrid');
  if (contactGrid && typeof SETTINGS !== 'undefined') {
    const icons = {
      instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
      telegram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 4L3 11l6 2.5M21 4l-3.5 16L9.5 13.5M21 4L9.5 13.5m0 0V19l3-3"/></svg>',
      whatsapp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12a8 8 0 1 1-3.7-6.7M20 12l-1-1M8 9c0 4 3 7 7 7"/></svg>',
      email: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>'
    };
    const items = [
      { key: 'instagram', href: v => v.startsWith('http') ? v : `https://instagram.com/${v.replace('@','')}` },
      { key: 'telegram',  href: v => v.startsWith('http') ? v : `https://t.me/${v.replace('@','')}` },
      { key: 'whatsapp',  href: v => v.startsWith('http') ? v : `https://wa.me/${v.replace(/\D/g,'')}` },
      { key: 'email',     href: v => `mailto:${v}` }
    ];
    let anyFilled = false;
    items.forEach(item => {
      const value = SETTINGS[item.key];
      if (!value) return;
      anyFilled = true;
      const a = document.createElement('a');
      a.href = item.href(value);
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'contact-card';
      a.innerHTML = `<span class="contact-icon">${icons[item.key]}</span><span>${value}</span>`;
      contactGrid.appendChild(a);
    });
    if (!anyFilled) {
      const empty = document.createElement('div');
      empty.className = 'contact-empty';
      empty.textContent = 'Контакты скоро появятся';
      contactGrid.appendChild(empty);
    }
  }

  if (typeof I18N !== 'undefined') {
    const htmlRoot = document.getElementById('htmlRoot');
    let currentLang = DEFAULT_LANG;
    try {
      const saved = localStorage.getItem('fs_lang');
      if (saved && I18N[saved]) currentLang = saved;
    } catch (e) {}
    function applyLang(lang) {
      const dict = I18N[lang] || I18N[DEFAULT_LANG];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
      });
      htmlRoot.setAttribute('lang', lang);
      document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
      });
      try { localStorage.setItem('fs_lang', lang); } catch (e) {}
    }
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
    applyLang(currentLang);
  }

  fetch('/api/media').then(r => r.json()).then(data => {
    const media = data.media || {};
    document.querySelectorAll('[data-slot]').forEach(el => {
      const slot = el.dataset.slot;
      const url = media[slot];
      if (!url) return;
      if (slot.startsWith('video')) {
        el.dataset.video = url;
        el.classList.add('has-media');
        return;
      }
      const img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.className = 'media-fill';
      el.insertBefore(img, el.firstChild);
      el.classList.add('has-media');
    });
  }).catch(() => {});

});
