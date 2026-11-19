document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('jrn-hero');

    // 1. Плавна иницијална анимација на Hero сликата
    if (heroSection) {
        requestAnimationFrame(() => {
            heroSection.classList.add('is-loaded');
        });
    }

    // 2. Вчитување на менито и футерот со fetch + синхронизација со header.nav-hero / nav-scrolled
    async function loadComponent(placeholderId, filePath, callback) {
        const container = document.getElementById(placeholderId);
        if (!container) return;

        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            const html = await response.text();
            container.innerHTML = html;

            // Изврши ги евентуалните <script> тагови внатре во вчитаниот HTML фрагмент
            const scripts = container.querySelectorAll('script');
            scripts.forEach((oldScript) => {
                const newScript = document.createElement('script');
                Array.from(oldScript.attributes).forEach((attr) => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = oldScript.textContent;
                oldScript.replaceWith(newScript);
            });

            if (typeof callback === 'function') callback();
        } catch (error) {
            console.error(error);
        }
    }

    // Поврзување на scroll состојбите на постоечкото мени со 100vh Hero секцијата
    function initHeroHeaderSync() {
        const header = document.querySelector('#header-placeholder header') || document.querySelector('header');
        if (!header || !heroSection) return;

        let lastScrollY = window.scrollY;

        function updateHeaderState() {
            const scrollY = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            const triggerPoint = heroHeight - header.offsetHeight;

            if (scrollY < triggerPoint) {
                header.classList.add('nav-hero');
                header.classList.remove('nav-scrolled', 'nav-hidden');
            } else {
                header.classList.remove('nav-hero');
                header.classList.add('nav-scrolled');

                if (scrollY > lastScrollY && scrollY > heroHeight + 80) {
                    header.classList.add('nav-hidden');
                } else {
                    header.classList.remove('nav-hidden');
                }
            }

            lastScrollY = scrollY;
        }

        header.classList.add('nav-instant');
        updateHeaderState();
        requestAnimationFrame(() => {
            header.classList.remove('nav-instant');
        });

        window.addEventListener('scroll', updateHeaderState, { passive: true });
        window.addEventListener('resize', updateHeaderState, { passive: true });
    }

    // Вчитај го менито (промени ја патеката ако е во друга папка)
    loadComponent('header-placeholder', 'menu.html', () => {
        if (typeof window.initMenu === 'function') {
            window.initMenu();
        }
        initHeroHeaderSync();
    });

    // Вчитај го футерот (промени ја патеката ако е во друга папка)
    loadComponent('footer-placeholder', 'footer.html');
});