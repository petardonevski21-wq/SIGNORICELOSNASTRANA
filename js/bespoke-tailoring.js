document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1024) {
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            }
        });
    });
});

// --- Latest Creations Slider ---
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('latest-track');
    const prevBtn = document.getElementById('latest-prev');
    const nextBtn = document.getElementById('latest-next');
    const dotsContainer = document.getElementById('latest-dots');

    if (!track) return;

    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoSlideTimer;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const getVisibleSlides = () => {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    };

    const updateSlider = (animate = true) => {
        const visibleSlides = getVisibleSlides();
        const maxIndex = slides.length - visibleSlides;

        if (currentIndex > maxIndex) currentIndex = 0;
        if (currentIndex < 0) currentIndex = maxIndex;

        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = window.innerWidth <= 1024 ? 12 : 20;
        const moveAmount = currentIndex * (slideWidth + gap);

        track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        track.style.transform = `translateX(-${moveAmount}px)`;

        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    const nextSlide = () => {
        const visibleSlides = getVisibleSlides();
        const maxIndex = slides.length - visibleSlides;
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    };

    const prevSlide = () => {
        const visibleSlides = getVisibleSlides();
        const maxIndex = slides.length - visibleSlides;
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateSlider();
    };

    const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideTimer = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
    };

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide();
        });
    }

    track.addEventListener('touchstart', (e) => {
        stopAutoSlide();
        isDragging = true;
        startX = e.touches[0].clientX;
        currentX = startX;
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        const diffX = startX - currentX;
        if (Math.abs(diffX) > 40) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoSlide();
    }, { passive: true });

    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
            startAutoSlide();
        });
        dotsContainer.appendChild(dot);
    });

    window.addEventListener('resize', () => updateSlider(false));
    startAutoSlide();
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}

(() => {
    const mobileQuery = window.matchMedia('(max-width: 1024px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

    const stack = (() => {
        const cards = ['card-gallery', 'card-fabrics', 'card-bespoke']
            .map((id) => document.getElementById(id))
            .filter(Boolean);
        let running = false;
        let ticking = false;
        let viewportH = 0;
        let stickyTops = [];
        let last = [];

        const measure = () => {
            viewportH = window.innerHeight;
            stickyTops = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0);
        };

        const update = () => {
            ticking = false;
            const tops = cards.map((c) => c.getBoundingClientRect().top);
            for (let i = 0; i < cards.length - 1; i++) {
                const span = viewportH - stickyTops[i + 1];
                const p = span > 0 ? clamp((viewportH - tops[i + 1]) / span, 0, 1) : 0;
                const v = p.toFixed(3);
                if (last[i] !== v) {
                    last[i] = v;
                    cards[i].style.setProperty('--p', v);
                }
            }
        };

        const requestUpdate = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        const onResize = () => {
            measure();
            requestUpdate();
        };

        return {
            start() {
                if (running || cards.length < 2 || reduceMotion.matches) return;
                running = true;
                measure();
                update();
                window.addEventListener('scroll', requestUpdate, { passive: true });
                window.addEventListener('resize', onResize);
                window.addEventListener('orientationchange', onResize);
            },
            stop() {
                if (!running) return;
                running = false;
                window.removeEventListener('scroll', requestUpdate);
                window.removeEventListener('resize', onResize);
                window.removeEventListener('orientationchange', onResize);
                last = [];
                cards.forEach((c) => c.style.removeProperty('--p'));
            }
        };
    })();

    const hero = (() => {
        const videos = document.querySelectorAll('video');
        let io = null;

        return {
            start() {
                if (reduceMotion.matches) return;
                videos.forEach(video => {
                    video.muted = true;
                    video.defaultMuted = true;
                    video.loop = true;
                    video.playsInline = true;
                    video.setAttribute('playsinline', '');
                    video.setAttribute('webkit-playsinline', '');
                    const play = () => {
                        const p = video.play();
                        if (p && p.catch) p.catch(() => {});
                    };
                    play();
                });

                if ('IntersectionObserver' in window) {
                    io = new IntersectionObserver((entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                const p = entry.target.play();
                                if (p && p.catch) p.catch(() => {});
                            } else {
                                entry.target.pause();
                            }
                        });
                    }, { threshold: 0.1 });
                    videos.forEach(v => io.observe(v));
                }
            },
            stop() {
                if (io) { io.disconnect(); io = null; }
                videos.forEach(v => v.pause());
            }
        };
    })();

    const apply = () => {
        if (mobileQuery.matches) {
            stack.start();
            hero.start();
        } else {
            stack.stop();
            hero.stop();
        }
    };

    apply();
    if (mobileQuery.addEventListener) {
        mobileQuery.addEventListener('change', apply);
    } else if (mobileQuery.addListener) {
        mobileQuery.addListener(apply);
    }
})();