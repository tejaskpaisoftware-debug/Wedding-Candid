/* Global Astro Initializations */

window.dynamicWordInterval = null;
window.dynamicGalleryInterval = null;
window.gallery3dActive = false;
window.revealObserver = null;
window.gallery3dWheelHandler = null;

function globalCleanup() {
  if (window.dynamicWordInterval) clearInterval(window.dynamicWordInterval);
  if (window.dynamicGalleryInterval) clearInterval(window.dynamicGalleryInterval);
  if (window.gallery3dWheelHandler) {
    window.removeEventListener('wheel', window.gallery3dWheelHandler);
  }
  if (window.gallery3dTouchStart) window.removeEventListener('touchstart', window.gallery3dTouchStart);
  if (window.gallery3dTouchMove)  window.removeEventListener('touchmove',  window.gallery3dTouchMove);
  document.body.style.overflow = '';
  window.gallery3dActive = false;
}

window.initDynamicWord = function() {
  if (window.dynamicWordInterval) clearInterval(window.dynamicWordInterval);
  const wordEl = document.querySelector('.dynamic-word');
  if (!wordEl) return;

  const words = ['Capturing', 'Creating', 'Preserving'];
  let idx = 0;

  // Initial state logic removed as CSS handles first state
  
  window.dynamicWordInterval = setInterval(() => {
    // Phase 1: Slide Up & Fade Out
    wordEl.style.opacity = '0';
    wordEl.style.transform = 'translateY(-15px) scale(0.95)';
    wordEl.style.filter = 'blur(4px)';
    
    setTimeout(() => {
      // Phase 2: Teleport to Bottom
      idx = (idx + 1) % words.length;
      wordEl.textContent = words[idx];
      wordEl.style.transition = 'none';
      wordEl.style.transform = 'translateY(15px) scale(0.95)';
      
      // Phase 3: Slide In & Fade In
      requestAnimationFrame(() => {
        wordEl.style.transition = 'var(--transition-smooth)';
        wordEl.style.opacity = '1';
        wordEl.style.transform = 'translateY(0) scale(1)';
        wordEl.style.filter = 'blur(0px)';
      });
    }, 700); // Wait for fade out to complete
  }, 2800); // 2.8s total cycle
};

