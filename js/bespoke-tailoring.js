document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Kada miš pređe preko kartice, ona postaje aktivna
        card.addEventListener('mouseenter', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // --- Scroll animacija za sekcije ---
    const fadeElements = document.querySelectorAll('.intro-content, .detail-row, .step-card');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});

// --- Latest Creations Slider (Auto-slide svakih 5s) ---
const track = document.getElementById('latest-track');
const prevBtn = document.getElementById('latest-prev');
const nextBtn = document.getElementById('latest-next');
const dotsContainer = document.getElementById('latest-dots');

if (track) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let autoSlideTimer;

    const getVisibleSlides = () => {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3;
    };

    const updateSlider = () => {
        const visibleSlides = getVisibleSlides();
        const maxIndex = slides.length - visibleSlides;

        if (currentIndex > maxIndex) currentIndex = 0;
        if (currentIndex < 0) currentIndex = maxIndex;

        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = 20; 
        const moveAmount = currentIndex * (slideWidth + gap);

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

    nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
    });

    // Kreiranje točkica za navigaciju
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

    window.addEventListener('resize', updateSlider);
    startAutoSlide();
}
// Predotvratyava prezarazhdane na stranitsata pri izprashtane na formata
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}