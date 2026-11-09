document.addEventListener("DOMContentLoaded", () => {
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

            if (!document.getElementById('firstName').value.trim()) {
                showError('firstName');
            } else {
                clearError('firstName');
            }

            if (!document.getElementById('lastName').value.trim()) {
                showError('lastName');
            } else {
                clearError('lastName');
            }

            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value)) {
                showError('email');
            } else {
                clearError('email');
            }

            if (!document.getElementById('phone').value.trim()) {
                showError('phone');
            } else {
                clearError('phone');
            }

            if (!document.getElementById('appointmentType').value) {
                showError('appointmentType');
            } else {
                clearError('appointmentType');
            }

            const privacyCheck = document.getElementById('privacyCheck');
            const privacyBlock = privacyCheck.closest('.privacy-consent-block');
            if (!privacyCheck.checked) {
                privacyBlock.classList.add('error');
                isValid = false;
            } else {
                privacyBlock.classList.remove('error');
            }

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
});