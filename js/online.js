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
    // 2. SIGNORI SETS SLIDER (SEAMLESS INFINITE LOOP FOR DESKTOP & MOBILE)
    const sliderWrapper = document.getElementById('sliderWrapper');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const progressFills = document.querySelectorAll('.progress-fill');
    
    if (sliderWrapper) {
        const originalSlides = Array.from(sliderWrapper.children);
        const totalSlides = originalSlides.length; // 2 slides
        const slideDuration = 5000;
        let slideInterval;
        let isTransitioning = false;
        
        // Setup cloned slides for seamless infinite loop: [Clone Last, Slide 1..2, Clone First]
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[totalSlides - 1].cloneNode(true);
        
        sliderWrapper.appendChild(firstClone);
        sliderWrapper.insertBefore(lastClone, originalSlides[0]);
        
        const allSlides = Array.from(sliderWrapper.children);
        const totalTrackSlides = allSlides.length; // 4 slides total
        
        // Track layout sizing (4 slides = 400% width, each slide = 1/4 th of total width)
        sliderWrapper.style.width = `${totalTrackSlides * 100}%`;
        allSlides.forEach(slide => {
            slide.style.width = `${100 / totalTrackSlides}%`;
        });

        // Track position (currentIndex 1 is original Slide 1)
        let currentIndex = 1;
        
        // Jump to position without CSS animation
        function setTrackPosition(index) {
            sliderWrapper.style.transition = 'none';
            sliderWrapper.style.transform = `translateX(-${(index * 100) / totalTrackSlides}%)`;
        }

        // Initial setup
        setTrackPosition(currentIndex);

        function updatePaginationAndFills(displayIndex) {
            // Update slide title dynamically based on active slide index
            const setTitles = ["WINTER COATS", "BOMBER SETS"];
            const sliderTitleEl = document.querySelector('.slider-text-overlay h2');
            if (sliderTitleEl) {
                sliderTitleEl.textContent = setTitles[displayIndex] || "WINTER COATS";
            }

            // Update counter digit
            const setsPaginationTrack = document.getElementById('sets-pagination-track');
            if (setsPaginationTrack) {
                setsPaginationTrack.style.setProperty("--total-pages", totalSlides);
                const targetY = `-${(displayIndex * 100) / totalSlides}%`;
                if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    gsap.set(setsPaginationTrack, { y: targetY });
                } else {
                    gsap.to(setsPaginationTrack, {
                        y: targetY,
                        duration: 0.55,
                        ease: "cubic-bezier(0.76, 0, 0.24, 1)",
                        overwrite: true,
                        force3D: true
                    });
                }
            }
            
            // Reset and start progress fill bar animation
            progressFills.forEach(fill => {
                fill.style.transition = 'none';
                fill.style.width = '0%';
            });

            void sliderWrapper.offsetWidth; // Force reflow

            const currentFill = progressFills[displayIndex];
            if (currentFill) {
                currentFill.style.transition = `width ${slideDuration}ms linear`;
                currentFill.style.width = '100%';
            }
        }

        function goToSlide(targetIndex, direction = 'next') {
            if (isTransitioning) return;
            isTransitioning = true;

            currentIndex = targetIndex;
            sliderWrapper.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            sliderWrapper.style.transform = `translateX(-${(currentIndex * 100) / totalTrackSlides}%)`;

            // Calculate current real slide index (0 to 1)
            let realIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updatePaginationAndFills(realIndex);
        }

        // Silent jump when reaching clones at animation end
        sliderWrapper.addEventListener('transitionend', (e) => {
            if (e.target !== sliderWrapper) return;
            
            if (currentIndex === totalTrackSlides - 1) {
                // Transitioned forward to Clone of Slide 1 -> Silent jump to real Slide 1
                currentIndex = 1;
                setTrackPosition(currentIndex);
            } else if (currentIndex === 0) {
                // Transitioned backward to Clone of Slide 2 -> Silent jump to real Slide 2
                currentIndex = totalSlides;
                setTrackPosition(currentIndex);
            }
            
            isTransitioning = false;
        });

        function nextSlide() {
            if (isTransitioning) return;
            goToSlide(currentIndex + 1, 'next');
            resetInterval();
        }

        function prevSlide() {
            if (isTransitioning) return;
            goToSlide(currentIndex - 1, 'prev');
            resetInterval();
        }

        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDuration);
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        addSwipe(document.querySelector('.sets-slider-container'), nextSlide, prevSlide);

        updatePaginationAndFills(0);
        resetInterval();
    }
});

