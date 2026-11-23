document.addEventListener('DOMContentLoaded', () => {
  // 1. Smooth Read More / Read Less Toggle
  const readMoreBtn = document.getElementById('readMoreBtn');
  const descriptionBox = document.getElementById('descriptionBox');
  const descriptionCollapse = document.getElementById('descriptionCollapse');
  const descriptionText = document.getElementById('descriptionText');
  const collapsedHeight = 44;

  readMoreBtn.addEventListener('click', () => {
    const isExpanded = descriptionBox.classList.toggle('expanded');

    if (isExpanded) {
      descriptionCollapse.style.maxHeight = descriptionText.scrollHeight + 'px';
      readMoreBtn.textContent = 'Read less';
    } else {
      descriptionCollapse.style.maxHeight = collapsedHeight + 'px';
      readMoreBtn.textContent = 'Read more';
    }
  });

  // 2. Quantity Counter
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyValue = document.getElementById('qtyValue');
  let quantity = 1;

  qtyMinus.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyValue.textContent = quantity;
    }
  });

  qtyPlus.addEventListener('click', () => {
    quantity++;
    qtyValue.textContent = quantity;
  });

  // 3. Size Dropdown Selector
  const sizeWrapper = document.querySelector('.size-selector-wrapper');
  const sizeTrigger = document.getElementById('sizeTrigger');
  const selectedSizeText = document.getElementById('selectedSize');
  const sizeOptions = document.querySelectorAll('#sizeDropdown li');

  sizeTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    sizeWrapper.classList.toggle('open');
  });

  sizeOptions.forEach((option) => {
    option.addEventListener('click', () => {
      sizeOptions.forEach((opt) => opt.classList.remove('selected'));
      option.classList.add('selected');
      selectedSizeText.textContent = option.dataset.size;
      sizeWrapper.classList.remove('open');
    });
  });

  document.addEventListener('click', () => {
    sizeWrapper.classList.remove('open');
  });

  // 4. Smooth Color Swatch Selection
  const colorThumbs = document.querySelectorAll('.color-thumb');
  const galleryImages = document.querySelectorAll('.gallery-item img');




  colorThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (thumb.classList.contains('active')) return;

      colorThumbs.forEach((btn) => btn.classList.remove('active'));
      thumb.classList.add('active');

      const variantIndex = Number(thumb.dataset.variant);
      const selectedPhotos = variants[variantIndex];

      galleryImages.forEach((img, idx) => {
        if (selectedPhotos[idx]) {
          img.classList.add('is-changing');
          setTimeout(() => {
            img.src = selectedPhotos[idx];
            img.onload = () => img.classList.remove('is-changing');
          }, 260);
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 5. Add to Cart Feedback
  const addToCartBtn = document.getElementById('addToCartBtn');
  addToCartBtn.addEventListener('click', () => {
    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = 'Added to Cart';
    setTimeout(() => {
      addToCartBtn.textContent = originalText;
    }, 1500);
  });
});