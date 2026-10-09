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

        // Browsers only allow play() on hover for muted videos
        video.muted = true;
        video.playsInline = true;

        // Pause / play button (bottom left), shown once this video has been activated
        const PAUSE_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 6.5v11M15 6.5v11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
        const PLAY_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9.5 6.5v11l8-5.5z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'hero-video-toggle';
        toggleBtn.innerHTML = PAUSE_ICON;
        toggleBtn.setAttribute('aria-label', 'Pause video');
        pane.appendChild(toggleBtn);

        const syncToggle = () => {
            toggleBtn.innerHTML = video.paused ? PLAY_ICON : PAUSE_ICON;
            toggleBtn.setAttribute('aria-label', video.paused ? 'Play video' : 'Pause video');
        };
        video.addEventListener('play', syncToggle);
        video.addEventListener('pause', syncToggle);

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // the pane sits next to links: never navigate from this button
            if (video.paused) {
                activePane = pane; // keep a single playing video
                heroPanes.forEach(other => {
                    const otherVideo = other.querySelector('.hero-video');
                    if (other !== pane && otherVideo) otherVideo.pause();
                });
                const resumed = video.play();
                if (resumed && resumed.catch) resumed.catch(() => {});
            } else {
                video.pause();
            }
        });

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
                // Flash only the first time this video is activated
                if (pane._heroFlashed) return;
                pane._heroFlashed = true;
                flash(pane);
                // Reveal the video at the peak of the flash; it stays visible afterwards
                setTimeout(() => {
                    video.classList.add('is-activated');
                    syncToggle();
                    toggleBtn.classList.add('is-visible');
                }, 110);
            }).catch(() => {
                if (activePane === pane) activePane = null;
            });
        });
    });
});


/* Luxury page transition: bottom-to-top wipe for the BESPOKE TAILORING / ONLINE SHOP links */
(function () {
    const COLOR = '#F5F5F3';
    const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';
    const DURATION = 900;
    const OVERLAY_STYLE = 'position:fixed;top:0;right:0;bottom:0;left:0;background:' + COLOR +
        ';z-index:2147483647;will-change:transform;';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let busy = false;

    // Runs inside the destination document after it replaces this one:
    // waits until the page is ready, then slides the overlay out through the top.
    function arrival(cfg) {
        var shown = false;
        function finish(o) {
            if (o && o.parentNode) o.parentNode.removeChild(o);
            var b = document.getElementById('pt-boot');
            if (b && b.parentNode) b.parentNode.removeChild(b);
        }
        function reveal() {
            if (shown) return;
            shown = true;
            var o = document.getElementById('pt-overlay');
            if (!o) { finish(null); return; }
            // No exit animation: once the page is ready the cover is simply removed
            requestAnimationFrame(function () {
                requestAnimationFrame(function () { finish(o); });
            });
        }
        function ready() {
            var f = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
            f.then(reveal, reveal);
        }
        if (document.readyState === 'complete') ready();
        else window.addEventListener('load', ready);
        setTimeout(reveal, 10000); // safety: never leave the visitor behind the overlay
        window.addEventListener('popstate', function () { location.reload(); });
    }

    // Puts the (already covering) overlay and the reveal script into the fetched page
    function buildHtml(text) {
        const headOpen = /<head(\s[^>]*)?>/i;
        const bodyOpen = /<body(\s[^>]*)?>/i;
        if (!headOpen.test(text) || !bodyOpen.test(text)) return null;
        const boot = '<style id="pt-boot">html{background:' + COLOR + '}</style><script>(' +
            arrival.toString() + ')(' + JSON.stringify({ duration: DURATION, ease: EASE }) + ')<\/script>';
        const overlay = '<div id="pt-overlay" aria-hidden="true" style="' + OVERLAY_STYLE +
            'transform:translate3d(0,0,0);"></div>';
        return text
            .replace(headOpen, (m) => m + boot)
            .replace(bodyOpen, (m) => m + overlay);
    }

    async function navigate(url) {
        busy = true;
        const overlay = document.createElement('div');
        overlay.id = 'pt-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.style.cssText = OVERLAY_STYLE + 'transform:translate3d(0,100%,0);';
        document.body.appendChild(overlay);

        // Start loading the destination right away, while the overlay rises
        const page = fetch(url, { credentials: 'same-origin' }).then((r) => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.text();
        });
        page.catch(() => {});

        try {
            await overlay.animate(
                [{ transform: 'translate3d(0,100%,0)' }, { transform: 'translate3d(0,0,0)' }],
                { duration: DURATION, easing: EASE, fill: 'forwards' }
            ).finished;

            const html = buildHtml(await page); // stays covered until the page has arrived
            if (!html) throw new Error('Unsupported page');

            history.pushState(null, '', url);
            document.open();
            document.write(html);
            document.close();
        } catch (err) {
            // Safe fallback: normal navigation, and never trap the visitor behind the overlay
            window.location.href = url;
            setTimeout(() => { overlay.remove(); busy = false; }, 8000);
        }
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest && e.target.closest('.split-pane a[href]');
        if (!link || e.defaultPrevented) return;
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (link.target && link.target !== '_self') return;
        if (reduceMotion.matches || !document.body.animate) return;

        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin) return;

        e.preventDefault();
        if (busy) return;
        navigate(url.href);
    });

    // Back/forward cache: never restore a page with a leftover overlay
    window.addEventListener('pageshow', (e) => {
        if (!e.persisted) return;
        const o = document.getElementById('pt-overlay');
        if (o) o.remove();
        busy = false;
    });
})();