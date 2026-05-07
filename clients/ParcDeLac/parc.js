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
  preloadCount: 36,

  // Max simultaneous image fetches (configurable thread count)
  concurrentLoads: 3,
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

// ── Polygon overlay data (Floor 4) ────────────
let polyData        = null;
let currentPolyPath = null;  // Path2D for hit-testing

// ── DOM ref ───────────────────────────────────
const aptWidget = document.getElementById('apt-widget');

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
    spinImg.src = img.src;
  }
  frameCounter.textContent = `${currentFrame + 1} / ${total}`;
  drawPolygon();
}

function onFrameLoaded(floorIdx) {
  floorLoaded[floorIdx]++;
  if (!floorReady[floorIdx] && floorLoaded[floorIdx] >= CONFIG.preloadCount) {
    floorReady[floorIdx] = true;
    // If this is the currently active floor, reveal the viewer
    if (floorIdx === currentFloor) {
      showFrame(currentFrame);
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
    img.onload = () => {
      activeLoads--;
      imageCache[item.path] = img;
      floorImages[item.floorIdx][item.frameIdx] = img;
      onFrameLoaded(item.floorIdx);
      launchLoad();
    };
    img.onerror = () => {
      activeLoads--;
      onFrameLoaded(item.floorIdx);
      launchLoad();
    };
    img.src = item.path;
    floorImages[item.floorIdx][item.frameIdx] = img; // expose ref so showFrame can check .complete
  }
}

function reprioritize(pivot) {
  // Boost current-floor frames nearest to the current drag position
  const total = FLOORS[currentFloor].totalFrames;
  loadQueue.forEach(item => {
    if (item.floorIdx === currentFloor) {
      item.priority = 2000 + Math.abs(total / 2 - Math.abs(item.frameIdx - pivot));
    }
  });
  loadQueue.sort((a, b) => b.priority - a.priority);
  launchLoad();
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
      } else if (!floorImages[fi][i]) {
        // Priority: active floor first, early frames higher within active floor
        let priority;
        if (fi === currentFloor) {
          priority = 1000 + (i < CONFIG.preloadCount ? 500 : 0) - i;
        } else {
          // Background floors load after the active floor is ready
          priority = 100 - fi * 10 - i;
        }
        loadQueue.push({ floorIdx: fi, frameIdx: i, path, priority });
      }
    }
  }
  loadQueue.sort((a, b) => b.priority - a.priority);
  launchLoad();
}

// ── Floor switching ───────────────────────────

function switchFloor(floorIndex) {
  if (floorIndex === currentFloor) return;
  currentFloor = floorIndex;
  drawPolygon(); // clear or redraw immediately for the new floor

  // Update button states
  floorBtns.forEach((btn, i) => btn.classList.toggle('active', i === floorIndex));

  stopSpin();
  resetZoom();

  // Boost this floor's pending queue items to the top
  loadQueue.forEach(item => {
    if (item.floorIdx === floorIndex) item.priority += 2000;
  });
  loadQueue.sort((a, b) => b.priority - a.priority);
  launchLoad();

  // If already ready, show immediately; otherwise onFrameLoaded will reveal it
  if (floorReady[floorIndex]) {
    showFrame(currentFrame);
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
  spinBtn.classList.add('active');
  spinBtn.textContent = '⏸ Stop';
}

function stopSpin() {
  if (spinRafId) { cancelAnimationFrame(spinRafId); spinRafId = null; }
  spinLastTime = null;
  autoSpin = false;
  spinBtn.classList.remove('active');
  spinBtn.textContent = '⟳ Auto';
}

spinBtn.addEventListener('click', () => {
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
