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