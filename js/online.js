document.addEventListener('DOMContentLoaded', () => {
    // 1. VIDEO KONTROLE
    const video = document.getElementById('bgVideo');
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const mutedPath = `M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z`;
    const unmutedPath = `M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z`;

    soundToggle.addEventListener('click', () => {
        video.muted = !video.muted;
        soundIcon.innerHTML = `<path d="${video.muted ? mutedPath : unmutedPath}"/>`;
    });

    const playPauseToggle = document.getElementById('playPauseToggle');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const pausePath = `M6 19h4V5H6v14zm8-14v14h4V5h-4z`; 
    const playPath = `M8 5v14l11-7z`; 

    playPauseToggle.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseIcon.innerHTML = `<path d="${pausePath}"/>`;
        } else {
            video.pause();
            playPauseIcon.innerHTML = `<path d="${playPath}"/>`;
        }
    });

    // 2. SIGNORI SETS SLIDER (Z INDIKATORJI)
    const sliderWrapper = document.getElementById('sliderWrapper');
    const slideCounter = document.getElementById('slideCounter');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const progressFills = document.querySelectorAll('.progress-fill');
    
    let currentSlide = 0;
    const totalSlides = 5;
    const slideDuration = 5000; // 5 sekund na sliko
    let slideInterval;

    function updateSlider() {
        // Premakni drsnik (slike)
        sliderWrapper.style.transform = `translateX(-${currentSlide * 20}%)`;
        
        // Posodobi števec (npr. 1/5)
        slideCounter.textContent = `${currentSlide + 1}/${totalSlides}`;
        
        // Ponastavi vse vrstice napredka (progress bars)
        progressFills.forEach(fill => {
            fill.style.transition = 'none';
            fill.style.width = '0%';
        });

        // "Force reflow" - omogoča takojšnjo ponastavitev CSS animacije
        void sliderWrapper.offsetWidth;

        // Zaženi animacijo za trenutni indikator (od leve proti desni)
        const currentFill = progressFills[currentSlide];
        currentFill.style.transition = `width ${slideDuration}ms linear`;
        currentFill.style.width = '100%';
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

    // Gumbi za ročni premik
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Inicializacija ob nalaganju strani
    updateSlider();
    resetInterval();
});