// 3. AUTO-PLAY VIDEO ZA "HERE TODAY" SEKCIJU & MOBILE SCROLL COUNTER ANIMATION
document.addEventListener('DOMContentLoaded', () => {
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

    const htProducts = document.getElementById('htProducts');
    const htPaginationTrack = document.getElementById('ht-pagination-track');
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (htProducts && htPaginationTrack) {
        htProducts.addEventListener('scroll', () => {
            if (!compactViewport.matches) return;
            const scrollLeft = htProducts.scrollLeft;
            const firstProduct = htProducts.querySelector('.ht-product');
            if (!firstProduct) return;
            const itemWidth = firstProduct.offsetWidth + 16;
            const index = Math.round(scrollLeft / itemWidth);
            const clampedIndex = Math.min(1, Math.max(0, index));
            const targetY = `-${(clampedIndex * 100) / 2}%`;

            if (reduceMotion.matches) {
                gsap.set(htPaginationTrack, { y: targetY });
            } else {
                gsap.to(htPaginationTrack, {
                    y: targetY,
                    duration: 0.45,
                    ease: "cubic-bezier(0.76, 0, 0.24, 1)",
                    overwrite: true,
                    force3D: true
                });
            }
        }, { passive: true });
    }

    const threeColGrid = document.getElementById('threeColGrid');
    const threeColDots = document.querySelectorAll('#threeColDots .dot');
    if (threeColGrid && threeColDots.length > 0) {
        threeColGrid.addEventListener('scroll', () => {
            if (!compactViewport.matches) return;
            const scrollLeft = threeColGrid.scrollLeft;
            const itemWidth = threeColGrid.querySelector('.three-col-item').offsetWidth + 12;
            const index = Math.round(scrollLeft / itemWidth);
            const clampedIndex = Math.min(threeColDots.length - 1, Math.max(0, index));
            threeColDots.forEach((dot, idx) => {
                if (idx === clampedIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }, { passive: true });
    }

    const newArrivalsGrid = document.getElementById('newArrivalsGrid');
    const newArrivalsDots = document.querySelectorAll('#newArrivalsDots .dot');
    if (newArrivalsGrid && newArrivalsDots.length > 0) {
        newArrivalsGrid.addEventListener('scroll', () => {
            if (!compactViewport.matches) return;
            const scrollLeft = newArrivalsGrid.scrollLeft;
            const itemWidth = (newArrivalsGrid.querySelector('.arrival-item').offsetWidth * 2) + 12;
            const index = Math.round(scrollLeft / itemWidth);
            const clampedIndex = Math.min(newArrivalsDots.length - 1, Math.max(0, index));
            newArrivalsDots.forEach((dot, idx) => {
                if (idx === clampedIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }, { passive: true });
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
  let   TOTAL_PAGES      = 2;     
  const TITLE_SHIFT      = 120; 
  const reduceMotion     = window.matchMedia("(prefers-reduced-motion: reduce)");

  let page = 0;
  let maxX = 0;                 
  let snaps = [0, 0];           
  let compact = false;          
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

  function updateUI(animate = true) {
    if (!counter) return;
    const paginationTrack = document.getElementById("pagination-track");
    const paginationSuffix = document.getElementById("pagination-suffix");
    
    if (paginationSuffix) {
      paginationSuffix.textContent = "/" + TOTAL_PAGES;
    }
    
    if (paginationTrack) {
      paginationTrack.style.setProperty("--total-pages", TOTAL_PAGES);
      
      if (paginationTrack.children.length !== TOTAL_PAGES) {
        let html = "";
        for (let i = 1; i <= TOTAL_PAGES; i++) {
          html += `<span class="pagination-digit">${i}</span>`;
        }
        paginationTrack.innerHTML = html;
      }
      
      const targetY = `-${(page * 100) / TOTAL_PAGES}%`;
      
      if (animate === false || reduceMotion.matches) {
        gsap.set(paginationTrack, { y: targetY });
      } else {
        gsap.to(paginationTrack, {
          y: targetY,
          duration: 0.55,
          ease: "cubic-bezier(0.76, 0, 0.24, 1)",
          overwrite: true,
          force3D: true
        });
      }
    }

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
          if (compact && snaps.length > 1) {
            const currentX = -gsap.getProperty(track, "x");
            let closestPage = 0, minDist = Infinity;
            snaps.forEach((s, idx) => {
              const dist = Math.abs(s - currentX);
              if (dist < minDist) { minDist = dist; closestPage = idx; }
            });
            if (closestPage !== page) {
              page = closestPage;
              updateUI(false);
            }
          }
        },
        onComplete: () => {
          draggable && draggable.update();
          setProgress(target);
        }
      });
    }
    updateUI(animate !== false);
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
      
      if (compact && snaps.length > 1) {
        const currentX = -this.x;
        let closestPage = 0, minDist = Infinity;
        snaps.forEach((s, idx) => {
          const dist = Math.abs(s - currentX);
          if (dist < minDist) { minDist = dist; closestPage = idx; }
        });
        if (closestPage !== page) {
          page = closestPage;
          updateUI(false);
        }
      }
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
    e.key === "ArrowRight" ? (e.preventDefault(), goTo(page + 1)) : e.key === "ArrowLeft" && (e.preventDefault(), goTo(page - 1));
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

// LETTER REVEAL (Dior-style) for .letter-reveal headings
document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll('.letter-reveal');
    if (!targets.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

    let index = 0;
    targets.forEach((el) => {
        if (el.classList.contains('lr-ready')) return;
        const text = el.textContent.trim().replace(/\s+/g, ' ');
        if (!text) return;

        el.setAttribute('aria-label', text);
        el.textContent = '';
        index = 0;

        text.split(' ').forEach((word, w, words) => {
            const wordEl = document.createElement('span');
            wordEl.className = 'lr-word';
            wordEl.setAttribute('aria-hidden', 'true');
            Array.from(word).forEach((ch) => {
                const mask = document.createElement('span');
                mask.className = 'lr-char';
                const glyph = document.createElement('span');
                glyph.className = 'lr-glyph';
                glyph.style.setProperty('--i', index++);
                glyph.textContent = ch;
                mask.appendChild(glyph);
                wordEl.appendChild(mask);
            });
            el.appendChild(wordEl);
            if (w < words.length - 1) el.appendChild(document.createTextNode(' '));
        });
        el.classList.add('lr-ready');
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -5% 0px' });

    document.querySelectorAll('.letter-reveal.lr-ready').forEach((el) => io.observe(el));
});