// ─────────────────────────────────────────────
// FLOORS — add/edit entries to match your S3 paths
// ─────────────────────────────────────────────
const FLOORS = [
  { label: 'Aerial',  baseUrl: 'https://apt-hsim-models.s3.eu-west-3.amazonaws.com/ParcDeLac/Aerial/', totalFrames: 60 },
  { label: 'Floor 1', baseUrl: 'https://apt-hsim-models.s3.eu-west-3.amazonaws.com/ParcDeLac/G1/',     totalFrames: 60 },
  { label: 'Floor 2', baseUrl: 'https://apt-hsim-models.s3.eu-west-3.amazonaws.com/ParcDeLac/G2/',     totalFrames: 60 },
  { label: 'Floor 3', baseUrl: 'https://apt-hsim-models.s3.eu-west-3.amazonaws.com/ParcDeLac/G3/',     totalFrames: 60 },
  { label: 'Floor 4', baseUrl: 'https://apt-hsim-models.s3.eu-west-3.amazonaws.com/ParcDeLac/G4/',     totalFrames: 60 },
];

// ─────────────────────────────────────────────
// SHARED CONFIG
// ─────────────────────────────────────────────
const CONFIG = {
  // Filename pattern — {index} replaced with zero-padded frame number
  filePattern: '{index}.png',

  // 4-digit zero-padding: 0001, 0002 ...
  padDigits: 4,

  // Pixels of horizontal drag needed to advance one frame
  dragSensitivity: 6,

  // Auto-spin: full rotation duration in milliseconds (higher = slower)
  spinDuration: 18000,

  // Number of frames to preload before showing the viewer
  preloadCount: 8,

  // Frames that should be decoded before swapping to a newly selected floor
  floorSwitchMinFrames: 2,

  // Max simultaneous image fetches (adapted to network quality)
  concurrentLoads: (() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return 8;
    if (conn.saveData) return 4;
    const type = (conn.effectiveType || '').toLowerCase();
    if (type.includes('2g')) return 3;
    if (type.includes('3g')) return 5;
    return 8;
  })(),
};
// ─────────────────────────────────────────────

// ── Per-floor image state ──────────────────────
// All floors are loaded simultaneously; switching just changes the active set.
const floorImages = FLOORS.map(() => []);    // floorImages[fi][frameIdx] = HTMLImageElement
const floorLoaded = FLOORS.map(() => 0);     // loaded frame count per floor
const floorReady  = FLOORS.map(() => false); // true once >= preloadCount frames are loaded

// ── Viewer state ──────────────────────────────
let currentFloor  = 0;
let currentFrame  = 0;
let autoSpin      = false;
let spinRafId     = null;
let spinLastTime  = null;
let spinProgress  = 0;   // fractional frame accumulator

// ── Global image cache & loading queue ────────
const imageCache  = {};  // URL → HTMLImageElement (shared across all floors)
let   loadQueue   = [];  // [{floorIdx, frameIdx, path, priority}]
let   activeLoads = 0;   // number of in-flight requests
let   pendingFloorSwitch = null;

// ── Drag / pan state ──────────────────────────
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragAccum  = 0;
let didDrag    = false;

// Zoom / pan state
let zoomScale  = 1;
let panX       = 0;
let panY       = 0;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

// Multi-pointer tracking (pinch)
const activePointers = new Map();
let lastPinchDist = 0;

const spinImg      = document.getElementById('spin-img');
const spinBtn      = document.getElementById('spin-btn');
const frameCounter = document.getElementById('frame-counter');
const container    = document.getElementById('spin-container');
const floorBtns    = document.querySelectorAll('.floor-btn');
const polyCanvas   = document.getElementById('poly-canvas');
const polyCtx      = polyCanvas.getContext('2d');
const compassNeedle  = document.getElementById('compass-needle');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingBar     = document.getElementById('loading-bar');
const loadingStatus  = document.getElementById('loading-status');

// ── Polygon overlay data (Floor 4) ────────────
let polyData        = null;
let currentPolyPath = null;  // Path2D for hit-testing

// ── DOM ref ───────────────────────────────────
const aptWidget = document.getElementById('apt-widget');

function circularDistance(a, b, total) {
  const diff = Math.abs(a - b);
  return Math.min(diff, total - diff);
}

function updateViewerImage(src, floorTransition = false) {
  if (!src || spinImg.src === src) return;
  if (floorTransition) spinImg.classList.add('floor-switching');
  spinImg.src = src;
  if (floorTransition) {
    setTimeout(() => spinImg.classList.remove('floor-switching'), 170);
  }
}

