/* SIGNORI — Fabrics page
   Scroll reveals only. The shared navbar and footer scripts are untouched. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero: reveal once the photograph has loaded (with a safety timeout) */
  var hero = document.querySelector('.fb-hero');
  if (hero) {
    var heroImg = hero.querySelector('.fb-hero__img');
    var revealHero = function () { hero.classList.add('is-loaded'); };

    if (!heroImg || heroImg.complete) {
      window.requestAnimationFrame(revealHero);
    } else {
      heroImg.addEventListener('load', revealHero, { once: true });
      heroImg.addEventListener('error', revealHero, { once: true });
      window.setTimeout(revealHero, 2500);
    }
  }

  /* Editorial reveals */
  var items = document.querySelectorAll('.fabrics-page [data-reveal]');
  if (!items.length) { return; }

  var showAll = function () {
    for (var i = 0; i < items.length; i++) {
      items[i].classList.add('is-visible');
    }
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  items.forEach(function (el) { observer.observe(el); });
})();