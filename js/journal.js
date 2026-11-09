document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 2. Form Validation & Submission Handling
    const form = document.getElementById('signoriAppointmentForm');
    const successBox = document.getElementById('successStateBox');
    const formHeaderArea = document.getElementById('formHeaderArea');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const clearError = (fieldId) => {
                const wrap = document.getElementById(fieldId).closest('.field-container');
                if (wrap) wrap.classList.remove('error');
            };

            const showError = (fieldId) => {
                const wrap = document.getElementById(fieldId).closest('.field-container');
                if (wrap) wrap.classList.add('error');
                isValid = false;
            };

            // First Name
            if (!document.getElementById('firstName').value.trim()) {
                showError('firstName');
            } else {
                clearError('firstName');
            }

            // Last Name
            if (!document.getElementById('lastName').value.trim()) {
                showError('lastName');
            } else {
                clearError('lastName');
            }

            // Email
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                showError('email');
            } else {
                clearError('email');
            }

            // Phone
            if (!document.getElementById('phone').value.trim()) {
                showError('phone');
            } else {
                clearError('phone');
            }

            // Region
            if (!document.getElementById('region').value) {
                showError('region');
            } else {
                clearError('region');
            }

            // Event Option
            if (!document.getElementById('eventOption').value) {
                showError('eventOption');
            } else {
                clearError('eventOption');
            }

            // Privacy Checkbox
            const privacyCheck = document.getElementById('privacyCheck');
            const privacyBlock = privacyCheck.closest('.privacy-consent-block');
            if (!privacyCheck.checked) {
                privacyBlock.classList.add('error');
                isValid = false;
            } else {
                privacyBlock.classList.remove('error');
            }

            // Success Transition
            if (isValid) {
                const submitBtn = document.getElementById('submitBtn');
                submitBtn.disabled = true;
                submitBtn.textContent = "PROCESSING REQUEST...";

                setTimeout(() => {
                    form.style.display = 'none';
                    if (formHeaderArea) formHeaderArea.style.display = 'none';
                    successBox.style.display = 'block';
                    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 800);
            }
        });
    }

    // GSAP Entrance Animation
    if (typeof gsap !== 'undefined') {
        gsap.fromTo(".appointment-container", 
            { opacity: 0, y: 25 }, 
            { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" }
        );
    }
});