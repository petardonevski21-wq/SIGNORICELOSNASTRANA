document.addEventListener("DOMContentLoaded", () => {
    const panes = document.querySelectorAll('.split-pane');

    panes.forEach(pane => {
        const bgImage = pane.querySelector('.bg-image');

        pane.addEventListener('mousemove', (e) => {
            // Земање на димензиите на контејнерот
            const rect = pane.getBoundingClientRect();
            
            // Пресметување на позицијата на маусот релативно на центарот на контејнерот
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Движење на сликата (подели со поголем број за посуптилен ефект)
            const moveX = (x / rect.width) * 20; 
            const moveY = (y / rect.height) * 20;

            // Примена на scale (од hover) и translate (од маусот)
            bgImage.style.transform = `scale(1.05) translate(${moveX}px, ${moveY}px)`;
        });

        pane.addEventListener('mouseleave', () => {
            // Ресетирање на позицијата кога маусот ќе излезе
            bgImage.style.transform = `scale(1) translate(0px, 0px)`;
        });
    });
});

/* Hero hover video: flash -> video plays; videos freeze on their last frame and resume */
document.addEventListener("DOMContentLoaded", () => {
    if (!window.matchMedia('(hover: hover)').matches) return;

    const heroPanes = document.querySelectorAll('.split-pane');
    let activePane = null;

    // Preload after the page has loaded so the first hover is seamless
    window.addEventListener('load', () => {
        heroPanes.forEach(pane => {
            const video = pane.querySelector('.hero-video');
            if (video) { video.preload = 'auto'; video.load(); }
        });
    });

    const flash = (pane) => {
        pane.classList.remove('is-flashing');
        void pane.offsetWidth; // restart the animation without stacking
        pane.classList.add('is-flashing');
    };

    heroPanes.forEach(pane => {
        const video = pane.querySelector('.hero-video');
        if (!video) return;

        pane.addEventListener('animationend', (e) => {
            if (e.animationName === 'heroFlash') pane.classList.remove('is-flashing');
        });

        pane.addEventListener('mouseenter', () => {
            if (activePane === pane) return; // already active: no restart, no new flash
            activePane = pane;

            // Only one video plays at a time; the other one freezes on its current frame
            heroPanes.forEach(other => {
                const otherVideo = other.querySelector('.hero-video');
                if (other !== pane && otherVideo) otherVideo.pause();
            });

            const playing = video.play(); // resumes from the stored currentTime
            if (!playing || !playing.then) return;
            playing.then(() => {
                if (activePane !== pane) { video.pause(); return; } // user already moved on
                flash(pane);
                // Reveal the video at the peak of the flash; it stays visible afterwards
                setTimeout(() => {
                    if (activePane === pane) video.classList.add('is-activated');
                }, 60);
            }).catch(() => {
                if (activePane === pane) activePane = null;
            });
        });
    });
});