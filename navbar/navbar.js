document.addEventListener("DOMContentLoaded", () => {
    fetch("../navbar/navbar.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("site-menu").innerHTML = data;

            const header = document.querySelector("header");
            const menuButton = document.getElementById("menuButton");
            const sideDrawer = document.getElementById("sideDrawer");
            const drawerOverlay = document.getElementById("drawerOverlay");

            // ---------------------------------------------
            // Settings
            // ---------------------------------------------
            const SCROLLED_AT = 40;       // px from top: white/compact style starts
            const ALWAYS_SHOW_BELOW = 80; // px from top: navbar is always visible
            const DELTA_THRESHOLD = 8;    // px: ignore tiny scroll movements (no flicker)

            let isDrawerOpen = false;
            let lastScrollY = 0;
            let ticking = false;

            // Works whether the window or <body> is the element that scrolls
            const getScrollY = () => Math.max(
                window.pageYOffset || 0,
                document.documentElement.scrollTop || 0,
                document.body.scrollTop || 0,
                0
            );

            const showHeader = () => header.classList.remove("nav-hidden");
            const hideHeader = () => header.classList.add("nav-hidden");

            // ---------------------------------------------
            // Side drawer (menu)
            // ---------------------------------------------
            const openDrawer = () => {
                if (isDrawerOpen) return;
                isDrawerOpen = true;
                sideDrawer.classList.add("open");
                drawerOverlay.classList.add("active");
                menuButton.setAttribute("aria-expanded", "true");
                if (header) showHeader(); // navbar stays visible while the menu is open
            };

            const closeDrawer = () => {
                if (!isDrawerOpen) return;
                isDrawerOpen = false;
                sideDrawer.classList.remove("open");
                drawerOverlay.classList.remove("active");
                menuButton.setAttribute("aria-expanded", "false");
                lastScrollY = getScrollY(); // avoid a false "scroll" jump after closing
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

                document.addEventListener("keydown", (event) => {
                    if (event.key === "Escape") closeDrawer();
                });
            }

            // ---------------------------------------------
            // Scroll behavior (hide on down, show on up)
            // ---------------------------------------------
            if (header) {
                lastScrollY = getScrollY();

                const updateHeader = () => {
                    ticking = false;

                    const currentScrollY = getScrollY();

                    // 1. White background + black text once scrolled away from the top
                    header.classList.toggle("nav-scrolled", currentScrollY > SCROLLED_AT);

                    // 2. Never hide while the menu is open or near the top of the page
                    if (isDrawerOpen || currentScrollY <= ALWAYS_SHOW_BELOW) {
                        showHeader();
                        lastScrollY = currentScrollY;
                        return;
                    }

                    // 3. Ignore very small movements (lastScrollY is kept so they add up)
                    const delta = currentScrollY - lastScrollY;
                    if (Math.abs(delta) < DELTA_THRESHOLD) return;

                    // 4. Down = hide, up = show
                    if (delta > 0) {
                        hideHeader();
                    } else {
                        showHeader();
                    }

                    lastScrollY = currentScrollY;
                };

                const onScroll = (event) => {
                    // Only react to page scrolling, not inner scrollers (sliders, etc.)
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

                // Capture phase so it also works if <body> is the scrolling element
                document.addEventListener("scroll", onScroll, { passive: true, capture: true });

                // Set the correct state on load (e.g. page refreshed mid-scroll)
                updateHeader();
            }
        })
        .catch(error => {
            console.error("Greshka pri zarezhdane na menyuto:", error);
        });
});