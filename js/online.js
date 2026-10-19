// Touch helpers (tablet/mobile only; desktop behaviour is untouched)
const compactViewport = window.matchMedia('(max-width: 1024px)');

// Horizontal swipe for the autoplay sliders. Passive listeners, so vertical scrolling is never blocked.
function addSwipe(el, onNext, onPrev) {
    if (!el) return;
    let sx = 0, sy = 0, tracking = false;
    el.addEventListener('touchstart', (e) => {
        if (!compactViewport.matches || e.touches.length !== 1) { tracking = false; return; }
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
        tracking = true;
    }, { passive: true });
    el.addEventListener('touchend', (e) => {
        if (!tracking) return;
        tracking = false;
        const t = e.changedTouches[0];
        const dx = t.clientX - sx;
        const dy = t.clientY - sy;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            if (dx < 0) onNext(); else onPrev();
        }
    }, { passive: true });
    el.addEventListener('touchcancel', () => { tracking = false; }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
    // 2. SIGNORI SETS SLIDER (Z INDIKATORJI)
    const sliderWrapper = document.getElementById('sliderWrapper');
    const slideCounter = document.getElementById('slideCounter');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const progressFills = document.querySelectorAll('.progress-fill');
    
    let currentSlide = 0;
    const totalSlides = 5;
    const slideDuration = 5000;
    let slideInterval;

    function updateSlider() {
        if (!sliderWrapper) return;
        sliderWrapper.style.transform = `translateX(-${currentSlide * 20}%)`;
        if (slideCounter) {
            slideCounter.textContent = `${currentSlide + 1}/${totalSlides}`;
        }
        
        progressFills.forEach(fill => {
            fill.style.transition = 'none';
            fill.style.width = '0%';
        });

        void sliderWrapper.offsetWidth;

        const currentFill = progressFills[currentSlide];
        if (currentFill) {
            currentFill.style.transition = `width ${slideDuration}ms linear`;
            currentFill.style.width = '100%';
        }
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
        resetInterval();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
        resetInterval();
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    addSwipe(document.querySelector('.sets-slider-container'), nextSlide, prevSlide);

    if (sliderWrapper) {
        updateSlider();
        resetInterval();
    }
});

// 3. ANIMACIJA ZA "HERE TODAY" SEKCIJU (Intersection Observer za animacije i auto-play videa)
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const htLabel = document.querySelector('.ht-label');
    const htContent = document.querySelector('.ht-content');

    if (htLabel) sectionObserver.observe(htLabel);
    if (htContent) sectionObserver.observe(htContent);

    // Auto-play/pause video kad dođe u vidokrug
    const htVideo = document.querySelector('.ht-main-img');
    if (htVideo && htVideo.tagName === 'VIDEO') {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    htVideo.play().catch(() => {});
                } else {
                    htVideo.pause();
                }
            });
        }, { threshold: 0.1 });

        videoObserver.observe(htVideo);
    }
});