// ── Helpers ──────────────────────────────────

function frameSrc(index, floor) {
  const padded = String(index + 1).padStart(CONFIG.padDigits, '0');
  return floor.baseUrl + CONFIG.filePattern.replace('{index}', padded);
}

function showFrame(index) {
  const total = FLOORS[currentFloor].totalFrames;
  currentFrame = ((index % total) + total) % total;
  const img = floorImages[currentFloor][currentFrame];
  if (img && img.complete) {
    updateViewerImage(img.src);
  }
  drawPolygon();
  // Rotate compass needle opposite to spin direction
  const deg = -(currentFrame / total) * 360;
  compassNeedle.setAttribute('transform', `rotate(${deg} 40 40)`);
}

function showLoadingOverlay(pct) {
  loadingBar.style.width = pct + '%';
  loadingStatus.textContent = pct >= 100 ? 'Ready' : `Loading… ${pct}%`;
  loadingOverlay.classList.remove('hidden');
}

function hideLoadingOverlay() {
  loadingBar.style.width = '100%';
  loadingStatus.textContent = 'Ready';
  setTimeout(() => loadingOverlay.classList.add('hidden'), 400);
}

function onFrameLoaded(floorIdx) {
  floorLoaded[floorIdx]++;
  // Update loading progress bar for the active floor
  if (floorIdx === currentFloor && !floorReady[floorIdx]) {
    const pct = Math.min(100, Math.round(floorLoaded[floorIdx] / CONFIG.preloadCount * 100));
    loadingBar.style.width = pct + '%';
    loadingStatus.textContent = `Loading… ${pct}%`;
  }
  if (!floorReady[floorIdx] && floorLoaded[floorIdx] >= CONFIG.preloadCount) {
    floorReady[floorIdx] = true;
    // If this is the currently active floor, reveal the viewer
    if (floorIdx === currentFloor) {
      showFrame(currentFrame);
      hideLoadingOverlay();
    }
  }

  if (
    pendingFloorSwitch === floorIdx &&
    floorLoaded[floorIdx] >= CONFIG.floorSwitchMinFrames
  ) {
    const img = floorImages[floorIdx][currentFrame];
    if (img && img.complete) {
      updateViewerImage(img.src, true);
      if (floorReady[floorIdx]) {
        pendingFloorSwitch = null;
        hideLoadingOverlay();
      }
    }
  }
}

// ── Zoom helpers ──────────────────────────────────

function applyTransform() {
  const t = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
  spinImg.style.transform    = t;
  polyCanvas.style.transform = t;
}

function clampPan() {
  if (zoomScale <= 1) { panX = 0; panY = 0; return; }
  const hw = container.clientWidth  * (zoomScale - 1) / (2 * zoomScale);
  const hh = container.clientHeight * (zoomScale - 1) / (2 * zoomScale);
  panX = Math.max(-hw, Math.min(hw, panX));
  panY = Math.max(-hh, Math.min(hh, panY));
}

function zoomAt(screenX, screenY, factor) {
  const rect = container.getBoundingClientRect();
  const rx = screenX - rect.left - rect.width  / 2;
  const ry = screenY - rect.top  - rect.height / 2;
  const newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomScale * factor));
  panX = rx - (rx - panX) * newScale / zoomScale;
  panY = ry - (ry - panY) * newScale / zoomScale;
  zoomScale = newScale;
  clampPan();
  applyTransform();
}

function resetZoom() {
  zoomScale = 1; panX = 0; panY = 0;
  applyTransform();
}

// ── Priority-based loader ─────────────────────

function launchLoad() {
  while (activeLoads < CONFIG.concurrentLoads && loadQueue.length > 0) {
    const item = loadQueue.shift();

    // Already cached — count it immediately and continue
    if (imageCache[item.path]) {
      floorImages[item.floorIdx][item.frameIdx] = imageCache[item.path];
      onFrameLoaded(item.floorIdx);
      continue;
    }

    // Already has an in-flight Image element — skip (onload will handle it)
    if (floorImages[item.floorIdx][item.frameIdx]) continue;

    activeLoads++;
    const img = new Image();
    img.decoding = 'async';
    img.fetchPriority = item.priority >= 6000 ? 'high' : 'auto';
    img.src = item.path;
    floorImages[item.floorIdx][item.frameIdx] = img;

    // img.decode() waits for decode off the main thread; falls back to onload on older browsers
    (img.decode ? img.decode() : new Promise((res, rej) => { img.onload = res; img.onerror = rej; }))
      .then(() => {
        activeLoads--;
        imageCache[item.path] = img;
        onFrameLoaded(item.floorIdx);
        launchLoad();
      })
      .catch(() => {
        activeLoads--;
        onFrameLoaded(item.floorIdx);
        launchLoad();
      });
  }
}

