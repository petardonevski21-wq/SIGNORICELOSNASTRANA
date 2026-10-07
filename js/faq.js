document.addEventListener('DOMContentLoaded', () => {

  // --- HARMONIKA ZA FAQ ---
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Zapri vsa ostala vprašanja
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-panel').style.maxHeight = null;
        }
      });

      // Preklop trenutnega vprašanja
      if (isOpen) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  // Отстранета е логиката за табови за "Contact Us",
  // бидејќи тоа сега е директен линк во HTML.

});