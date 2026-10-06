document.addEventListener("DOMContentLoaded", () => {
    const siteMenu = document.getElementById("site-menu");

    // Osnovna funktsiya za initsializirane na menyuto i animatziite
    const initNavbar = () => {
        const header = document.querySelector("header");
        const menuButton = document.getElementById("menuButton");
        const sideDrawer = document.getElementById("sideDrawer");
        const drawerOverlay = document.getElementById("drawerOverlay");
        const drawerClose = document.getElementById("drawerClose");

        // ---------------------------------------------
        // Nastrojki za skrolirane
        // ---------------------------------------------
        const ALWAYS_SHOW_BELOW = 80; // px ot gora: menyuto vinagi e vidimo
        const DELTA_THRESHOLD = 8;    // px: ignorira malki dvizheniya

        let isDrawerOpen = false;
        let lastScrollY = 0;
        let ticking = false;

        const getHeroThreshold = () => {
            const heroSection = document.querySelector(".hero, section, .hero-section");
            return heroSection ? heroSection.offsetHeight : window.innerHeight;
        };

        const getScrollY = () => Math.max(
            window.pageYOffset || 0,
            document.documentElement.scrollTop || 0,
            document.body.scrollTop || 0,
            0
        );

        const showHeader = () => header && header.classList.remove("nav-hidden");
        const hideHeader = () => header && header.classList.add("nav-hidden");

        // ---------------------------------------------
        // Side drawer (Otvariane / Zatvariane)
        // ---------------------------------------------
        const openDrawer = () => {
            if (isDrawerOpen) return;
            isDrawerOpen = true;
            if (sideDrawer) sideDrawer.classList.add("open");
            if (drawerOverlay) drawerOverlay.classList.add("active");
            if (menuButton) menuButton.setAttribute("aria-expanded", "true");
            document.body.style.overflow = "hidden"; // Spirame skrola na stranitsata
            if (header) showHeader();
        };

        const closeDrawer = () => {
            if (!isDrawerOpen) return;
            isDrawerOpen = false;
            if (sideDrawer) sideDrawer.classList.remove("open");
            if (drawerOverlay) drawerOverlay.classList.remove("active");
            if (menuButton) menuButton.setAttribute("aria-expanded", "false");
            document.body.style.overflow = ""; // Vrashtame skrola
            lastScrollY = getScrollY();
        };

        if (menuButton && sideDrawer && drawerOverlay) {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.addEventListener("click", openDrawer);

            menuButton.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openDrawer();
                }
            });

            drawerOverlay.addEventListener("click", closeDrawer);
            if (drawerClose) drawerClose.addEventListener("click", closeDrawer);

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") closeDrawer();
            });
        }

        // ---------------------------------------------
        // Sliding Toggle (Bespoke vs Online Shop)
        // ---------------------------------------------
        const btnBespoke = document.getElementById("btn-bespoke");
        const btnOnline = document.getElementById("btn-online");
        const panelBespoke = document.getElementById("panel-bespoke");
        const panelOnline = document.getElementById("panel-online");
        const toggleContainer = document.getElementById("drawer-toggle-container");

        if (btnBespoke && btnOnline && panelBespoke && panelOnline && toggleContainer) {
            btnBespoke.addEventListener("click", (e) => {
                e.preventDefault();
                panelOnline.classList.remove("active");
                panelBespoke.classList.add("active");

                toggleContainer.classList.remove("right-active");
                btnBespoke.classList.add("active");
                btnOnline.classList.remove("active");
            });

            btnOnline.addEventListener("click", (e) => {
                e.preventDefault();
                panelBespoke.classList.remove("active");
                panelOnline.classList.add("active");

                toggleContainer.classList.add("right-active");
                btnOnline.classList.add("active");
                btnBespoke.classList.remove("active");
            });
        }

        // ---------------------------------------------
        // Skrolirane na hedera (Hide on scroll down)
        // ---------------------------------------------
        if (header) {
            lastScrollY = getScrollY();

            const updateHeader = () => {
                ticking = false;
                const currentScrollY = getScrollY();
                const heroThreshold = getHeroThreshold();

                header.classList.toggle("nav-scrolled", currentScrollY >= heroThreshold);

                if (isDrawerOpen || currentScrollY <= ALWAYS_SHOW_BELOW) {
                    showHeader();
                    lastScrollY = currentScrollY;
                    return;
                }

                const delta = currentScrollY - lastScrollY;
                if (Math.abs(delta) < DELTA_THRESHOLD) return;

                if (delta > 0) {
                    hideHeader();
                } else {
                    showHeader();
                }

                lastScrollY = currentScrollY;
            };

            const onScroll = (event) => {
                const target = event.target;
                if (
                    target !== document &&
                    target !== document.documentElement &&
                    target !== document.body
                ) {
                    return;
                }

                if (!ticking) {
                    ticking = true;
                    window.requestAnimationFrame(updateHeader);
                }
            };

            document.addEventListener("scroll", onScroll, { passive: true, capture: true });
            updateHeader();
        }
    };

    // Ako na stranitsata ima <div id="site-menu"></div>, go zarezhdame chrez fetch
    if (siteMenu) {
        fetch("../navbar/navbar.html")
            .then(response => {
                if (!response.ok) {
                    // Fallback ako pъtyat e otnositelno razlichen
                    return fetch("navbar.html");
                }
                return response;
            })
            .then(response => response.text())
            .then(data => {
                siteMenu.innerHTML = data;
                initNavbar();
            })
            .catch(error => {
                console.error("Greshka pri zarezhdane na menyuto:", error);
            });
    } else {
        // Ako HTML koda e vlozhen direktno v stranitsata
        initNavbar();
    }
});