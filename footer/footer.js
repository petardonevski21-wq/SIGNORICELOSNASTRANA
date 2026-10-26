/**
 * SIGNORI Luxury Footer Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    // Cookie Preferences modal trigger
    const cookieBtn = document.getElementById('openCookieSettings');
    
    if (cookieBtn) {
        cookieBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('SIGNORI Cookie Preferences modal triggered.');
        });
    }
});