function reprioritize(pivot) {
  // Boost current-floor frames nearest to the current drag position
  const total = FLOORS[currentFloor].totalFrames;
  loadQueue.forEach(item => {
    if (item.floorIdx === currentFloor) {
      item.priority = 2500 + (total - circularDistance(item.frameIdx, pivot, total));
    }
  });
  loadQueue.sort((a, b) => b.priority - a.priority);
  launchLoad();
}

function queueFloorFrames(floorIdx, pivot, boost) {
  const floor = FLOORS[floorIdx];
  const total = floor.totalFrames;

  for (let i = 0; i < total; i++) {
    if (floorImages[floorIdx][i]) continue;
    if (loadQueue.some(item => item.floorIdx === floorIdx && item.frameIdx === i)) continue;

    const dist = circularDistance(i, pivot, total);
    let priority = boost + (total - dist);
    if (dist < CONFIG.preloadCount) priority += 400;

    loadQueue.push({
      floorIdx,
      frameIdx: i,
      path: frameSrc(i, floor),
      priority
    });
  }
}

function preloadAllFloors() {
  loadQueue = [];

  for (let fi = 0; fi < FLOORS.length; fi++) {
    const floor = FLOORS[fi];
    for (let i = 0; i < floor.totalFrames; i++) {
      const path = frameSrc(i, floor);
      if (imageCache[path]) {
        // Already in cache (e.g. page revisit)
        floorImages[fi][i] = imageCache[path];
        onFrameLoaded(fi);
      }
    }
  }

  queueFloorFrames(currentFloor, currentFrame, 5000);
  for (let fi = 0; fi < FLOORS.length; fi++) {
    if (fi === currentFloor) continue;
    queueFloorFrames(fi, currentFrame, 400);
  }

  loadQueue.sort((a, b) => b.priority - a.priority);
  launchLoad();
}

// ── Floor switching ───────────────────────────

function switchFloor(floorIndex) {
  if (floorIndex === currentFloor) return;
  const previousFloor = currentFloor;
  currentFloor = floorIndex;
  pendingFloorSwitch = floorIndex;
  drawPolygon(); // clear or redraw immediately for the new floor

  // Update button states
  floorBtns.forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.floor) === floorIndex));

  stopSpin();
  resetZoom();

  // Aggressively prioritize frames around current angle for the target floor
  queueFloorFrames(floorIndex, currentFrame, 7000);
  loadQueue.forEach(item => {
    if (item.floorIdx === floorIndex) {
      const total = FLOORS[floorIndex].totalFrames;
      item.priority = Math.max(item.priority, 7000 + (total - circularDistance(item.frameIdx, currentFrame, total)));
    }
  });
  loadQueue.sort((a, b) => b.priority - a.priority);
  launchLoad();

  const targetImg = floorImages[floorIndex][currentFrame];
  if (targetImg && targetImg.complete) {
    updateViewerImage(targetImg.src, true);
    pendingFloorSwitch = null;
    return;
  }

  // Keep previous floor visible until the target floor has enough decoded frames.
  currentFloor = previousFloor;
  showFrame(currentFrame);
  currentFloor = floorIndex;

  if (floorLoaded[floorIndex] < CONFIG.floorSwitchMinFrames) {
    showLoadingOverlay(Math.min(95, Math.round((floorLoaded[floorIndex] / CONFIG.preloadCount) * 100)));
  }

  // If already ready, swap immediately.
  if (floorReady[floorIndex]) {
    const readyImg = floorImages[floorIndex][currentFrame];
    if (readyImg && readyImg.complete) {
      updateViewerImage(readyImg.src, true);
      pendingFloorSwitch = null;
      hideLoadingOverlay();
    }
  }
}

floorBtns.forEach((btn) => {
  btn.addEventListener('click', () => switchFloor(parseInt(btn.dataset.floor)));
});

// ── Auto-spin ────────────────────────────────

