/* -------------------------------------------------------------------------- */
/* SIGNORI BESPOKE — INTERACTIVE BEHAVIOR                                     */
/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Drawer Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuDrawer = document.querySelector('.mobile-menu-drawer');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');

    if (menuToggle && menuDrawer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            menuDrawer.classList.toggle('open');
            document.body.style.overflow = menuDrawer.classList.contains('open') ? 'hidden' : '';
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                menuDrawer.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answerDiv = item.querySelector('.faq-answer');

        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked item if it wasn't open
            if (!isOpen) {
                item.classList.add('active');
                answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
            }
        });
    });

    // Header scroll background effect
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
});