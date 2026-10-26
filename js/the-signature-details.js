document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.signature-section');
    const bg = document.querySelector('.hero-background');

    // Suptilni parallax efekt mišem za luksuzan osjećaj
    if (section && bg) {
        section.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const xPercent = (clientX / window.innerWidth - 0.5) * 12;
            const yPercent = (clientY / window.innerHeight - 0.5) * 12;

            bg.style.transform = `scale(1.05) translate(${xPercent}px, ${yPercent}px)`;
        });

        section.addEventListener('mouseleave', () => {
            bg.style.transform = 'scale(1.03) translate(0px, 0px)';
        });
    }
});