function spinStep(timestamp) {
  if (!autoSpin) return;
  if (spinLastTime === null) spinLastTime = timestamp;
  const delta = timestamp - spinLastTime;
  spinLastTime = timestamp;

  const total = FLOORS[currentFloor].totalFrames;
  spinProgress += (delta / CONFIG.spinDuration) * total;
  if (spinProgress >= 1) {
    const steps = Math.floor(spinProgress);
    spinProgress -= steps;
    showFrame(currentFrame + steps);
  }
  spinRafId = requestAnimationFrame(spinStep);
}

function startSpin() {
  if (autoSpin) return;
  autoSpin = true;
  spinLastTime = null;
  spinProgress = 0;
  spinRafId = requestAnimationFrame(spinStep);
  if (spinBtn) { spinBtn.classList.add('active'); spinBtn.textContent = '⏸ Stop'; }
}

function stopSpin() {
  if (spinRafId) { cancelAnimationFrame(spinRafId); spinRafId = null; }
  spinLastTime = null;
  autoSpin = false;
  if (spinBtn) { spinBtn.classList.remove('active'); spinBtn.textContent = '⟳ Auto'; }
}

if (spinBtn) spinBtn.addEventListener('click', () => {
  autoSpin ? stopSpin() : startSpin();
});

// ── Drag / Pinch / Pan ────────────────────────────

container.addEventListener('pointerdown', (e) => {
  if (e.target.closest('#floor-selector')) return;
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  container.setPointerCapture(e.pointerId);

  if (activePointers.size === 1) {
    if (!floorReady[currentFloor]) return;
    isDragging = true;
    didDrag    = false;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragAccum  = 0;
    stopSpin();
    container.classList.add('dragging');
  } else if (activePointers.size === 2) {
    isDragging = false;
    container.classList.remove('dragging');
    const pts = [...activePointers.values()];
    lastPinchDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  }
});

container.addEventListener('pointermove', (e) => {
  if (!activePointers.has(e.pointerId)) return;
  activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (activePointers.size === 2) {
    const pts = [...activePointers.values()];
    const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
    const midX = (pts[0].x + pts[1].x) / 2;
    const midY = (pts[0].y + pts[1].y) / 2;
    if (lastPinchDist > 0) zoomAt(midX, midY, dist / lastPinchDist);
    lastPinchDist = dist;
    return;
  }

  if (!isDragging) return;
  const dx = e.clientX - dragStartX;
  const dy = e.clientY - dragStartY;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag = true;

  if (zoomScale > 1) {
    panX += dx;
    panY += dy;
    clampPan();
    applyTransform();
  } else {
    dragAccum += dx;
    const steps = Math.trunc(dragAccum / CONFIG.dragSensitivity);
    if (steps !== 0) {
      showFrame(currentFrame - steps);
      dragAccum -= steps * CONFIG.dragSensitivity;
      reprioritize(currentFrame);
    }
  }
});

container.addEventListener('pointerup', (e) => {
  activePointers.delete(e.pointerId);
  if (activePointers.size < 2) lastPinchDist = 0;
  if (activePointers.size === 0) {
    isDragging = false;
    container.classList.remove('dragging');
    setTimeout(() => { didDrag = false; }, 0);
  }
});

container.addEventListener('pointercancel', (e) => {
  activePointers.delete(e.pointerId);
  if (activePointers.size < 2) lastPinchDist = 0;
  if (activePointers.size === 0) {
    isDragging = false;
    container.classList.remove('dragging');
    setTimeout(() => { didDrag = false; }, 0);
  }
});

// ── Wheel zoom ──────────────────────────────────────

container.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoomAt(e.clientX, e.clientY, e.deltaY < 0 ? 1.12 : 1 / 1.12);
}, { passive: false });

// Double-click / double-tap to reset zoom
container.addEventListener('dblclick', (e) => {
  if (e.target.closest('#floor-selector')) return;
  resetZoom();
});

// ── Keyboard ─────────────────────────────────

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  { stopSpin(); showFrame(currentFrame - 1); reprioritize(currentFrame); }
  if (e.key === 'ArrowRight') { stopSpin(); showFrame(currentFrame + 1); reprioritize(currentFrame); }
});

// ── Polygon overlay ─────────────────────────

function resizeCanvas() {
  polyCanvas.width  = container.clientWidth;
  polyCanvas.height = container.clientHeight;
  drawPolygon();
}