window.initDynamicGallery = function() {
  if (window.dynamicGalleryInterval) clearInterval(window.dynamicGalleryInterval);

  const container = document.getElementById('dynamic-gallery');
  if (!container) return;

  const sets = [
    ['1M4A8828.jpg', 'DJI_0639.jpg', 'WC__7232.jpg', 'DJI_20241209172706_0093_D_FLYCAPTURE.jpg', 'WC_11751.JPG', 'WC__8428.jpg'],
    ['MBJ_5953.jpg', 'SSP01330.JPG', 'WC_13299.jpg', 'WC_17354.JPG', 'WC_17407.JPG', 'WC_19833.jpg'],
    ['1M4A8828.jpg', 'DJI_0639.jpg', 'CB8A0325.jpg', 'WC__5748.jpg', 'WC__6391.jpg', 'WC_11751.JPG']
  ];

  const layouts = ['layout-1', 'layout-2', 'layout-3'];
  let currentIdx = 0;

  container.innerHTML = '';

  sets.forEach((set, i) => {
    const layoutDiv = document.createElement('div');
    layoutDiv.className = `gallery-layout ${layouts[i]}`;
    if (i === 0) layoutDiv.classList.add('active');

    set.forEach(img => {
      const item = document.createElement('div');
      item.className = 'gallery-item lightbox-trigger';
      item.innerHTML = `<img src="/candid/${img}" loading="lazy" alt="Featured">`;
      layoutDiv.appendChild(item);
    });

    container.appendChild(layoutDiv);
  });

  const allLayouts = container.querySelectorAll('.gallery-layout');

  window.dynamicGalleryInterval = setInterval(() => {
    allLayouts[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % allLayouts.length;
    allLayouts[currentIdx].classList.add('active');
  }, 4500);
};

window.setupPortfolioFilters = function(activeCategory) {
  const grid = document.querySelector('.portfolio-grid');
  if (!grid) return;

  const filterHTML = `
      <div class="portfolio-filters stagger-reveal visible" style="display: flex; justify-content: center; gap: 2rem; margin-bottom: 3rem; flex-wrap: wrap;">
        <button class="filter-btn ${!activeCategory || activeCategory === 'all' ? 'active' : ''}" data-filter="all">All</button>
        <button class="filter-btn ${activeCategory === 'wedding' ? 'active' : ''}" data-filter="wedding">Wedding</button>
        <button class="filter-btn ${activeCategory === 'prewedding' ? 'active' : ''}" data-filter="prewedding">Pre-Wedding</button>
        <button class="filter-btn ${activeCategory === 'events' ? 'active' : ''}" data-filter="events">Events</button>
        <button class="filter-btn ${activeCategory === 'portrait' ? 'active' : ''}" data-filter="portrait">Portrait</button>
      </div>`;

  if (!document.querySelector('.portfolio-filters')) {
    grid.insertAdjacentHTML('beforebegin', filterHTML);
  }

  const items = document.querySelectorAll('.portfolio-item');
  const filterBtns = document.querySelectorAll('.filter-btn');

  const applyFilter = (cat) => {
    setTimeout(() => {
      items.forEach(item => {
        if (cat === 'all' || !cat || item.getAttribute('data-category') === cat) {
          item.style.display = 'block';
          setTimeout(() => item.style.opacity = '1', 50);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    }, 50);
  };

  if (activeCategory) {
    applyFilter(activeCategory);
  } else {
    applyFilter('all');
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      applyFilter(cat);
      // update URL seamlessly
      const newPath = cat === 'all' ? '/portfolio' : '/portfolio?filter=' + cat;
      window.history.pushState(null, null, newPath);
    });
  });
};

window.revealSections = function() {
  if (window.revealObserver) window.revealObserver.disconnect();

  window.revealObserver = new IntersectionObserver((entries) => {
    let delay = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        delay += 150;
        window.revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-reveal').forEach(el => {
    el.classList.remove('visible');
    window.revealObserver.observe(el);
  });
};

window.init3DGallery = function() {
  const track = document.getElementById('gallery-track');
  if (!track) return;

  window.gallery3dActive = true;
  document.body.style.overflow = 'hidden';

  const images = [
    '/candid/1M4A8828.jpg',   '/homepage/DJI_0639.jpg',
    '/candid/WC__7232.jpg',   '/candid/DJI_20241209172706_0093_D_FLYCAPTURE.jpg',
    '/homepage/WC_11751.JPG',   '/candid/WC__8428.jpg',
    '/candid/MBJ_5953.jpg',   '/candid/SSP01330.JPG',
    '/candid/WC_13299.jpg',   '/candid/WC_17354.JPG',
    '/candid/WC_17407.JPG',   '/candid/WC_19833.jpg',
    '/candid/CB8A0325.jpg',   '/candid/WC__5748.jpg',
    '/candid/WC__6391.jpg',   '/candid/WC__8428.jpg',
  ];

  function buildChunk() {
    const COLS = 4;
    const ROWS = 12;
    const colOffsets = ['0px', '60px', '10px', '90px'];
    const widths     = ['88%', '100%', '72%', '94%'];
    let html = '';
    for (let i = 0; i < ROWS; i++) {
      html += `<div style="display:grid;grid-template-columns:repeat(${COLS},1fr);gap:3vw;width:100%;padding:1.5rem 4vw;box-sizing:border-box;">`;
      for (let j = 0; j < COLS; j++) {
        const idx = (i * 7 + j * 5) % images.length;
        const w   = widths[(i * 3 + j) % COLS];
        const pt  = colOffsets[(i * 2 + j) % COLS];
        html += `<div class="lightbox-trigger gallery-item" style="justify-self:center;width:${w};padding-top:${pt};will-change:transform;cursor:zoom-in;"><img src="${images[idx]}" loading="lazy" style="width:100%;height:auto;display:block;border-radius:3px;box-shadow:0 8px 30px rgba(0,0,0,0.12);"></div>`;
      }
      html += '</div>';
    }
    return html;
  }

  const chunk = buildChunk();
  track.innerHTML =
    `<div class="glc" style="display:flex;flex-direction:column;width:100%;">${chunk}</div>` +
    `<div class="glc" style="display:flex;flex-direction:column;width:100%;">${chunk}</div>` +
    `<div class="glc" style="display:flex;flex-direction:column;width:100%;">${chunk}</div>`;
  track.style.willChange = 'transform';

  // Wait TWO frames so the DOM actually renders and getBoundingClientRect is accurate
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const loopH = track.querySelector('.glc').getBoundingClientRect().height;

    // We sit in the MIDDLE chunk. 
    //   scroll = 0  → shows chunk 0 (top)
    //   scroll = -loopH → shows chunk 1 (middle) ← we start here
    //   scroll = -2*loopH → shows chunk 2 (bottom)
    // Teleport rule: if we drift past middle into chunk 0 territory → jump forward one chunk
    //                if we drift past middle into chunk 2 territory → jump back one chunk
    let scroll   = -loopH; // visual position committed to DOM
    let target   = -loopH; // accumulated wheel/touch input

    window.gallery3dWheelHandler = (e) => {
      e.preventDefault();
      const pixels = e.deltaMode === 0 ? e.deltaY          // trackpad: already pixels
                   : e.deltaMode === 1 ? e.deltaY * 32     // mouse wheel: lines → pixels
                   :                     e.deltaY * window.innerHeight; // pages
      target -= pixels; // subtract = scroll down moves content up (natural direction)
    };
    window.addEventListener('wheel', window.gallery3dWheelHandler, { passive: false });

    let touchY = 0;
    window.gallery3dTouchStart = (e) => { touchY = e.touches[0].clientY; };
    window.gallery3dTouchMove  = (e) => {
      e.preventDefault();
      target -= (touchY - e.touches[0].clientY) * 1.5;
      touchY = e.touches[0].clientY;
    };
    window.addEventListener('touchstart', window.gallery3dTouchStart, { passive: true });
    window.addEventListener('touchmove',  window.gallery3dTouchMove,  { passive: false });

    function renderLoop() {
      if (!window.gallery3dActive) return;

      // LOOP TELEPORT — instant jump that keeps visual continuity
      // When target drifts above the middle chunk's top boundary (scrolled up too far)
      if (target > -loopH) {
        target -= loopH;
        scroll -= loopH;
      }
      // When target drifts below the middle chunk's bottom boundary (scrolled down too far)
      if (target < -(loopH * 2)) {
        target += loopH;
        scroll += loopH;
      }

      // LERP — smooth easing
      scroll += (target - scroll) * 0.09;

      track.style.transform = `translateY(${scroll}px)`;

      // CENTER MAGNIFICATION — only run on visible items
      const vh = window.innerHeight;
      track.querySelectorAll('.gallery-item').forEach(item => {
        const r = item.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) {
          item.style.transform = 'scale(1)';
          return;
        }
        const dist  = Math.abs((r.top + r.height / 2) - vh / 2);
        const zone  = vh * 0.6;
        const t     = Math.max(0, 1 - dist / zone);
        item.style.transform = `scale(${1 + 0.2 * t * t})`;
      });

      requestAnimationFrame(renderLoop);
    }

    renderLoop();
  }));
};