document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof Draggable === "undefined") return;
  gsap.registerPlugin(Draggable);

  const section    = document.querySelector(".signori-edit-section");
  const track      = document.getElementById("signori-track");
  const wrapper    = document.querySelector(".signori-slider-wrapper");
  if (!section || !track || !wrapper) return;

  const container  = section.querySelector(".signori-container");
  const titleBlock = section.querySelector(".signori-text-content");
  const counter    = section.querySelector(".pagination-text");
  const prevBtn    = section.querySelector(".prev-btn");
  const nextBtn    = section.querySelector(".next-btn");
  const slides     = track.querySelectorAll(".signori-slide");

  const FIRST_PAGE_COUNT = 3;   
  let   TOTAL_PAGES      = 2;     // desktop: always 2; tablet/mobile: one page per card
  const TITLE_SHIFT      = 120; 
  const reduceMotion     = window.matchMedia("(prefers-reduced-motion: reduce)");

  let page = 0;
  let maxX = 0;                 
  let snaps = [0, 0];           // track offsets (px) for each page
  let compact = false;          // true when the title is stacked above the cards (<=1024px)
  let startX = 0, lastX = 0, lastT = 0, velocity = 0;
  let draggable;

  function measure() {
    compact = compactViewport.matches;
    const T = wrapper.getBoundingClientRect().left - container.getBoundingClientRect().left;
    const d = slides[FIRST_PAGE_COUNT].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
    if (compact) {
      const wrapW  = wrapper.getBoundingClientRect().width;
      const trackW = track.getBoundingClientRect().width;
      const left0  = slides[0].getBoundingClientRect().left;
      maxX = Math.max(0, trackW - wrapW);
      const list = [];
      slides.forEach((s) => {
        const o = Math.min(maxX, Math.round(s.getBoundingClientRect().left - left0));
        if (!list.length || o > list[list.length - 1] + 1) list.push(o);
      });
      snaps = list.length ? list : [0];
      TOTAL_PAGES = snaps.length;
      wrapper.style.setProperty("--sig-left", "0px");
    } else {
      maxX = Math.max(0, d + T);
      snaps = [0, maxX];
      TOTAL_PAGES = 2;
      wrapper.style.setProperty("--sig-left", T + "px");
    }
  }

  function setProgress(x) {
    if (compact) {                
      gsap.set(titleBlock, { clearProps: "transform,opacity,pointerEvents" });
      return;
    }
    const p = maxX ? Math.min(1, Math.max(0, -x / maxX)) : 0;
    if (p < 0.0005) {
      gsap.set(titleBlock, { clearProps: "transform,opacity,pointerEvents" });
    } else {
      gsap.set(titleBlock, {
        x: -p * TITLE_SHIFT,
        opacity: 1 - p,
        force3D: true,
        overwrite: "auto"
      });
      titleBlock.style.pointerEvents = p > 0.5 ? "none" : "";
    }
  }

  function updateUI() {
    if (!counter) return;
    counter.textContent = (page + 1) + "/" + TOTAL_PAGES;
    const active = document.activeElement;
    if (prevBtn) prevBtn.disabled = page === 0;
    if (nextBtn) nextBtn.disabled = page === TOTAL_PAGES - 1;
  }

  function goTo(n, animate) {
    page = Math.min(TOTAL_PAGES - 1, Math.max(0, n));
    const target = page ? -snaps[page] : 0;
    gsap.killTweensOf(track);
    if (animate === false || reduceMotion.matches) {
      gsap.set(track, { x: target });
      draggable && draggable.update();
      setProgress(target);
    } else {
      gsap.to(track, {
        x: target,
        duration: 0.8,
        ease: "power2.out",
        overwrite: true,
        force3D: true,
        onUpdate: () => {
          setProgress(gsap.getProperty(track, "x"));
        },
        onComplete: () => {
          draggable && draggable.update();
          setProgress(target);
        }
      });
    }
    updateUI();
  }

  measure();

  draggable = Draggable.create(track, {
    type: "x",
    trigger: section,           
    bounds: { minX: -maxX, maxX: 0 },
    edgeResistance: 0.85,          
    dragResistance: 0,
    minimumMovement: 3,         
    cursor: "grab",
    activeCursor: "grabbing",
    onPressInit: function () { gsap.killTweensOf(track); },
    onPress: function () {
      startX = this.x; lastX = this.x; lastT = performance.now(); velocity = 0;
    },
    onDrag: function () {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velocity = (this.x - lastX) / dt;   
      lastX = this.x; lastT = now;
      setProgress(this.x);
    },
    onDragEnd: function () {
      if (compact) {
        const stale = performance.now() - lastT > 80;
        const v = stale ? 0 : velocity;
        const projected = -this.x - v * 200;
        let best = 0, bestDist = Infinity;
        snaps.forEach((s, i) => {
          const dd = Math.abs(s - projected);
          if (dd < bestDist) { bestDist = dd; best = i; }
        });
        goTo(best);
        return;
      }
      const dist = this.x - startX;
      const stale = performance.now() - lastT > 80;    
      const v = stale ? 0 : velocity;
      const threshold = Math.min(maxX * 0.15, 100);
      let next = page;
      if (page === 0 && (dist < -threshold || (v < -0.3 && dist < -15))) next = 1;
      else if (page === 1 && (dist > threshold || (v > 0.3 && dist > 15))) next = 0;
      goTo(next);                                      
    }
  })[0];

  if (nextBtn) nextBtn.addEventListener("click", () => goTo(page + 1));
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(page - 1));

  wrapper.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(page + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(page - 1); }
  });

  let resizeRaf;
  function onResize() {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      measure();
      if (draggable) draggable.applyBounds({ minX: -maxX, maxX: 0 });
      goTo(page, false);
    });
  }
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  window.addEventListener("load", onResize);

  goTo(0, false);
});

document.addEventListener('DOMContentLoaded', () => {
    // === KRAJ SECTION SLIDER LOGIKA ===
    const krajSlides = document.querySelectorAll('.kraj-slide');
    const krajPrevBtn = document.getElementById('krajPrev');
    const krajNextBtn = document.getElementById('krajNext');
    const krajProgressFills = document.querySelectorAll('.kraj-progress-fill');

    if (krajSlides.length > 0) {
        let currentKrajSlide = 0;
        let lastKrajSlide = -1;
        const totalKrajSlides = krajSlides.length;
        const krajSlideDuration = 5000;
        let krajSlideInterval;

        function updateKrajSlider() {
            krajSlides.forEach((slide, index) => {
                slide.classList.remove('active', 'outgoing');
                if (index === currentKrajSlide) {
                    slide.classList.add('active');
                } else if (index === lastKrajSlide) {
                    slide.classList.add('outgoing');
                }
            });

            krajProgressFills.forEach((fill, index) => {
                fill.style.transition = 'none';
                if (index < currentKrajSlide) {
                    fill.style.width = '100%';
                } else {
                    fill.style.width = '0%';
                }
            });

            void document.body.offsetWidth;

            const activeFill = krajProgressFills[currentKrajSlide];
            if (activeFill) {
                activeFill.style.transition = `width ${krajSlideDuration}ms linear`;
                activeFill.style.width = '100%';
            }
        }

        function nextKrajSlide() {
            lastKrajSlide = currentKrajSlide;
            currentKrajSlide = (currentKrajSlide + 1) % totalKrajSlides;
            updateKrajSlider();
            resetKrajInterval();
        }

        function prevKrajSlide() {
            lastKrajSlide = currentKrajSlide;
            currentKrajSlide = (currentKrajSlide - 1 + totalKrajSlides) % totalKrajSlides;
            updateKrajSlider();
            resetKrajInterval();
        }

        function resetKrajInterval() {
            clearInterval(krajSlideInterval);
            krajSlideInterval = setInterval(nextKrajSlide, krajSlideDuration);
        }

        if (krajNextBtn) krajNextBtn.addEventListener('click', nextKrajSlide);
        if (krajPrevBtn) krajPrevBtn.addEventListener('click', prevKrajSlide);
        addSwipe(document.querySelector('.kraj-slider-container'), nextKrajSlide, prevKrajSlide);

        updateKrajSlider();
        resetKrajInterval();
    }
});