function drawPolygon() {
  polyCtx.clearRect(0, 0, polyCanvas.width, polyCanvas.height);
  currentPolyPath = null;

  // Only draw on Floor 4
  if (currentFloor !== 4 || !polyData) return;

  // JSON keys are 1-based (frame 1 = index 0)
  const frameKey = String(currentFrame + 1);
  const points   = polyData[frameKey];
  if (!points || points.length < 3) return;

  // Need the image's natural dimensions to map coordinates
  const img = floorImages[currentFloor][currentFrame];
  if (!img || !img.naturalWidth) return;

  const cw = polyCanvas.width;
  const ch = polyCanvas.height;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  // Map image-space coords → canvas coords (object-fit: contain)
  const scale   = Math.min(cw / iw, ch / ih);
  const offsetX = (cw - iw * scale) / 2;
  const offsetY = (ch - ih * scale) / 2;

  const path = new Path2D();
  points.forEach((pt, i) => {
    const cx = offsetX + pt.x * scale;
    const cy = offsetY + pt.y * scale;
    if (i === 0) path.moveTo(cx, cy);
    else         path.lineTo(cx, cy);
  });
  path.closePath();
  currentPolyPath = path;

  polyCtx.fillStyle   = 'rgba(30, 100, 220, 0.35)';
  polyCtx.fill(path);
  polyCtx.strokeStyle = 'rgba(50, 140, 255, 0.85)';
  polyCtx.lineWidth   = 2;
  polyCtx.stroke(path);
}

// ── Apartment widget ────────────────────────

function showWidget(screenX, screenY) {
  aptWidget.classList.remove('hidden');
  const ww = aptWidget.offsetWidth  || 210;
  const wh = aptWidget.offsetHeight || 165;
  let left = screenX + 16;
  let top  = screenY - Math.round(wh / 2);
  if (left + ww > window.innerWidth  - 8) left = screenX - ww - 16;
  if (top  < 8)                           top  = 8;
  if (top  + wh > window.innerHeight - 8) top  = window.innerHeight - wh - 8;
  aptWidget.style.left = left + 'px';
  aptWidget.style.top  = top  + 'px';
}

function hideWidget() {
  aptWidget.classList.add('hidden');
}

document.getElementById('apt-widget-close').addEventListener('click', hideWidget);

container.addEventListener('click', (e) => {
  if (e.target.closest('#floor-selector')) return;
  if (didDrag) return;
  if (currentFloor !== 4 || !currentPolyPath) { hideWidget(); return; }

  // Convert screen coords → canvas pixel coords (undo CSS transform)
  const rect = container.getBoundingClientRect();
  const cw   = polyCanvas.width;
  const ch   = polyCanvas.height;
  const sx   = e.clientX - rect.left;
  const sy   = e.clientY - rect.top;
  const cx   = (sx - panX - cw / 2) / zoomScale + cw / 2;
  const cy   = (sy - panY - ch / 2) / zoomScale + ch / 2;

  if (polyCtx.isPointInPath(currentPolyPath, cx, cy)) {
    showWidget(e.clientX, e.clientY);
  } else {
    hideWidget();
  }
});

// ── Cursor: pointer when hovering the polygon on Floor 4 ──
container.addEventListener('pointermove', (e) => {
  if (activePointers.size !== 1 || !isDragging) {
    if (currentFloor === 4 && currentPolyPath) {
      const rect = container.getBoundingClientRect();
      const cw   = polyCanvas.width;
      const ch   = polyCanvas.height;
      const sx   = e.clientX - rect.left;
      const sy   = e.clientY - rect.top;
      const cx   = (sx - panX - cw / 2) / zoomScale + cw / 2;
      const cy   = (sy - panY - ch / 2) / zoomScale + ch / 2;
      container.style.cursor = polyCtx.isPointInPath(currentPolyPath, cx, cy)
        ? 'pointer' : '';
    } else {
      container.style.cursor = '';
    }
  }
}, { passive: true });

async function loadPolyData() {
  try {
    const res  = await fetch('poly_projections.json');
    polyData   = await res.json();
    drawPolygon();
  } catch (e) {
    console.warn('Could not load poly_projections.json', e);
  }
}

window.addEventListener('resize', resizeCanvas);

// ── Start ────────────────────────────────────

resizeCanvas();
loadPolyData();
preloadAllFloors();

// ── 2D Plan modal ─────────────────────────────
const plan2dModal   = document.getElementById('plan2d-modal');
const plan2dClose   = document.getElementById('plan2d-close');
const plan2dBackdrop = document.getElementById('plan2d-backdrop');

function openPlan2d() { plan2dModal.classList.remove('hidden'); }
function closePlan2d() { plan2dModal.classList.add('hidden'); }