function initGlobalListeners() {
  document.body.addEventListener('click', (e) => {
    const trigger = e.target.closest('.lightbox-trigger');
    if (trigger) {
      const img = trigger.querySelector('img');
      if (!img) return;

      let lightbox = document.getElementById('global-lightbox');
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'global-lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
                  <div class="lightbox-close" style="font-size: 3rem; position: absolute; top: 2rem; right: 2rem; color: white; cursor: pointer; z-index: 10001;">&times;</div>
                  <img src="" alt="Fullscreen">
              `;
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', (ev) => {
          if (ev.target.tagName !== 'IMG') {
            lightbox.classList.remove('active');
            setTimeout(() => lightbox.style.display = 'none', 400);
          }
        });
      }

      lightbox.style.display = 'flex';
      setTimeout(() => {
        lightbox.querySelector('img').src = img.src;
        lightbox.classList.add('active');
      }, 10);
    }
  });

  document.body.addEventListener('mousedown', (e) => {
    const btn = e.target.closest('.btn-ripple');
    if (!btn) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const navbar = document.getElementById('wc-navbar');
    if (navbar) {
       if (scrollPos > 50) navbar.classList.add('scrolled');
       else navbar.classList.remove('scrolled');
    }

    const aboutImg = document.getElementById('about-img');
    if (aboutImg) {
      const sectionOffset = aboutImg.parentElement.offsetTop;
      const relativeScroll = (scrollPos - sectionOffset) * 0.1;
      aboutImg.style.transform = `translateY(${relativeScroll}px)`;
    }

    document.querySelectorAll('.portfolio-item').forEach(container => {
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Parallax for image inside
        const img = container.querySelector('img');
        if (img) {
          const offset = (window.innerHeight - rect.top) * 0.05;
          img.style.setProperty('--parallax', `-${offset}px`);
        }
        
        // Clean fallback to remove any inline transforms left over
        container.style.transform = '';
        container.style.zIndex = '';
      }
    });
  });

  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

window.initBalancedMasonry = function() {
  const grid = document.querySelector('.masonry-grid');
  if (!grid) return;

  // Don't re-run or double-balance if already captured original list
  if (!grid.originalItems) {
    grid.originalItems = Array.from(grid.querySelectorAll('.gallery-item'));
  }

  const items = grid.originalItems;
  if (!items || items.length === 0) return;

  // Determine cols Count based on viewport width
  let colsCount = 3;
  if (window.innerWidth <= 640) {
    colsCount = 1;
  } else if (window.innerWidth <= 1024) {
    colsCount = 2;
  }

  // Clear existing items/columns
  grid.innerHTML = '';
  grid.style.display = 'flex';
  grid.style.gap = '1.5rem';
  grid.style.alignItems = 'start';
  grid.style.width = '100%';

  // Create columns with height trackers
  const cols = [];
  const colHeights = [];
  for (let i = 0; i < colsCount; i++) {
    const colDiv = document.createElement('div');
    colDiv.className = 'masonry-col';
    colDiv.style.flex = '1';
    colDiv.style.display = 'flex';
    colDiv.style.flexDirection = 'column';
    colDiv.style.gap = '1.5rem';
    colDiv.style.minWidth = '0'; // Prevent overflow
    grid.appendChild(colDiv);
    cols.push(colDiv);
    colHeights.push(0);
  }

  // Distribute items using a Greedy Height Balancing Algorithm (zero image cropping)
  items.forEach((item, index) => {
    // Reset any inline gridColumn styles from the previous version
    item.style.gridColumn = '';
    item.style.marginBottom = '';

    // Calculate relative aspect ratio height (height relative to width)
    let ratioVal = 1.33; // Default portrait ratio
    const aspectStyle = item.style.aspectRatio;
    if (aspectStyle) {
      const parts = aspectStyle.split('/');
      if (parts.length === 2) {
        const w = parseFloat(parts[0]);
        const h = parseFloat(parts[1]);
        if (w > 0 && h > 0) {
          ratioVal = h / w;
        }
      }
    }

    let minColIdx = 0;
    if (index < 9) {
      // Force sequential distribution for the first 3 rows to preserve design layout
      minColIdx = index % colsCount;
    } else {
      // Find the shortest column at this instant
      let minColHeight = colHeights[0];
      for (let i = 1; i < colsCount; i++) {
        if (colHeights[i] < minColHeight) {
          minColHeight = colHeights[i];
          minColIdx = i;
        }
      }
    }

    // Append to the designated/shortest column
    cols[minColIdx].appendChild(item);

    // Accumulate the height (ratioVal plus relative vertical gap size)
    colHeights[minColIdx] += ratioVal + 0.15;
  });
};

function handlePageLoad() {
  globalCleanup();
  initGlobalListeners();
  
  const preloader = document.getElementById('preloader');
  if (preloader && !window.preloaderFired) {
    window.preloaderFired = true;
    window.preloaderActivePlaying = true;
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('preloader-active');
      window.preloaderActivePlaying = false;
      setTimeout(() => {
        if (window.revealSections) window.revealSections();
      }, 500);
    }, 5500);
  } else if (preloader && !window.preloaderActivePlaying) {
      preloader.style.display = 'none';
      document.body.classList.remove('preloader-active');
  }
  
  window.initBalancedMasonry();
  window.revealSections();
}

document.addEventListener('astro:page-load', handlePageLoad);

// Execute deterministically on first script evaluation lock.
handlePageLoad();

// Resize observer/event to re-balance columns gracefully
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (document.querySelector('.masonry-grid')) {
      window.initBalancedMasonry();
    }
  }, 100);
});

/* Smooth scroll removed in favor of Lenis engine in Layout.astro */

