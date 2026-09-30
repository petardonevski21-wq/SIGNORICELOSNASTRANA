// Postavljanje Intersection Observer API-ja za luksuzne, "smooth" animacije pri skrolanju
document.addEventListener("DOMContentLoaded", () => {
    
    // Animiraj hero sadržaj čim se stranica učita
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if(heroContent) heroContent.classList.add('is-visible');
    }, 300);

    // Animacije elemenata pri skrolanju ka dolje
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Pokreće se kad se prikaže 15% elementa
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Dodajemo klasu za animaciju
                entry.target.classList.add('is-visible');
                // Prekidamo praćenje kako bi se animacija desila samo jednom
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Prati sve elemente sa klasom .fade-up
    const fadeElements = document.querySelectorAll('.fade-up');
    fadeElements.forEach(el => observer.observe(el));
});