document.querySelector('.apt-widget-btn--2d').addEventListener('click', openPlan2d);
plan2dClose.addEventListener('click', closePlan2d);
plan2dBackdrop.addEventListener('click', closePlan2d);

// ── 3D Plan modal ─────────────────────────────
const plan3dModal    = document.getElementById('plan3d-modal');
const plan3dClose    = document.getElementById('plan3d-close');
const plan3dBackdrop = document.getElementById('plan3d-backdrop');

function openPlan3d() { plan3dModal.classList.remove('hidden'); }
function closePlan3d() { plan3dModal.classList.add('hidden'); }

document.querySelector('.apt-widget-btn--3d').addEventListener('click', openPlan3d);
plan3dClose.addEventListener('click', closePlan3d);
plan3dBackdrop.addEventListener('click', closePlan3d);

// ── Visite 3D Temps Réel modal ─────────────────────
const visiterTModal    = document.getElementById('visitert-modal');
const visiterTClose    = document.getElementById('visitert-close');
const visiterTBackdrop = document.getElementById('visitert-backdrop');
const visiterTIframe   = document.getElementById('visitert-iframe');

function openVisiterT() {
  window.location.href = 'visite-3d-temps-reel.html';
}
function closeVisiterT() {
  visiterTModal.classList.add('hidden');
  // Reset src to stop the 3D engine when closed
  visiterTIframe.src = 'about:blank';
}

document.querySelector('.apt-widget-btn--rt').addEventListener('click', openVisiterT);
visiterTClose.addEventListener('click', closeVisiterT);
visiterTBackdrop.addEventListener('click', closeVisiterT);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePlan2d();
    closePlan3d();
    closeVisiterT();
    document.getElementById('chatbot-panel').classList.remove('chatbot-open');
  }
});

// ── CHATBOT ─────────────────────────────────────────────────────────────────

const CHAT_APARTMENTS = [
  { id: 'A101', floor: 'RDC', rooms: 2, surface: 65,  price: 250000, status: 'available', view: 'Garden',          features: ['Parking', 'Storage'] },
  { id: 'A102', floor: 'RDC', rooms: 3, surface: 88,  price: 320000, status: 'sold',      view: 'Garden',          features: ['Parking', 'Storage', 'Terrace'] },
  { id: 'A201', floor: 'R+1', rooms: 2, surface: 65,  price: 270000, status: 'available', view: 'Lake',            features: ['Parking', 'Balcony'] },
  { id: 'A202', floor: 'R+1', rooms: 3, surface: 85,  price: 355000, status: 'available', view: 'Lake',            features: ['Parking', 'Storage', 'Balcony'] },
  { id: 'A301', floor: 'R+2', rooms: 2, surface: 65,  price: 285000, status: 'reserved',  view: 'Lake',            features: ['Parking', 'Balcony'] },
  { id: 'A302', floor: 'R+2', rooms: 3, surface: 85,  price: 375000, status: 'available', view: 'Lake',            features: ['Parking', 'Storage', 'Balcony'] },
  { id: 'A303', floor: 'R+2', rooms: 4, surface: 112, price: 460000, status: 'available', view: 'Panoramic',       features: ['Parking ×2', 'Storage', 'Balcony'] },
  { id: 'A401', floor: 'R+3', rooms: 3, surface: 88,  price: 395000, status: 'available', view: 'Panoramic',       features: ['Parking', 'Storage', 'Terrace'] },
  { id: 'A402', floor: 'R+3', rooms: 4, surface: 112, price: 490000, status: 'reserved',  view: 'Panoramic',       features: ['Parking ×2', 'Storage', 'Terrace'] },
  { id: 'PH01', floor: 'R+3', rooms: 5, surface: 165, price: 650000, status: 'available', view: 'Panoramic 360°',  features: ['Parking ×2', 'Storage', 'Roof Terrace', 'Private Pool'] },
];

