document.addEventListener("DOMContentLoaded", () => {
    const toolbar = document.getElementById("collectionToolbar");
    const container = document.getElementById("collectionContainer");
    const grid = document.getElementById("productsGrid");
    const sortSelect = document.getElementById("sortSelect");

    const productsData = [
        {
            id: 1,
            title: "The Signature Suit",
            price: 1200,
            images: [
                "../assets/sliki/KOLEKCIJA/prod1-1.jpg",
                "../assets/sliki/KOLEKCIJA/prod1-2.jpg",
                "../assets/sliki/KOLEKCIJA/prod1-3.jpg"
            ],
            colors: ["#8B0000", "#0F2C59", "#E6CCB2"]
        },
        {
            id: 2,
            title: "The Signature Suit",
            price: 1320,
            images: [
                "../assets/sliki/KOLEKCIJA/prod2-1.jpg",
                "../assets/sliki/KOLEKCIJA/prod2-2.jpg",
                "../assets/sliki/KOLEKCIJA/prod2-3.jpg"
            ],
            colors: ["#8B0000", "#0F2C59", "#E6CCB2"]
        },
        {
            id: 3,
            title: "The Signature Suit",
            price: 1440,
            images: [
                "../assets/sliki/KOLEKCIJA/prod3-1.jpg",
                "../assets/sliki/KOLEKCIJA/prod3-2.jpg",
                "../assets/sliki/KOLEKCIJA/prod3-3.jpg"
            ],
            colors: ["#8B0000", "#0F2C59", "#E6CCB2"]
        },
        {
            id: 4,
            title: "The Signature Suit",
            price: 1560,
            images: [
                "../assets/sliki/KOLEKCIJA/prod4-1.jpg",
                "../assets/sliki/KOLEKCIJA/prod4-2.jpg",
                "../assets/sliki/KOLEKCIJA/prod4-3.jpg"
            ],
            colors: ["#8B0000", "#0F2C59", "#E6CCB2"]
        },
        {
            id: 5,
            title: "The Signature Suit",
            price: 1680,
            images: [
                "../assets/sliki/KOLEKCIJA/prod5-1.jpg",
                "../assets/sliki/KOLEKCIJA/prod5-2.jpg",
                "../assets/sliki/KOLEKCIJA/prod5-3.jpg"
            ],
            colors: ["#8B0000", "#0F2C59", "#E6CCB2"]
        },
        {
            id: 6,
            title: "The Signature Suit",
            price: 1800,
            images: [
                "../assets/sliki/KOLEKCIJA/prod6-1.jpg",
                "../assets/sliki/KOLEKCIJA/prod6-2.jpg",
                "../assets/sliki/KOLEKCIJA/prod6-3.jpg"
            ],
            colors: ["#8B0000", "#0F2C59", "#E6CCB2"]
        },
        {
            id: 7,
            title: "The Signature Suit",
            price: 1920,
            images: [
                "../assets/sliki/KOLEKCIJA/prod7-1.jpg",
                "../assets/sliki/KOLEKCIJA/prod7-2.jpg",
                "../assets/sliki/KOLEKCIJA/prod7-3.jpg"
            ],
            colors: ["#8B0000", "#0F2C59", "#E6CCB2"]
        },
        {
            id: 8,
            title: "The Signature Suit",
            price: 2040,
            images: [
                "../assets/sliki/KOLEKCIJA/prod8-1.jpg",
                "../assets/sliki/KOLEKCIJA/prod8-2.jpg",
                "../assets/sliki/KOLEKCIJA/prod8-3.jpg"
            ],
            colors: ["#8B0000", "#0F2C59", "#E6CCB2"]
        }
    ];

    function renderProducts(items) {
        if (!grid) return;
        grid.innerHTML = "";

        items.forEach(product => {
            const card = document.createElement("article");
            card.className = "product-card";

            const slideImages = product.images.slice(0, 3);

            const imagesHTML = slideImages
                .map((src, i) => `<img src="${src}" alt="${product.title} - ${i + 1}" loading="lazy">`)
                .join("");

            const indicatorsHTML = slideImages
                .map((_, i) => `<span class="indicator-bar ${i === 0 ? "active" : ""}" data-index="${i}"></span>`)
                .join("");

            const swatchesHTML = product.colors
                .map(hex => `<span class="swatch" style="background-color: ${hex};" aria-label="Color option"></span>`)
                .join("");

            card.innerHTML = `
                <div class="product-media">
                    <div class="slides-track">${imagesHTML}</div>

                    <button type="button" class="slider-arrow prev" aria-label="Previous image">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <button type="button" class="slider-arrow next" aria-label="Next image">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>

                    <div class="slide-indicators">${indicatorsHTML}</div>
                </div>

                <div class="product-info">
                    <a href="#" class="product-title">${product.title}</a>
                    <div class="product-swatches">${swatchesHTML}</div>
                </div>
            `;

            let currentSlide = 0;
            const totalSlides = slideImages.length;
            const track = card.querySelector(".slides-track");
            const prevBtn = card.querySelector(".prev");
            const nextBtn = card.querySelector(".next");
            const indicators = card.querySelectorAll(".indicator-bar");

            function updateSlide(nextIndex) {
                if (nextIndex < 0) {
                    currentSlide = totalSlides - 1;
                } else if (nextIndex >= totalSlides) {
                    currentSlide = 0;
                } else {
                    currentSlide = nextIndex;
                }

                track.style.transform = `translateX(-${currentSlide * 100}%)`;
                indicators.forEach((bar, idx) => {
                    bar.classList.toggle("active", idx === currentSlide);
                });
            }

            prevBtn.addEventListener("click", () => updateSlide(currentSlide - 1));
            nextBtn.addEventListener("click", () => updateSlide(currentSlide + 1));
            indicators.forEach(bar => {
                bar.addEventListener("click", () => {
                    updateSlide(parseInt(bar.getAttribute("data-index"), 10));
                });
            });

            grid.appendChild(card);
        });
    }

    renderProducts(productsData);

    if (sortSelect) {
        sortSelect.addEventListener("change", () => {
            const sorted = [...productsData];
            const val = sortSelect.value;

            if (val === "price-asc") sorted.sort((a, b) => a.price - b.price);
            if (val === "price-desc") sorted.sort((a, b) => b.price - a.price);
            if (val === "newest") sorted.reverse();

            renderProducts(sorted);
        });
    }

    // --- STICKY TOOLBAR POSITION SYNCHRONIZED WITH EXISTING HEADER ---
    if (toolbar) {
        let naturalTop = null;
        let toolbarHeight = toolbar.offsetHeight || 50;
        let lastScrollY = window.scrollY || window.pageYOffset || 0;
        let observedHeader = null;
        let headerObserver = null;
        let rafId = null;

        function measureNaturalMetrics() {
            const wasSticky = toolbar.classList.contains("is-sticky");
            if (wasSticky) {
                toolbar.classList.remove("is-sticky");
                if (container) container.classList.remove("has-toolbar-placeholder");
                toolbar.style.removeProperty("--toolbar-top");
            }

            toolbarHeight = toolbar.offsetHeight || 50;
            toolbar.style.setProperty("--toolbar-height", `${toolbarHeight}px`);

            const rect = toolbar.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset || 0;
            naturalTop = rect.top + scrollY;

            if (wasSticky) {
                toolbar.classList.add("is-sticky");
                if (container) container.classList.add("has-toolbar-placeholder");
            }
        }

        function attachHeaderObserver() {
            const header = document.querySelector("header");
            if (!header || header === observedHeader) return;

            if (headerObserver) headerObserver.disconnect();
            observedHeader = header;

            headerObserver = new MutationObserver(() => {
                scheduleSync();
            });

            headerObserver.observe(header, {
                attributes: true,
                attributeFilter: ["class", "style"]
            });
        }

        function getTargetStickyTop(header, isScrollingUp) {
            if (!header) return 0;

            if (isScrollingUp && header.classList.contains("nav-hidden")) {
                header.classList.remove("nav-hidden");
            }

            const isHeaderHidden = header.classList.contains("nav-hidden");
            if (isHeaderHidden) return 0;

            const headerRect = header.getBoundingClientRect();
            const headerStyle = window.getComputedStyle(header);
            const isHeaderVisible =
                headerStyle.display !== "none" &&
                headerStyle.visibility !== "hidden" &&
                parseFloat(headerStyle.opacity || "1") > 0.05;

            if (!isHeaderVisible || headerRect.bottom <= 0) return 0;

            return Math.max(0, Math.round(headerRect.bottom));
        }

        function syncToolbar() {
            rafId = null;
            attachHeaderObserver();

            if (naturalTop === null) {
                measureNaturalMetrics();
            }

            const header = document.querySelector("header");
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const isScrollingUp = scrollY < lastScrollY - 1;
            const shouldBeSticky = naturalTop !== null && scrollY >= naturalTop;

            if (!shouldBeSticky) {
                if (toolbar.classList.contains("is-sticky")) {
                    toolbar.classList.remove("is-sticky");
                    if (container) container.classList.remove("has-toolbar-placeholder");
                    toolbar.style.removeProperty("--toolbar-top");
                }
                lastScrollY = scrollY;
                return;
            }

            if (!toolbar.classList.contains("is-sticky")) {
                toolbar.classList.add("is-sticky");
                if (container) container.classList.add("has-toolbar-placeholder");
            }

            const targetTop = getTargetStickyTop(header, isScrollingUp);
            toolbar.style.setProperty("--toolbar-top", `${targetTop}px`);
            lastScrollY = scrollY;
        }

        function scheduleSync() {
            if (rafId !== null) return;
            rafId = window.requestAnimationFrame(syncToolbar);
        }

        function handleResize() {
            naturalTop = null;
            scheduleSync();
        }

        window.addEventListener("scroll", scheduleSync, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });

        const siteMenu = document.getElementById("site-menu");
        if (siteMenu) {
            const menuObserver = new MutationObserver(() => {
                if (siteMenu.querySelector("header")) {
                    attachHeaderObserver();
                    naturalTop = null;
                    scheduleSync();
                }
            });
            menuObserver.observe(siteMenu, { childList: true, subtree: true });
        }

        measureNaturalMetrics();
        scheduleSync();
        window.addEventListener("load", handleResize, { once: true });
    }
});