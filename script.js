document.addEventListener('DOMContentLoaded', () => {

  // ── References ─────────────────────────────────────────────────
  const canvasRoot      = document.getElementById('canvas-root');
  const canvasWrapper   = document.getElementById('canvas-wrapper');
  const canvasContainer = document.getElementById('canvas-container');
  const drawer          = document.getElementById('drawer-panel');

  // ── Constants ──────────────────────────────────────────────────
  const DESIGN_W   = 1540;   // total canvas width
  const CONTENT_W  = 1540;
  const DESIGN_H   = 1080;

  let drawerOpen = false;
  let zoomMultiplier = 1.0;

  // ── Scale + Clip canvas ─────────────────────────────────────────
  function applyLayout() {
    if (!canvasRoot || !canvasWrapper) return;

    // Update wrapper width dynamically based on drawer state
    canvasWrapper.style.width    = drawerOpen ? 'calc(100% - 360px)' : '100%';
    canvasWrapper.style.height   = '100%';
    canvasWrapper.style.overflow = drawerOpen ? 'hidden' : 'auto';

    const vw    = canvasWrapper.clientWidth;

    // Calculate scale to fit viewport width (with spacing accounted for)
    const baseScale = (vw - 48 - 4) / DESIGN_W;

    const scale = baseScale * zoomMultiplier;

    // Calculate translation offsets to maintain constant 4px spacing from top navbar and left sidebar
    const xOffset = 48 * (1 - scale) + 4; // 48px is fixed sidebar width, 4px spacing
    const yOffset = 56 * (1 - scale) + 4; // 56px is fixed navbar height, 4px spacing

    // Apply scale, translation, and width to canvas-root
    canvasRoot.style.width           = DESIGN_W + 'px';
    canvasRoot.style.transform       = `translate(${xOffset}px, ${yOffset}px) scale(${scale})`;
    canvasRoot.style.transformOrigin = 'top left';

    // Set canvas-container layout size to match scaled size so scroll bounds are accurate
    if (canvasContainer) {
      canvasContainer.style.width  = Math.ceil(DESIGN_W * scale + xOffset) + 'px';
      canvasContainer.style.height = Math.ceil(DESIGN_H * scale + yOffset) + 'px';
    }
  }

  applyLayout();
  window.addEventListener('resize', applyLayout);

  // ── Zoom Controls ────────────────────────────────────────────────
  const zoomIn = document.getElementById('zoom-in');
  const zoomOut = document.getElementById('zoom-out');
  const zoomText = document.getElementById('zoom-text');

  function updateZoom(newZoom) {
    // Clamp zoom multiplier between 0.5 (50%) and 3.0 (300%)
    zoomMultiplier = Math.max(0.5, Math.min(3.0, newZoom));
    
    const pct = Math.round(zoomMultiplier * 100) + '%';
    if (zoomText) zoomText.textContent = pct;

    applyLayout();
  }

  if (zoomIn) {
    zoomIn.addEventListener('click', e => {
      e.stopPropagation();
      updateZoom(zoomMultiplier + 0.1);
    });
  }
  if (zoomOut) {
    zoomOut.addEventListener('click', e => {
      e.stopPropagation();
      updateZoom(zoomMultiplier - 0.1);
    });
  }

  // ── Drag-to-Pan (Mouse & Touch) ─────────────────────────────────
  let isDown = false;
  let startX, startY;
  let scrollLeft, scrollTop;

  if (canvasWrapper) {
    canvasWrapper.style.cursor = 'grab';

    canvasWrapper.addEventListener('mousedown', (e) => {
      // Don't drag if clicking zoom controls, the drawer, the fixed navbar, fixed sidebar, or clickable nodes
      if (e.target.closest('#fixed-zoom-controls') || e.target.closest('#drawer-panel') || e.target.closest('.cursor-pointer') || e.target.closest('[data-name="Background+HorizontalBorder"]') || e.target.closest('[data-name="Nav"]')) {
        return;
      }
      isDown = true;
      canvasWrapper.style.cursor = 'grabbing';
      startX = e.pageX - canvasWrapper.offsetLeft;
      startY = e.pageY - canvasWrapper.offsetTop;
      scrollLeft = canvasWrapper.scrollLeft;
      scrollTop = canvasWrapper.scrollTop;
    });

    canvasWrapper.addEventListener('mouseleave', () => {
      isDown = false;
      canvasWrapper.style.cursor = 'grab';
    });

    canvasWrapper.addEventListener('mouseup', () => {
      isDown = false;
      canvasWrapper.style.cursor = 'grab';
    });

    canvasWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - canvasWrapper.offsetLeft;
      const y = e.pageY - canvasWrapper.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      canvasWrapper.scrollLeft = scrollLeft - walkX;
      canvasWrapper.scrollTop = scrollTop - walkY;
    });

    // Touch support for mobile devices
    canvasWrapper.addEventListener('touchstart', (e) => {
      if (e.target.closest('#fixed-zoom-controls') || e.target.closest('#drawer-panel') || e.target.closest('.cursor-pointer') || e.target.closest('[data-name="Background+HorizontalBorder"]') || e.target.closest('[data-name="Nav"]')) {
        return;
      }
      isDown = true;
      startX = e.touches[0].pageX - canvasWrapper.offsetLeft;
      startY = e.touches[0].pageY - canvasWrapper.offsetTop;
      scrollLeft = canvasWrapper.scrollLeft;
      scrollTop = canvasWrapper.scrollTop;
    }, { passive: true });

    canvasWrapper.addEventListener('touchend', () => {
      isDown = false;
    });

    canvasWrapper.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - canvasWrapper.offsetLeft;
      const y = e.touches[0].pageY - canvasWrapper.offsetTop;
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;
      canvasWrapper.scrollLeft = scrollLeft - walkX;
      canvasWrapper.scrollTop = scrollTop - walkY;
    }, { passive: true });
  }

  // ── Hide drawer on load ─────────────────────────────────────────
  if (drawer) drawer.style.display = 'none';

  // ── Open ────────────────────────────────────────────────────────
  function openDrawer() {
    if (!drawer) return;
    drawerOpen = true;
    drawer.style.display = 'flex';
    
    // Keep zoom controls fixed at default position

    // Small timeout to allow transition to register
    setTimeout(() => {
      drawer.classList.remove('translate-x-full');
    }, 10);
    applyLayout();
  }

  // ── Close ───────────────────────────────────────────────────────
  function closeDrawer() {
    if (!drawer) return;
    drawerOpen = false;
    drawer.classList.add('translate-x-full');
    
    // Keep zoom controls fixed at default position

    // Hide drawer completely only after transition ends
    const handleTransition = (e) => {
      if (e.propertyName === 'transform') {
        if (!drawerOpen) {
          drawer.style.display = 'none';
        }
        drawer.removeEventListener('transitionend', handleTransition);
      }
    };
    drawer.addEventListener('transitionend', handleTransition);
    applyLayout();
  }

  // ── × Close Button ──────────────────────────────────────────────
  const closeBtn = document.getElementById('drawer-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', e => {
      e.stopPropagation();
      closeDrawer();
    });
  }

  // ── Populate drawer ─────────────────────────────────────────────
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function populateDrawer(key) {
    const d = (typeof stepsData !== 'undefined') ? stepsData[key] : null;
    if (!d) {
      setText('drawer-title',           'Process Details');
      setText('drawer-step-name',       key);
      setText('drawer-objective',       'No info available.');
      setText('drawer-description',     '');
      setText('drawer-additional-info', '');
      setText('drawer-badge',           key);
      return;
    }
    setText('drawer-title',           'Process Details');
    setText('drawer-step-name',       d.stepName       || key);
    setText('drawer-objective',       d.objective      || '');
    setText('drawer-description',     d.description    || '');
    setText('drawer-additional-info', d.additionalInfo || '');
    setText('drawer-badge',           d.badge          || key);
  }

  // ── Step key from node ──────────────────────────────────────────
  function getStepKey(node) {
    const p = node.querySelector('p');
    if (p && typeof stepsData !== 'undefined') {
      const t = p.textContent.trim();
      if (stepsData[t] !== undefined) return t;
    }
    return null;
  }

  // ── Click events ────────────────────────────────────────────────
  document.querySelectorAll('.cursor-pointer').forEach(node => {
    node.addEventListener('click', () => {
      const key = getStepKey(node);
      if (key) { populateDrawer(key); openDrawer(); }
    });
  });

  closeDrawer();
});