function chatFmtPrice(p) {
  return p.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function chatBuildCards(apts) {
  return apts.map(a => `
    <div class="chat-apt-card">
      <div class="chat-apt-id">${a.id} &mdash; ${a.floor}</div>
      <div class="chat-apt-detail">
        &#127760; ${a.rooms} rooms &nbsp;&#183;&nbsp; ${a.surface}\u202fm&sup2;<br>
        &#128176; ${chatFmtPrice(a.price)}<br>
        &#127774; ${a.view}<br>
        &#10003; ${a.features.join(' &middot; ')}
      </div>
      <span class="chat-apt-status status-${a.status}">${a.status}</span>
    </div>`).join('');
}

function chatbotGetReply(input) {
  const q = input.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|bonjour|salut|good\s*(morning|afternoon|evening))/.test(q)) {
    return { text: 'Hello! 👋 I\'m the <strong>Parc de Lac</strong> apartment assistant. Ask me about available units, prices, floor plans, and more. What are you looking for?' };
  }

  // Thank you
  if (/thank|merci/.test(q)) {
    return { text: 'You\'re welcome! Feel free to ask anything else about Parc de Lac apartments.' };
  }

  // Contact / visit
  if (/contact|visit|tour|appointment|schedule|agent|call|phone/.test(q)) {
    return { text: 'To schedule a visit or speak with a sales agent:<br><br>&#128222; <strong>+212 5XX-XXX-XXX</strong><br>&#128140; <strong>contact@houseinmeta.com</strong><br><br>Our team will arrange a private tour of your preferred unit.' };
  }

  // About the project
  if (/what is|about|project|parc de lac|description|how many/.test(q)) {
    return { text: '<strong>Parc de Lac</strong> is a premium residential development with stunning lake &amp; panoramic views.<br><br>&#127970; Ground floor (RDC) to R+3 &mdash; <strong>10 apartments</strong><br>&#128197; 2-room to 5-room penthouse<br>&#128176; Starting from <strong>' + chatFmtPrice(850000) + '</strong>' };
  }

  // Penthouse
  if (/penthouse|ph01|ph 01/.test(q)) {
    const ph = CHAT_APARTMENTS.find(a => a.id === 'PH01');
    return { text: 'Here is our exclusive <strong>Penthouse</strong>:', cards: [ph] };
  }

  // Specific apartment by ID
  const idMatch = q.match(/\b(a\d{3}|ph\d{2})\b/);
  if (idMatch) {
    const apt = CHAT_APARTMENTS.find(a => a.id.toLowerCase() === idMatch[1]);
    if (apt) return { text: 'Details for <strong>' + apt.id + '</strong>:', cards: [apt] };
    return { text: 'Apartment <strong>' + idMatch[1].toUpperCase() + '</strong> not found. Available IDs: A101, A201, A202, A302, A303, A401, PH01.' };
  }

  // Budget / under X
  if (/under|less than|below|max budget|budget/.test(q)) {
    const numMatch = q.match(/[\d\s,]+/);
    if (numMatch) {
      const budget = parseInt(numMatch[0].replace(/[\s,]/g, ''));
      if (!isNaN(budget) && budget > 0) {
        const found = CHAT_APARTMENTS.filter(a => a.price <= budget && a.status === 'available');
        if (found.length === 0) return { text: 'No available apartments found under <strong>' + chatFmtPrice(budget) + '</strong>. Prices start from <strong>' + chatFmtPrice(850000) + '</strong>.' };
        return { text: 'Available apartments under <strong>' + chatFmtPrice(budget) + '</strong>:', cards: found };
      }
    }
  }

  // Prices
  if (/price|cost|how much|tarif|prix/.test(q)) {
    const avail  = CHAT_APARTMENTS.filter(a => a.status === 'available');
    const minP   = Math.min(...avail.map(a => a.price));
    const maxP   = Math.max(...avail.map(a => a.price));
    return {
      text: '&#128176; Prices for available units range from<br><strong>' + chatFmtPrice(minP) + '</strong> to <strong>' + chatFmtPrice(maxP) + '</strong> (Penthouse).',
      cards: avail,
    };
  }

  // Available apartments
  if (/available|free|open|vacant|disponible/.test(q)) {
    const avail = CHAT_APARTMENTS.filter(a => a.status === 'available');
    return { text: 'We currently have <strong>' + avail.length + ' available</strong> units:', cards: avail };
  }

  // Room count — e.g. "3 room", "3 bedroom", "3-room"
  const roomMatch = q.match(/(\d)[\s-]*(room|bed|bedroom|pi[eè]ce|chambre)/);
  if (roomMatch) {
    const count = parseInt(roomMatch[1]);
    const found = CHAT_APARTMENTS.filter(a => a.rooms === count && a.status === 'available');
    if (found.length === 0) return { text: 'No available <strong>' + count + '-room</strong> apartments right now. Try 2, 3, or 4-room units.' };
    return { text: 'Available <strong>' + count + '-room</strong> apartments:', cards: found };
  }

  // Floor queries
  const floorMap = [
    [/\b(ground|rdc|rez|floor\s*0)\b/, 'RDC'],
    [/\b(r\+1|floor\s*1|first\s*floor|1st)\b/, 'R+1'],
    [/\b(r\+2|floor\s*2|second\s*floor|2nd)\b/, 'R+2'],
    [/\b(r\+3|floor\s*3|third\s*floor|3rd|top\s*floor)\b/, 'R+3'],
  ];
  for (const [pattern, label] of floorMap) {
    if (pattern.test(q)) {
      const found = CHAT_APARTMENTS.filter(a => a.floor === label && a.status === 'available');
      if (found.length === 0) return { text: 'No available apartments on <strong>' + label + '</strong> currently.' };
      return { text: 'Available apartments on <strong>' + label + '</strong>:', cards: found };
    }
  }

  // Surface / size
  if (/surface|size|area|sqm|m2|m²|square|big|large|small|floor\s*plan/.test(q)) {
    const avail = CHAT_APARTMENTS.filter(a => a.status === 'available');
    return { text: 'Surfaces range from <strong>65 m²</strong> (2-room) to <strong>165 m²</strong> (Penthouse).', cards: avail };
  }

  // Lake / panoramic view
  if (/lake|water|view|vue|panoram/.test(q)) {
    const found = CHAT_APARTMENTS.filter(a => /lake|panoram/i.test(a.view) && a.status === 'available');
    if (found.length === 0) return { text: 'No lake or panoramic-view units available right now.' };
    return { text: 'Available apartments with lake / panoramic views:', cards: found };
  }

  // Parking
  if (/parking|garage|car\s*space/.test(q)) {
    return { text: '&#128663; All Parc de Lac apartments include at least <strong>1 parking space</strong>.<br>4-room &amp; penthouse units include <strong>2 parking spaces</strong>.' };
  }

  // Default fallback
  return {
    text: 'Here are some things you can ask me:<br><br>' +
      '&#8226; &ldquo;Show available apartments&rdquo;<br>' +
      '&#8226; &ldquo;3-room apartments&rdquo;<br>' +
      '&#8226; &ldquo;What are the prices?&rdquo;<br>' +
      '&#8226; &ldquo;Apartments on R+2&rdquo;<br>' +
      '&#8226; &ldquo;Tell me about A202&rdquo;<br>' +
      '&#8226; &ldquo;Lake view units&rdquo;<br>' +
      '&#8226; &ldquo;Penthouse&rdquo;',
  };
}

