(function () {
  const $ = (sel, r = document) => r.querySelector(sel);
  const $$ = (sel, r = document) => [...r.querySelectorAll(sel)];

  /** Optional: window.__SUPABASE_URL__ + load @supabase/supabase-js before app.js for real saves */
  const SUPABASE_URL = typeof window.__SUPABASE_URL__ === 'string' ? window.__SUPABASE_URL__ : '';

  function initSmoothAnchors() {
    document.documentElement.classList.add('scroll-smooth');
    const headerH = () => $('#site-header')?.offsetHeight ?? 72;
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        const y = el.getBoundingClientRect().top + window.scrollY - headerH() + 2;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        closeMobileNav();
      });
    });
  }

  function initHeaderScroll() {
    const header = $('#site-header');
    if (!header) return;
    const top = ['bg-transparent', 'backdrop-blur-none', 'shadow-none', 'border-transparent'];
    const scrolled = [
      'border-white/10',
      'bg-black/55',
      'backdrop-blur-2xl',
      'backdrop-saturate-150',
      'shadow-[0_12px_48px_rgba(0,0,0,0.45)]',
    ];
    function apply() {
      const down = window.scrollY > 24;
      (down ? top : scrolled).forEach((c) => header.classList.remove(c));
      (down ? scrolled : top).forEach((c) => header.classList.add(c));
    }
    header.classList.add(...top);
    apply();
    window.addEventListener('scroll', apply, { passive: true });
  }

  let lastScrollY = 0;
  function initNavHideOnScroll() {
    const header = $('#site-header');
    if (!header) return;
    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        if (y < 64) header.classList.remove('nav-hidden');
        else if (y > lastScrollY + 6) header.classList.add('nav-hidden');
        else if (y < lastScrollY - 6) header.classList.remove('nav-hidden');
        lastScrollY = y;
      },
      { passive: true }
    );
  }

  function initNavScrollSpy() {
    const links = $$('.nav-link[data-section]');
    if (!links.length) return;
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((en) => {
          if (!en.isIntersecting) return;
          const id = en.target.id;
          links.forEach((a) => {
            const on = a.dataset.section === id;
            a.classList.toggle('text-industrial-neon', on);
            a.classList.toggle('text-white/70', !on);
            a.setAttribute('aria-current', on ? 'true' : 'false');
          });
        });
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0.01 }
    );
    $$('main > section[id], footer[id]').forEach((sec) => {
      if (sec.id) io.observe(sec);
    });
  }

  function closeMobileNav() {
    $('#mobile-drawer')?.classList.add('translate-x-full', 'pointer-events-none');
    $('#mobile-drawer')?.setAttribute('aria-hidden', 'true');
    $('#nav-toggle')?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('overflow-hidden');
  }

  function openMobileNav() {
    const d = $('#mobile-drawer');
    if (!d) return;
    d.classList.remove('translate-x-full', 'pointer-events-none');
    d.setAttribute('aria-hidden', 'false');
    $('#nav-toggle')?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('overflow-hidden');
  }

  function initMobileNav() {
    const btn = $('#nav-toggle');
    const d = $('#mobile-drawer');
    if (!btn || !d) return;
    btn.addEventListener('click', () => {
      const open = d.classList.contains('translate-x-full');
      if (open) openMobileNav();
      else closeMobileNav();
    });
    d.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', closeMobileNav));
    $('#mobile-close')?.addEventListener('click', closeMobileNav);
  }

  const ACTIVE_TAB = [
    'border-industrial-copper',
    'bg-industrial-copper/15',
    'text-industrial-neon',
    'shadow-[0_0_20px_rgba(184,115,51,0.25)]',
  ];
  const INACTIVE_TAB = ['border-industrial-copper/40', 'bg-transparent', 'text-white/70', 'shadow-none'];
  const TAB_ALL = [...ACTIVE_TAB, ...INACTIVE_TAB];

  function paintTab(tab, on) {
    TAB_ALL.forEach((c) => tab.classList.remove(c));
    (on ? ACTIVE_TAB : INACTIVE_TAB).forEach((c) => tab.classList.add(c));
  }

  function applyMenuFilter(panel) {
    const active = panel.querySelector('.menu-filter-chip[aria-pressed="true"]');
    const filter = (active?.dataset.filter || 'all').toLowerCase();
    panel.querySelectorAll('[data-menu-tags]').forEach((card) => {
      const tags = (card.dataset.menuTags || '')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      const show = filter === 'all' || tags.includes(filter);
      card.classList.toggle('hidden', !show);
    });
  }

  function initMenuTabs() {
    const tabs = $$('[data-menu-tab]');
    const panels = $$('[data-menu-panel]');
    if (!tabs.length || !panels.length) return;
    const filters = $('#menu-filters');

    function select(name) {
      tabs.forEach((tab) => {
        const on = tab.dataset.menuTab === name;
        tab.setAttribute('aria-selected', String(on));
        paintTab(tab, on);
      });
      panels.forEach((p) => {
        const on = p.dataset.menuPanel === name;
        p.classList.toggle('hidden', !on);
        p.toggleAttribute('hidden', !on);
        if (on && window.gsap) {
          gsap.fromTo(p, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' });
        }
        if (on) applyMenuFilter(p);
      });
      if (filters) filters.classList.toggle('hidden', name !== 'drinks');
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => select(tab.dataset.menuTab)));
    select('drinks');

    $$('.menu-filter-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const row = chip.closest('#menu-filters');
        row?.querySelectorAll('.menu-filter-chip').forEach((c) => c.setAttribute('aria-pressed', 'false'));
        chip.setAttribute('aria-pressed', 'true');
        const vis = document.querySelector('[data-menu-panel="drinks"]:not(.hidden)');
        if (vis) applyMenuFilter(vis);
      });
    });
  }

  function initScrollReveal() {
    const nodes = $$('.js-reveal');
    if (!nodes.length || !('IntersectionObserver' in window)) return;
    const hide = ['opacity-0', 'translate-y-8'];
    const show = ['opacity-100', 'translate-y-0'];
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          hide.forEach((c) => el.classList.remove(c));
          show.forEach((c) => el.classList.add(c));
          obs.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' }
    );
    nodes.forEach((el) => {
      if (el.dataset.revealDelay) el.style.transitionDelay = el.dataset.revealDelay;
      io.observe(el);
    });
  }

  function initGsapHero() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const inner = $('#hero-inner');
    const vid = $('#hero-video');
    if (inner) {
      gsap.to(inner, {
        y: 48,
        opacity: 0.92,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }
    if (vid) {
      gsap.to(vid, {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
      });
    }
    const cards = $$('#menu .menu-card');
    if (cards.length && window.ScrollTrigger && typeof ScrollTrigger.batch === 'function') {
      try {
        ScrollTrigger.batch(cards, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.from(batch, { opacity: 0, y: 28, stagger: 0.06, duration: 0.55, ease: 'power2.out' }),
        });
      } catch (_) {}
    }
  }

  function setDatetimeLimits() {
    const inp = $('#booking-time');
    if (!inp || inp.type !== 'datetime-local') return;
    const pad = (n) => String(n).padStart(2, '0');
    const loc = (d) => {
      const y = d.getFullYear();
      const m = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const h = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${y}-${m}-${day}T${h}:${mi}`;
    };
    const min = new Date();
    min.setHours(min.getHours() + 2);
    const max = new Date();
    max.setDate(max.getDate() + 60);
    inp.min = loc(min);
    inp.max = loc(max);
  }

  async function fakeSubmit(payload) {
    if (SUPABASE_URL && window.supabase?.createClient) {
      try {
        const c = window.supabase.createClient(SUPABASE_URL, window.__SUPABASE_ANON_KEY__ || '');
        const { error } = await c.from('reservations').insert([payload]);
        if (error) throw error;
        return { ok: true };
      } catch (e) {
        console.warn('Supabase:', e);
      }
    }
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true };
  }

  function initBookingForm() {
    const form = $('#booking-form');
    const ok = $('#booking-success');
    const errBox = $('#booking-errors');
    if (!form) return;
    setDatetimeLimits();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errBox.textContent = '';
      const btn = form.querySelector('[type="submit"]');
      const guests = $('#booking-guests');
      const phone = ($('#booking-phone')?.value || '').replace(/\s/g, '');
      const phoneOk = /^\+?\d{9,15}$/.test(phone);
      if (!phoneOk) {
        errBox.textContent = 'Моля, въведете валиден телефон (с код на държава).';
        return;
      }
      btn.disabled = true;
      btn.classList.add('opacity-60');
      const data = Object.fromEntries(new FormData(form).entries());
      data.phone = phone;
      data.guests = guests ? Number(guests.value) : 2;
      console.log('Резервация (payload):', data);
      const res = await fakeSubmit(data);
      btn.disabled = false;
      btn.classList.remove('opacity-60');
      if (res.ok) {
        form.classList.add('hidden');
        ok?.classList.remove('hidden');
        if (window.gsap) gsap.fromTo(ok, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 });
      }
    });
  }

  function initSofiaNightGlow() {
    const hour = parseInt(
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Sofia', hour: 'numeric', hourCycle: 'h23' })
        .formatToParts(new Date())
        .find((p) => p.type === 'hour')?.value ?? '12',
      10
    );
    if (!(hour >= 18 || hour < 8)) return;
    $$('[data-copper-neon]').forEach((el) => el.classList.add('neon-glow'));
  }

  function initGalleryLightbox() {
    const lb = $('#lightbox');
    const img = $('#lightbox-img');
    const figs = $$('#gallery-masonry figure[data-gallery-src]');
    if (!lb || !img || !figs.length) return;
    let idx = 0;
    const list = figs.map((f) => ({
      src: f.dataset.gallerySrc,
      alt: f.dataset.galleryAlt || '',
    }));

    function show(i) {
      idx = (i + list.length) % list.length;
      img.style.opacity = '0';
      img.style.transform = 'scale(0.96)';
      const next = new Image();
      next.onload = () => {
        img.src = list[idx].src;
        img.alt = list[idx].alt;
        if (window.gsap) gsap.to(img, { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' });
        else {
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
        }
      };
      next.src = list[idx].src;
    }

    function open(i) {
      lb.classList.remove('hidden');
      lb.classList.remove('pointer-events-none');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('overflow-hidden');
      show(i);
      if (window.gsap) gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      else lb.style.opacity = '1';
    }

    function close() {
      const afterClose = () => {
        lb.classList.add('hidden', 'pointer-events-none');
        lb.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('overflow-hidden');
        lb.style.opacity = '';
        if (window.gsap) gsap.set(lb, { clearProps: 'opacity' });
      };
      if (window.gsap) gsap.to(lb, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: afterClose });
      else afterClose();
    }

    figs.forEach((f, i) => {
      f.style.cursor = 'zoom-in';
      f.addEventListener('click', () => open(i));
    });
    $('#lightbox-close')?.addEventListener('click', close);
    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });
    $('#lightbox-prev')?.addEventListener('click', () => show(idx - 1));
    $('#lightbox-next')?.addEventListener('click', () => show(idx + 1));
    document.addEventListener('keydown', (e) => {
      if (lb.classList.contains('hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });

    let x0 = null;
    lb.addEventListener(
      'touchstart',
      (e) => {
        x0 = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    lb.addEventListener(
      'touchend',
      (e) => {
        if (x0 == null) return;
        const x1 = e.changedTouches[0].screenX;
        const d = x1 - x0;
        x0 = null;
        if (d > 56) show(idx - 1);
        else if (d < -56) show(idx + 1);
      },
      { passive: true }
    );
  }

  function initImageBlurLoaded() {
    $$('.img-blur-wrap').forEach((wrap) => {
      const im = wrap.querySelector('img');
      if (!im) return;
      const done = () => wrap.classList.add('is-loaded');
      if (im.complete) done();
      else im.addEventListener('load', done, { once: true });
    });
  }

  function initMagnetic() {
    if (!matchMedia('(pointer:fine)').matches) return;
    $$('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.12;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.12;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  function initCursor() {
    if (!matchMedia('(pointer:fine)').matches) return;
    const dot = $('#cursor-dot');
    if (!dot) return;
    document.body.classList.add('has-custom-cursor');
    window.addEventListener(
      'mousemove',
      (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
      },
      { passive: true }
    );
  }

  function initSpotlight() {
    const hero = $('#hero');
    const sp = $('#hero-spotlight');
    if (!hero || !sp || !matchMedia('(pointer:fine)').matches) return;
    hero.addEventListener(
      'mousemove',
      (e) => {
        const r = hero.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        sp.style.background = `radial-gradient(420px circle at ${x}% ${y}%, rgba(255,215,0,0.07), transparent 55%)`;
      },
      { passive: true }
    );
  }

  initSmoothAnchors();
  initHeaderScroll();
  initNavHideOnScroll();
  initNavScrollSpy();
  initMobileNav();
  initMenuTabs();
  initScrollReveal();
  initGsapHero();
  initBookingForm();
  initSofiaNightGlow();
  initGalleryLightbox();
  initImageBlurLoaded();
  initMagnetic();
  initCursor();
  initSpotlight();
})();
