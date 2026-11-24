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

  window.addEventListener('resize', () => {
    if (descriptionBox.classList.contains('expanded')) {
      descriptionCollapse.style.maxHeight = descriptionText.scrollHeight + 'px';
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

  // 4. Mobile Loop Slider + Steady Luxury Counter (1/4 ... 4/4)
  const productPage = document.querySelector('.product-page');
  const productGallery = document.getElementById('productGallery');
  const baseGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const mobileSlideCounter = document.getElementById('mobileSlideCounter');
  const totalSlides = baseGalleryItems.length;

  let firstClone = null;
  let lastClone = null;
  let loopInitialized = false;
  let isTeleporting = false;
  let scrollEndTimer = null;

  const pinCounterToGalleryFrame = () => {
    if (!mobileSlideCounter || !productGallery || !productPage) return;
    if (window.innerWidth <= 900) {
      if (mobileSlideCounter.parentElement !== productPage) {
        productPage.style.position = 'relative';
        productPage.appendChild(mobileSlideCounter);
      }
      const galleryHeight = productGallery.offsetHeight;
      mobileSlideCounter.style.top = `${Math.max(0, galleryHeight - mobileSlideCounter.offsetHeight - 16)}px`;
      mobileSlideCounter.style.bottom = 'auto';
    } else {
      mobileSlideCounter.style.top = '';
      mobileSlideCounter.style.bottom = '';
    }
  };

  const setupMobileLoop = () => {
    if (!productGallery || totalSlides < 2 || loopInitialized) return;
    firstClone = baseGalleryItems[0].cloneNode(true);
    lastClone = baseGalleryItems[totalSlides - 1].cloneNode(true);

    firstClone.dataset.clone = 'first';
    lastClone.dataset.clone = 'last';

    productGallery.insertBefore(lastClone, baseGalleryItems[0]);
    productGallery.appendChild(firstClone);
    loopInitialized = true;
  };

  const getAllGalleryImages = () => productGallery.querySelectorAll('.gallery-item img');

  const jumpToScrollLeft = (targetLeft) => {
    isTeleporting = true;
    const prevSnap = productGallery.style.scrollSnapType;
    productGallery.style.scrollSnapType = 'none';
    productGallery.scrollLeft = targetLeft;
    requestAnimationFrame(() => {
      productGallery.style.scrollSnapType = prevSnap || '';
      isTeleporting = false;
    });
  };

  const syncLoopBoundaries = () => {
    if (!productGallery || !loopInitialized || isTeleporting) return;
    const w = productGallery.clientWidth;
    if (!w) return;

    const rawIndex = Math.round(productGallery.scrollLeft / w);

    if (rawIndex === 0) {
      jumpToScrollLeft(totalSlides * w);
    } else if (rawIndex === totalSlides + 1) {
      jumpToScrollLeft(w);
    }
  };

  const updateMobileCounter = () => {
    if (!mobileSlideCounter || !productGallery || totalSlides === 0) return;
    const slideWidth = productGallery.clientWidth || 1;
    const rawIndex = Math.round(productGallery.scrollLeft / slideWidth);
    const logicalIndex = loopInitialized
      ? (((rawIndex - 1) % totalSlides) + totalSlides) % totalSlides
      : Math.min(totalSlides - 1, Math.max(0, rawIndex));

    mobileSlideCounter.textContent = `${logicalIndex + 1}/${totalSlides}`;
  };

  if (productGallery && mobileSlideCounter) {
    if (window.innerWidth <= 900) {
      setupMobileLoop();
      pinCounterToGalleryFrame();
      const w = productGallery.clientWidth;
      if (w && loopInitialized) {
        jumpToScrollLeft(w);
      }
    }

    let scrollRaf = null;
    productGallery.addEventListener(
      'scroll',
      () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          updateMobileCounter();
          scrollRaf = null;
        });

        if (!isTeleporting && loopInitialized && window.innerWidth <= 900) {
          clearTimeout(scrollEndTimer);
          scrollEndTimer = setTimeout(syncLoopBoundaries, 90);
        }
      },
      { passive: true }
    );

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 900) {
        setupMobileLoop();
        pinCounterToGalleryFrame();
        const w = productGallery.clientWidth;
        if (w && loopInitialized && productGallery.scrollLeft < w * 0.5) {
          jumpToScrollLeft(w);
        }
      } else {
        pinCounterToGalleryFrame();
      }
      updateMobileCounter();
    });

    updateMobileCounter();
  }

  // 5. Smooth Color Swatch Selection
  const colorThumbs = document.querySelectorAll('.color-thumb');

  colorThumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (thumb.classList.contains('active')) return;

      colorThumbs.forEach((btn) => btn.classList.remove('active'));
      thumb.classList.add('active');

      const variantIndex = Number(thumb.dataset.variant);
      const selectedPhotos = variants[variantIndex];

      getAllGalleryImages().forEach((img, idx) => {
        const photoIdx = idx % totalSlides;
        if (selectedPhotos && selectedPhotos[photoIdx]) {
          img.classList.add('is-changing');
          setTimeout(() => {
            img.src = selectedPhotos[photoIdx];
            img.onload = () => img.classList.remove('is-changing');
          }, 260);
        }
      });

      if (window.innerWidth <= 900 && productGallery) {
        const w = productGallery.clientWidth || 0;
        productGallery.scrollTo({ left: loopInitialized ? w : 0, behavior: 'smooth' });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 6. Add to Cart Feedback
  const addToCartBtn = document.getElementById('addToCartBtn');
  addToCartBtn.addEventListener('click', () => {
    const originalText = addToCartBtn.textContent;
    addToCartBtn.textContent = 'Added to Cart';
    setTimeout(() => {
      addToCartBtn.textContent = originalText;
    }, 100000);
  });
});