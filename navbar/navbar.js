document.addEventListener("DOMContentLoaded", () => {
    const siteMenu = document.getElementById("site-menu");

    const initNavbar = () => {
        const header = document.querySelector("header");
        const menuButton = document.getElementById("menuButton");
        const sideDrawer = document.getElementById("sideDrawer");
        const drawerOverlay = document.getElementById("drawerOverlay");
        const drawerClose = document.getElementById("drawerClose");

        const ALWAYS_SHOW_BELOW = 80;
        const DELTA_THRESHOLD = 8;
        const HOVER_PROXIMITY = 40;
        const FADE_OUT_MS = 400;

        let isDrawerOpen = false;
        let lastScrollY = 0;
        let ticking = false;

        let mode = "hero";
        let leaveTimer = null;
        let heroNavHeight = 0;
        let mouseY = null;
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

        const openDrawer = () => {
            if (isDrawerOpen) return;
            isDrawerOpen = true;
            if (sideDrawer) sideDrawer.classList.add("open");
            if (drawerOverlay) drawerOverlay.classList.add("active");
            if (menuButton) menuButton.setAttribute("aria-expanded", "true");
            document.body.style.overflow = "hidden";
            if (header) showHeader();
        };

        const closeDrawer = () => {
            if (!isDrawerOpen) return;
            isDrawerOpen = false;
            if (sideDrawer) sideDrawer.classList.remove("open");
            if (drawerOverlay) drawerOverlay.classList.remove("active");
            if (menuButton) menuButton.setAttribute("aria-expanded", "false");
            document.body.style.overflow = "";
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

        // Fullscreen White Search Overlay Handling
        const searchButton = document.getElementById("searchButton");
        const searchOverlay = document.getElementById("searchOverlay");
        const searchClose = document.getElementById("searchClose");
        const searchInputField = document.getElementById("searchInputField");
        const searchClear = document.getElementById("searchClear");

        const openSearch = () => {
            if (!searchOverlay) return;
            searchOverlay.classList.add("active");
            searchOverlay.setAttribute("aria-hidden", "false");
            document.body.style.overflow = "hidden";
            if (searchInputField) {
                setTimeout(() => searchInputField.focus(), 300);
            }
        };

        const closeSearch = () => {
            if (!searchOverlay) return;
            searchOverlay.classList.remove("active");
            searchOverlay.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
            if (searchInputField) searchInputField.value = "";
            lastScrollY = getScrollY();
        };

        if (searchButton && searchOverlay) {
            searchButton.addEventListener("click", openSearch);

            if (searchClose) searchClose.addEventListener("click", closeSearch);
            
            if (searchClear && searchInputField) {
                searchClear.addEventListener("click", () => {
                    searchInputField.value = "";
                    searchInputField.focus();
                });
            }

            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") closeSearch();
            });
        }

        // Sliding Toggle (Bespoke vs Online Shop)
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

        // ---------------------------------------------------------
        // DESKTOP ONLINE SHOP FLYOUT (additive, isolated state)
        // ---------------------------------------------------------
        const shopFlyout = document.getElementById("shopFlyout");
        const flyoutDesktop = window.matchMedia("(min-width: 1024px) and (min-height: 501px)");
        const FLYOUT_OPEN_DELAY_MS = 450; // lets the drawer glide in first

        if (shopFlyout && btnOnline && btnBespoke && sideDrawer) {
            let isFlyoutOpen = false;
            let openTimer = null;
            const flyoutVideo = shopFlyout.querySelector("video");

            const setFlyout = (open) => {
                clearTimeout(openTimer);
                openTimer = null;
                if (open === isFlyoutOpen) return;
                isFlyoutOpen = open;
                shopFlyout.classList.toggle("is-open", open);
                shopFlyout.setAttribute("aria-hidden", open ? "false" : "true");
                
                if (open) {
                    shopFlyout.removeAttribute("inert");
                    if (flyoutVideo) {
                        flyoutVideo.play().catch(() => {});
                    }
                } else {
                    shopFlyout.setAttribute("inert", "");
                    if (flyoutVideo) {
                        flyoutVideo.pause();
                    }
                }
                btnOnline.setAttribute("aria-expanded", open ? "true" : "false");
            };

            if (flyoutDesktop.matches) {
                btnOnline.setAttribute("aria-controls", "shopFlyout");
                btnOnline.setAttribute("aria-expanded", "false");
            }

            btnOnline.addEventListener("click", () => {
                if (!flyoutDesktop.matches) return;
                setFlyout(true);
            });

            btnBespoke.addEventListener("click", () => {
                setFlyout(false);
            });

            // Follow the drawer: open with it (Online Shop tab active), close with it
            let drawerWasOpen = sideDrawer.classList.contains("open");
            new MutationObserver(() => {
                const drawerOpen = sideDrawer.classList.contains("open");
                if (drawerOpen === drawerWasOpen) return;
                drawerWasOpen = drawerOpen;

                if (!drawerOpen) {
                    setFlyout(false);
                    return;
                }
                if (flyoutDesktop.matches && btnOnline.classList.contains("active")) {
                    clearTimeout(openTimer);
                    openTimer = setTimeout(() => setFlyout(true), FLYOUT_OPEN_DELAY_MS);
                }
            }).observe(sideDrawer, { attributes: true, attributeFilter: ["class"] });

            // Escape closes the flyout (the existing handler closes the drawer too)
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") setFlyout(false);
            });

            // Leaving the desktop range while open
            const onFlyoutRangeChange = () => { if (!flyoutDesktop.matches) setFlyout(false); };
            if (flyoutDesktop.addEventListener) {
                flyoutDesktop.addEventListener("change", onFlyoutRangeChange);
            } else if (flyoutDesktop.addListener) {
                flyoutDesktop.addListener(onFlyoutRangeChange);
            }
        }

        // Header Scroll behavior
        if (header) {
            lastScrollY = getScrollY();

            const withoutTransitions = (fn) => {
                header.classList.add("nav-instant");
                fn();
                void header.offsetHeight;
                header.classList.remove("nav-instant");
            };

            const applyHeroShift = () => {
                const shift = Math.min(getScrollY(), heroNavHeight + 60);
                header.style.setProperty("--hero-shift", `${-shift}px`);
            };

            const measureHeroNavHeight = () => {
                const hadScrolled = header.classList.contains("nav-scrolled");
                if (hadScrolled) header.classList.remove("nav-scrolled");
                heroNavHeight = header.offsetHeight;
                if (hadScrolled) header.classList.add("nav-scrolled");
            };

            const computeHeroHover = () => {
                if (mouseY === null || !canHover.matches) return false;
                const headerTop = header.getBoundingClientRect().top;
                return mouseY <= headerTop + heroNavHeight + HOVER_PROXIMITY;
            };

            const setHeroHover = (value) => {
                if (mode !== "hero") return;
                if (value === heroShown) return;
                heroShown = value;
                header.classList.toggle("nav-hovered", heroShown);
            };

            const enterScrolledMode = (currentScrollY) => {
                clearTimeout(leaveTimer);
                leaveTimer = null;
                const wasHero = mode === "hero";
                mode = "scrolled";
                heroShown = false;

                withoutTransitions(() => {
                    header.classList.remove("nav-hero", "nav-hovered");
                    header.classList.add("nav-scrolled");
                    if (wasHero && document.readyState === "complete") {
                        header.classList.add("nav-hidden");
                    }
                });

                lastScrollY = currentScrollY;
            };

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

                showHeader();
                lastScrollY = getScrollY();
            };

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

                if (mode === "hero") applyHeroShift();

                if (!ticking) {
                    ticking = true;
                    window.requestAnimationFrame(updateHeader);
                }
            };

            document.addEventListener("scroll", onScroll, { passive: true, capture: true });

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

        // =====================================================
        // MOBILE-ONLY ENHANCEMENTS
        // =====================================================
        const mobileQuery = window.matchMedia("(max-width: 768px), (pointer: coarse) and (max-height: 500px)");
        const isMobile = () => mobileQuery.matches;
        const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

        const focusableIn = (root) =>
            Array.from(root.querySelectorAll(FOCUSABLE)).filter(
                (el) => !el.closest(".menu-panel:not(.active)")
            );

        if (isMobile()) {
            if (menuButton && sideDrawer) {
                menuButton.setAttribute("aria-controls", "sideDrawer");
                menuButton.setAttribute("aria-haspopup", "dialog");
                sideDrawer.setAttribute("role", "dialog");
                sideDrawer.setAttribute("aria-modal", "true");
                sideDrawer.setAttribute("aria-label", "Menu");
            }
            if (searchOverlay) searchOverlay.setAttribute("aria-modal", "true");
        }

        const watchOpenState = (el, isOpenFn, onOpen, onClose) => {
            if (!el) return;
            let wasOpen = false;
            new MutationObserver(() => {
                if (!isMobile()) { wasOpen = isOpenFn(); return; }
                const open = isOpenFn();
                if (open && !wasOpen) onOpen();
                if (!open && wasOpen) onClose();
                wasOpen = open;
            }).observe(el, { attributes: true, attributeFilter: ["class"] });
        };

        watchOpenState(
            sideDrawer,
            () => sideDrawer.classList.contains("open"),
            () => { if (drawerClose) drawerClose.focus({ preventScroll: true }); },
            () => { if (menuButton) menuButton.focus({ preventScroll: true }); }
        );

        watchOpenState(
            searchOverlay,
            () => searchOverlay.classList.contains("active"),
            () => {},
            () => { if (searchButton) searchButton.focus({ preventScroll: true }); }
        );

        document.addEventListener("keydown", (event) => {
            if (event.key !== "Tab" || !isMobile()) return;

            const layer = isDrawerOpen
                ? sideDrawer
                : (searchOverlay && searchOverlay.classList.contains("active") ? searchOverlay : null);
            if (!layer) return;

            const items = focusableIn(layer);
            if (!items.length) return;

            const first = items[0];
            const last = items[items.length - 1];
            const outside = !layer.contains(document.activeElement);

            if (event.shiftKey && (document.activeElement === first || outside)) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && (document.activeElement === last || outside)) {
                event.preventDefault();
                first.focus();
            }
        });

        if (sideDrawer) {
            sideDrawer.addEventListener("click", (event) => {
                if (!isMobile()) return;
                const link = event.target.closest("a");
                if (!link || link.classList.contains("toggle-btn")) return;

                const href = link.getAttribute("href");
                const headerContact = document.querySelector("header .contact-text");

                if (href === "#") {
                    event.preventDefault();
                    closeDrawer();
                    if (headerContact && link.closest(".drawer-sub-links") && /contact/i.test(link.textContent)) {
                        window.location.hash = headerContact.getAttribute("href");
                    }
                    return;
                }
                closeDrawer();
            });
        }

        if (searchOverlay) {
            searchOverlay.addEventListener("click", (event) => {
                if (!isMobile()) return;
                const link = event.target.closest("a");
                if (!link) return;
                if (link.getAttribute("href") === "#") event.preventDefault();
                closeSearch();
            });
        }
    };

    if (siteMenu) {
        const isInPages = window.location.pathname.includes('/pages/');
        const fetchPath = isInPages ? "../navbar/navbar.html" : "navbar/navbar.html";

        fetch(fetchPath)
            .then(response => response.text())
            .then(data => {
                siteMenu.innerHTML = data;

                if (isInPages) {
                    siteMenu.querySelectorAll('a').forEach(link => {
                        let href = link.getAttribute('href');
                        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
                            if (href === 'SIGNORI.html') {
                                link.setAttribute('href', '../SIGNORI.html');
                            } else if (href.startsWith('pages/')) {
                                link.setAttribute('href', href.replace('pages/', ''));
                            }
                        }
                    });
                }

                initNavbar();
            })
            .catch(error => {
                console.error("Greshka pri zarezhdane na menyuto:", error);
            });
    } else {
        initNavbar();
    }
});