// 3. ANIMACIJA ZA "HERE TODAY" SEKCIJU (Intersection Observer)
    const observerOptions = {
        threshold: 0.2
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcionalno: ukoliko želite da se animacija desi samo jednom, otkomentarišite donju liniju
                // sectionObserver.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const htLabel = document.querySelector('.ht-label');
    const htContent = document.querySelector('.ht-content');

    if (htLabel) sectionObserver.observe(htLabel);
    if (htContent) sectionObserver.observe(htContent);

    // --- KRAJ SECTION SCROLL ANIMATION ---
document.addEventListener('scroll', () => {
    const krajSection = document.getElementById('krajSection');
    if (!krajSection) return;

    const rect = krajSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    const totalScroll = rect.height - windowHeight;
    if (totalScroll <= 0) return;

    let progress = -rect.top / totalScroll;
    const krajLeft = document.getElementById('krajLeft');
    const krajRight = document.getElementById('krajRight');

    if (krajLeft && krajRight) {
        const leftExcess = krajLeft.scrollHeight - windowHeight;
        const rightExcess = krajRight.scrollHeight - windowHeight;

        // Skrolirat se ednovremenno i dvete koloni spored progresa na skrola
        if (leftExcess > 0) {
            krajLeft.style.transform = `translateY(-${leftExcess * progress}px)`;
        } else {
            krajLeft.style.transform = `translateY(0px)`;
        }

        if (rightExcess > 0) {
            krajRight.style.transform = `translateY(-${rightExcess * progress}px)`;
        } else {
            krajRight.style.transform = `translateY(0px)`;
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
  // ===== THE SIGNORI EDIT: 2-page horizontal carousel (GSAP + Draggable, already in the project) =====
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

  const FIRST_PAGE_COUNT = 3;   // page 1 = slides 1-3, page 2 = slides 4-5
  const TOTAL_PAGES      = 2;
  const TITLE_SHIFT      = 120; // px the title travels left while fading out
  const reduceMotion     = window.matchMedia("(prefers-reduced-motion: reduce)");

  let page = 0;
  let maxX = 0;                 // distance (px) the track travels to reach page 2
  let startX = 0, lastX = 0, lastT = 0, velocity = 0;
  let draggable;

  // Measure everything from the live DOM so it stays correct at any width
  function measure() {
    const T = wrapper.getBoundingClientRect().left - container.getBoundingClientRect().left;
    const d = slides[FIRST_PAGE_COUNT].getBoundingClientRect().left - slides[0].getBoundingClientRect().left;
    // Page 2: slide 4 lands on the container's left edge (where the title used to be)
    maxX = Math.max(0, d + T);
    wrapper.style.setProperty("--sig-left", T + "px");
  }

  // Title follows the carousel progress (0 = page 1, 1 = page 2)
  function setProgress(x) {
    const p = maxX ? Math.min(1, Math.max(0, -x / maxX)) : 0;
    if (p < 0.0005) {
      // page 1 resting state: remove inline styles so it is EXACTLY the original
      titleBlock.style.transform = "";
      titleBlock.style.opacity = "";
      titleBlock.style.pointerEvents = "";
    } else {
      titleBlock.style.transform = "translate3d(" + (-p * TITLE_SHIFT) + "px,0,0)";
      titleBlock.style.opacity = String(1 - p);
      titleBlock.style.pointerEvents = p > 0.5 ? "none" : "";
    }
  }

  function updateUI() {
    counter.textContent = (page + 1) + "/" + TOTAL_PAGES;
    const active = document.activeElement;
    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === TOTAL_PAGES - 1;
    // keep keyboard focus alive when the focused button just became disabled
    if (active === prevBtn && prevBtn.disabled) nextBtn.focus();
    else if (active === nextBtn && nextBtn.disabled) prevBtn.focus();
  }

  function goTo(n, animate) {
    page = Math.min(TOTAL_PAGES - 1, Math.max(0, n));
    const target = page ? -maxX : 0;
    gsap.killTweensOf(track);
    if (animate === false || reduceMotion.matches) {
      gsap.set(track, { x: target });
      draggable && draggable.update();
      setProgress(target);
    } else {
      gsap.to(track, {
        x: target,
        duration: 0.9,
        ease: "power3.inOut",
        overwrite: true,
        onUpdate: () => {
          draggable && draggable.update();
          setProgress(gsap.getProperty(track, "x"));
        }
      });
    }
    updateUI();
  }

  measure();

  draggable = Draggable.create(track, {
    type: "x",
    bounds: { minX: -maxX, maxX: 0 },
    edgeResistance: 1,          // hard stop: no overscroll past first/last page
    dragResistance: 0,
    minimumMovement: 6,         // ignore tiny accidental movements
    cursor: "grab",
    activeCursor: "grabbing",
    onPressInit: function () { gsap.killTweensOf(track); },
    onPress: function () {
      startX = this.x; lastX = this.x; lastT = performance.now(); velocity = 0;
    },
    onDrag: function () {
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velocity = (this.x - lastX) / dt;   // px per ms
      lastX = this.x; lastT = now;
      setProgress(this.x);
    },
    onDragEnd: function () {
      const dist = this.x - startX;
      const stale = performance.now() - lastT > 80;    // finger rested before release
      const v = stale ? 0 : velocity;
      const threshold = Math.min(maxX * 0.2, 140);
      let next = page;
      if (page === 0 && (dist < -threshold || (v < -0.4 && dist < -24))) next = 1;
      else if (page === 1 && (dist > threshold || (v > 0.4 && dist > 24))) next = 0;
      goTo(next);                                      // snaps smoothly (back to current page if below threshold)
    }
  })[0];

  nextBtn.addEventListener("click", () => goTo(page + 1));
  prevBtn.addEventListener("click", () => goTo(page - 1));

  wrapper.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(page + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(page - 1); }
  });

  // Resize / orientation change: re-measure and re-place without animation
  let resizeRaf;
  function onResize() {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      measure();
      draggable.applyBounds({ minX: -maxX, maxX: 0 });
      goTo(page, false);
    });
  }
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  window.addEventListener("load", onResize);

  goTo(0, false);
});