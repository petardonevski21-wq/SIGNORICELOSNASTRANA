/* SIGNORI IN BELGRADE — edit CONFIG only for dates, venue and booking. */
(() => {
  'use strict';

  const CONFIG = {
    BOOKING_URL: '',            // TODO: set the real booking URL. Empty = links go to #appointment.
    INSTAGRAM_URL: '',          // Optional. Empty = Instagram link stays hidden.
    EVENT: {
      dates: '',                // e.g. '12–15 March' — empty keeps the visible placeholder
      venue: '',
      address: ''
    }
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('sj-js');

  // Event details + booking destination
  Object.entries(CONFIG.EVENT).forEach(([key, val]) => {
    if (val) $$(`[data-sj="${key}"]`).forEach(el => (el.textContent = val));
  });
  if (CONFIG.BOOKING_URL) {
    $$('[data-sj-booking]').forEach(a => {
      a.href = CONFIG.BOOKING_URL;
      a.rel = 'noopener';
    });
  }
  if (CONFIG.INSTAGRAM_URL) {
    const ig = $('[data-sj-instagram]');
    if (ig) { ig.href = CONFIG.INSTAGRAM_URL; ig.hidden = false; ig.rel = 'noopener'; }
  }
  const year = $('#sjYear');
  if (year) year.textContent = new Date().getFullYear();

  // Header: solid after scroll, mobile menu
  const header = $('#sjHeader');
  const menu = $('#sjMenu');
  const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  const setMenu = open => {
    header.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'CLOSE' : 'MENU';
  };
  menu.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  $$('#sjNav a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // Smooth internal navigation, offset for fixed header
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = id.length > 1 && $(id);
      if (!target) return;
      e.preventDefault();
      const top = id === '#top' ? 0 : target.getBoundingClientRect().top + scrollY - 60;
      scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  // Scroll reveals — once only
  const items = $$('.sj-reveal');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('is-in'));
  }

  // Restrained parallax on the hero image only
  const px = $('[data-sj-parallax]');
  if (px && !reduced) {
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking || scrollY > innerHeight * 1.2) return;
      ticking = true;
      requestAnimationFrame(() => {
        px.style.transform = `translate3d(0,${scrollY * -0.06}px,0)`;
        ticking = false;
      });
    }, { passive: true });
  }

  // Missing image slots keep layout and show the slot name
  $$('.sj-fig img').forEach(img => {
    const flag = () => img.closest('.sj-fig').classList.add('is-missing');
    img.addEventListener('error', flag);
    if (img.complete && img.naturalWidth === 0) flag();
  });
})();