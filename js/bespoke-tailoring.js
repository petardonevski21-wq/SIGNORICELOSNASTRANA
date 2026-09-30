document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // Koga mausot kje pomine preku kartickata, taa stanuva aktivna
        card.addEventListener('mouseenter', () => {
            // Prvo ja vadime 'active' klasata od site drugi karticki
            cards.forEach(c => c.classList.remove('active'));
            // Ja dodavame 'active' klasata na kartickata nad koja e mausot
            card.classList.add('active');
        });
    });

    // Otstranet e 'mouseleave' event-ot za da ostane otvorena poslednata karticka na koja si bil

    // --- DODADEN KOD: Profesionalna scroll animatsiya za novite sektsii ---
    const fadeElements = document.querySelectorAll('.intro-content, .detail-row');
    
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