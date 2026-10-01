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