// ── Chatbot UI wiring ────────────────────────────────────────────────────────

(function initChatbot() {
  const toggle  = document.getElementById('chatbot-toggle');
  const panel   = document.getElementById('chatbot-panel');
  const closeBtn= document.getElementById('chatbot-close');
  const input   = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const msgs    = document.getElementById('chatbot-messages');
  const chips   = document.querySelectorAll('.chatbot-chip');

  function timeNow() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function addMessage(role, htmlContent) {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg ' + role;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = htmlContent;

    const time = document.createElement('div');
    time.className = 'chat-time';
    time.textContent = timeNow();

    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    msgs.appendChild(wrapper);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addTyping() {
    const wrapper = document.createElement('div');
    wrapper.id = 'chat-typing-indicator';
    wrapper.className = 'chat-msg bot';
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    wrapper.appendChild(bubble);
    msgs.appendChild(wrapper);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('chat-typing-indicator');
    if (el) el.remove();
  }

  function buildReplyHtml(reply) {
    let html = reply.text;
    if (reply.cards && reply.cards.length > 0) {
      html += '<div class="chat-apt-cards">' + chatBuildCards(reply.cards) + '</div>';
    }
    return html;
  }

  function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage('user', escHtml(trimmed));
    input.value = '';
    addTyping();
    setTimeout(() => {
      removeTyping();
      addMessage('bot', buildReplyHtml(chatbotGetReply(trimmed)));
    }, 500 + Math.random() * 350);
  }

  toggle.addEventListener('click', () => {
    panel.classList.add('chatbot-open');
    setTimeout(() => input.focus(), 310);
  });

  closeBtn.addEventListener('click', () => panel.classList.remove('chatbot-open'));

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(input.value); });

  chips.forEach(chip => chip.addEventListener('click', () => sendMessage(chip.textContent)));

  // Welcome message after a short delay
  setTimeout(() => {
    addMessage('bot',
      'Welcome to <strong>Parc de Lac</strong>! &#127963;<br>' +
      'I\'m your apartment assistant. Ask me about available units, prices, surfaces, views, and more.<br><br>' +
      'What can I help you with?'
    );
  }, 900);
}());
