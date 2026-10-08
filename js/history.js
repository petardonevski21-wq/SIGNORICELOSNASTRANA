document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Video sektsiya ---
    const videos = document.querySelectorAll(".bg-video");
    let currentVideoIndex = 0;

    if (videos.length > 0) {
        videos[currentVideoIndex].play();

        videos.forEach((video, index) => {
            video.addEventListener("ended", () => {
                video.classList.remove("active");
                currentVideoIndex = (index + 1) % videos.length;
                
                const nextVideo = videos[currentVideoIndex];
                nextVideo.currentTime = 0; 
                nextVideo.classList.add("active");
                nextVideo.play();
            });
        });
    }

    // --- 2. Slajder sektsiya ---
    const track = document.querySelector(".slider-track");
    const originalSlides = document.querySelectorAll(".slide");
    const indicators = document.querySelectorAll(".indicator");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (track && originalSlides.length > 0) {
        const firstClone = originalSlides[originalSlides.length - 1].cloneNode(true);
        const lastClone = originalSlides[0].cloneNode(true);

        firstClone.classList.remove("active-slide");
        lastClone.classList.remove("active-slide");

        track.insertBefore(firstClone, originalSlides[0]);
        track.appendChild(lastClone);

        const allSlides = document.querySelectorAll(".slider-track .slide");
        const totalOriginalSlides = originalSlides.length;
        let sliderIndex = 0; 

        function updateSlider() {
            allSlides.forEach(slide => slide.classList.remove("active-slide"));
            indicators.forEach(ind => ind.classList.remove("active"));

            allSlides[sliderIndex + 1].classList.add("active-slide");
            if (indicators[sliderIndex]) {
                indicators[sliderIndex].classList.add("active");
            }

            let moveAmount;
            if (window.innerWidth > 1024) {
                moveAmount = (sliderIndex + 1) * 60.5;
            } else if (window.innerWidth <= 768) {
                moveAmount = (sliderIndex + 1) * 87;
            } else {
                moveAmount = (sliderIndex + 1) * 70.5;
            }

            track.style.transform = `translateX(-${moveAmount}vw)`;
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener("click", () => {
                sliderIndex = (sliderIndex < totalOriginalSlides - 1) ? sliderIndex + 1 : 0;
                updateSlider();
            });

            prevBtn.addEventListener("click", () => {
                sliderIndex = (sliderIndex > 0) ? sliderIndex - 1 : totalOriginalSlides - 1;
                updateSlider();
            });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => {
                sliderIndex = index;
                updateSlider();
            });
        });

        track.style.transition = "none";
        updateSlider();
        
        setTimeout(() => {
            track.style.transition = "";
        }, 50);

        window.addEventListener("resize", () => {
            track.style.transition = "none";
            updateSlider();
            setTimeout(() => {
                track.style.transition = "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)";
            }, 50);
        });
    }

    // --- 3. Vchituvane na futer ---
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        fetch("../footer/footer.html")
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error("Greshka pri vchituvane na futera:", error));
    }
});

// --- 4. Skrol logika: Zamatuvanie i fiksirane na slikata dokato tekstat se skrola ---
window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll(".second-section");
    
    sections.forEach((section) => {
        const image = section.querySelector("img");
        const overlay = section.querySelector(".overlay-dark");
        
        if (!image) return;

        const rect = section.getBoundingClientRect();
        const sectionScrollHeight = section.offsetHeight - window.innerHeight;

        if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
            let scrolled = Math.abs(rect.top);
            
            // Zamatyvaneto zapochva pri navlizaneto na teksta
            let startThreshold = window.innerHeight * 0.4;
            let scrollRange = sectionScrollHeight - startThreshold;
            
            let progress = 0;
            if (scrolled > startThreshold && scrollRange > 0) {
                progress = Math.min(Math.max((scrolled - startThreshold) / scrollRange, 0), 1);
            }

            let blurAmount = progress * 10; 
            let opacityAmount = progress * 0.6;

            image.style.filter = `blur(${blurAmount.toFixed(1)}px)`;
            if (overlay) overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacityAmount})`;
        } else if (rect.top > 0) {
            image.style.filter = "blur(0px)";
            if (overlay) overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
        }
    });
});

// --- 5. Stacked sticky scroll: 4 slici (GSAP + ScrollTrigger) ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const stackSection = document.getElementById("stackSection");
    if (!stackSection) return;

    const stackItems = gsap.utils.toArray("#stackSection .stack-item");
    if (stackItems.length < 4) return;

    const stackImgs = stackItems.map(item => item.querySelector(".stack-img"));
    const stackContents = stackItems.map(item => item.querySelector(".stack-content"));

    gsap.set(stackItems[0], { yPercent: 0, force3D: true });
    gsap.set([stackItems[1], stackItems[2], stackItems[3]], { yPercent: 100, force3D: true });

    // Smooth entrance for first image and text
    gsap.fromTo(stackImgs[0],
        { scale: 1 },
        {
            scale: 1.05,
            ease: "none",
            scrollTrigger: {
                trigger: stackSection,
                start: "top bottom",
                end: "top top",
                scrub: true,
                invalidateOnRefresh: true
            }
        }
    );

    gsap.fromTo(stackContents[0],
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
                trigger: stackSection,
                start: "top 70%",
                end: "top top",
                scrub: 0.5,
                invalidateOnRefresh: true
            }
        }
    );

    const stackTl = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
            trigger: stackSection,
            start: "top top",
            end: () => "+=" + window.innerHeight * 3,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true
        }
    });

    stackTl
        .to(stackItems[1], { yPercent: 0 }, 0)
        .to(stackItems[2], { yPercent: 0 }, 1)
        .to(stackItems[3], { yPercent: 0 }, 2);

    // Subtle zoom for images 2-4
    stackTl
        .to(stackImgs[1], { scale: 1.05 }, 0)
        .to(stackImgs[2], { scale: 1.05 }, 1)
        .to(stackImgs[3], { scale: 1.05 }, 2);

    // Smooth luxury text reveals for slides 2, 3, 4
    stackTl
        .fromTo(stackContents[1], { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: "power2.out" }, 0.2)
        .fromTo(stackContents[2], { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: "power2.out" }, 1.2)
        .fromTo(stackContents[3], { opacity: 0, y: 50 }, { opacity: 1, y: 0, ease: "power2.out" }, 2.2);
});

// --- 6. First Creations: luxury reveal for the two pictures (GSAP + ScrollTrigger) ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".creation-card").forEach((card, i) => {
        const img = card.querySelector("img");
        if (!img) return;

        gsap.set(card, { opacity: 0, y: 50, force3D: true });
        gsap.set(img, { scale: 1.15, force3D: true });

        const tl = gsap.timeline({
            delay: i * 0.2,
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                once: true
            }
        });

        tl.to(card, { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" })
          .to(img, { scale: 1, duration: 2.2, ease: "power2.out" }, "<");
    });
});

// --- 7. The First Years, Three Suits, Anniversary & Next Chapter reveal ---
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    gsap.from(".first-years-grid", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".first-years-grid",
            start: "top 80%",
            once: true
        }
    });

    gsap.from(".expanding-idea-box", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".expanding-idea-box",
            start: "top 80%",
            once: true
        }
    });

    gsap.from(".three-suits-section", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".three-suits-section",
            start: "top 80%",
            once: true
        }
    });

    gsap.from(".next-chapter-section", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".next-chapter-section",
            start: "top 80%",
            once: true
        }
    });
});