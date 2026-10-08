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
        const HOVER_PROXIMITY = 40;   // px: nevidima zona nad/pod hero menyuto
        const FADE_OUT_MS = 400;      // = prodalzhitelnostta na nav-hidden fade-a v CSS

        let isDrawerOpen = false;
        let lastScrollY = 0;
        let ticking = false;

        // Systoyanie na hedera: "hero" | "scrolled" | "leaving"
        let mode = "hero";
        let leaveTimer = null;
        let heroNavHeight = 0;
        let mouseY = null;

        // Hover vo hero: dali e prikazano belo meni (heroShown)
        let heroShown = false;

        const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

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

            // Izpylnyava promyana na klasove bez nikakva animatsiya (za edin kadar)
            const withoutTransitions = (fn) => {
                header.classList.add("nav-instant");
                fn();
                void header.offsetHeight; // forsira reflow, za da se "zapechata" novoto systoyanie
                header.classList.remove("nav-instant");
            };

            // Hero: menito se dvizhi nagore tochno kolku skrolot -> ostanuva zalepeno za vrvot na stranata
            const applyHeroShift = () => {
                const shift = Math.min(getScrollY(), heroNavHeight + 60);
                header.style.setProperty("--hero-shift", `${-shift}px`);
            };

            // Izmervane na visochinata na hero menyuto (bez nav-scrolled)
            const measureHeroNavHeight = () => {
                const hadScrolled = header.classList.contains("nav-scrolled");
                if (hadScrolled) header.classList.remove("nav-scrolled");
                heroNavHeight = header.offsetHeight;
                if (hadScrolled) header.classList.add("nav-scrolled");
            };

            // Stabilna nevidima zona vyrhu originalnata visochina na hero menyuto
            const computeHeroHover = () => {
                if (mouseY === null || !canHover.matches) return false;
                const headerTop = header.getBoundingClientRect().top;
                return mouseY <= headerTop + heroNavHeight + HOVER_PROXIMITY;
            };

            // Direkten toggle na noviya klas `nav-hovered` za cvetove bez otskachane
            const setHeroHover = (value) => {
                if (mode !== "hero") return;
                if (value === heroShown) return;
                heroShown = value;
                header.classList.toggle("nav-hovered", heroShown);
            };

            // Hero -> byalo menyu (sled kato minem hero sekciyata nadolu)
            const enterScrolledMode = (currentScrollY) => {
                clearTimeout(leaveTimer);
                leaveTimer = null;
                const wasHero = mode === "hero";
                mode = "scrolled";
                heroShown = false;

                withoutTransitions(() => {
                    header.classList.remove("nav-hero", "nav-hovered");
                    header.classList.add("nav-scrolled");
                    // Idvame ot skrolirane nadolu -> skrito, kakto i dosega
                    if (wasHero && document.readyState === "complete") {
                        header.classList.add("nav-hidden");
                    }
                });

                lastScrollY = currentScrollY;
            };

            // Byalo menyu -> hero: purvo fade-out s sashtiya nav-hidden efekt
            const startLeavingHero = () => {
                mode = "leaving";
                heroShown = false;
                header.classList.remove("nav-hovered");
                hideHeader();
                clearTimeout(leaveTimer);
                leaveTimer = setTimeout(finishLeavingHero, FADE_OUT_MS);
            };

            const finishLeavingHero = () => {
                leaveTimer = null;
                if (mode !== "leaving") return;
                mode = "hero";

                withoutTransitions(() => {
                    header.classList.add("nav-hero");
                    header.classList.remove("nav-scrolled", "nav-hovered");
                    measureHeroNavHeight();
                    applyHeroShift();
                    heroShown = computeHeroHover();
                    header.classList.toggle("nav-hovered", heroShown);
                });

                showHeader(); // fade-in na hero menyuto s sashtata animatsiya
                lastScrollY = getScrollY();
            };

            // Nachalno systoyanie (vklyuchitelno pri refresh na skrolnata poziciya)
            if (lastScrollY >= getHeroThreshold()) {
                mode = "scrolled";
                header.classList.add("nav-scrolled");
            } else {
                mode = "hero";
                header.classList.add("nav-hero");
                measureHeroNavHeight();
                applyHeroShift();
            }

            const updateHeader = () => {
                ticking = false;
                const currentScrollY = getScrollY();
                const heroThreshold = getHeroThreshold();

                if (currentScrollY >= heroThreshold) {
                    if (mode !== "scrolled") enterScrolledMode(currentScrollY);
                } else if (mode === "scrolled") {
                    startLeavingHero();
                }

                if (mode === "hero") {
                    applyHeroShift();
                    setHeroHover(computeHeroHover());
                    lastScrollY = currentScrollY;
                    return;
                }

                if (mode === "leaving") {
                    lastScrollY = currentScrollY;
                    return;
                }

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

                // Vo hero sekciyata pomestuvame menito vednash (bez cekanje na rAF), za da nema zakasnuvanje
                if (mode === "hero") applyHeroShift();

                if (!ticking) {
                    ticking = true;
                    window.requestAnimationFrame(updateHeader);
                }
            };

            document.addEventListener("scroll", onScroll, { passive: true, capture: true });

            // Hover / proximity - samo v hero sekciyata
            document.addEventListener("mousemove", (event) => {
                mouseY = event.clientY;
                if (mode === "hero") setHeroHover(computeHeroHover());
            }, { passive: true });

            document.documentElement.addEventListener("mouseleave", () => {
                mouseY = null;
                if (mode === "hero") setHeroHover(false);
            });

            window.addEventListener("resize", () => {
                if (mode !== "hero") return;
                withoutTransitions(() => {
                    measureHeroNavHeight();
                    applyHeroShift();
                });
            });

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