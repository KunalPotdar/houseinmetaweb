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

let currentFloor  = 0;
let loadGeneration = 0;
let currentFrame  = 0;
let images        = [];
let loaded        = 0;
let isReady       = false;
let autoSpin      = false;
let spinRafId     = null;
let spinLastTime  = null;
let spinProgress  = 0;   // fractional frame accumulator

// Priority preloader state
let toLoadList    = [];  // [{index, priority}] sorted highest-priority first
let loadedList    = {};  // path → HTMLImageElement cache
let currentLoading = 0; // number of in-flight requests

// Drag / pan state
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

// ── Helpers ──────────────────────────────────

function frameSrc(index, floor) {
  const padded = String(index + 1).padStart(CONFIG.padDigits, '0');
  return floor.baseUrl + CONFIG.filePattern.replace('{index}', padded);
}

function showFrame(index) {
  const total = FLOORS[currentFloor].totalFrames;
  currentFrame = ((index % total) + total) % total;
  if (images[currentFrame] && images[currentFrame].complete) {
    spinImg.src = images[currentFrame].src;
  }
  frameCounter.textContent = `${currentFrame + 1} / ${total}`;
}

function onFrameLoaded(gen) {
  if (gen !== loadGeneration) return; // stale callback from previous floor
  loaded++;

  if (!isReady && loaded >= CONFIG.preloadCount) {
    isReady = true;
    showFrame(currentFrame);
  }
}

// ── Zoom helpers ──────────────────────────────────

function applyTransform() {
  spinImg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
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

// ── Priority-based preloader ─────────────────

function refreshPriorities(pivot) {
  const total = FLOORS[currentFloor].totalFrames;
  toLoadList.forEach(item => {
    // higher value = closer to pivot (matches reference _refreshPriorities)
    item.priority = Math.abs(total / 2 - Math.abs(item.index - pivot));
  });
  toLoadList.sort((a, b) => b.priority - a.priority);
}

function launchPreload(gen) {
  if (gen !== loadGeneration) return;
  if (toLoadList.length === 0) return;
  if (currentLoading >= CONFIG.concurrentLoads) return;

  const item = toLoadList.shift();
  if (!item) return;

  // Already cached from a previous load of the same floor
  if (loadedList[item.path]) {
    images[item.index] = loadedList[item.path];
    onFrameLoaded(gen);
    launchPreload(gen);
    return;
  }

  currentLoading++;
  const img = new Image();
  img.onload = () => {
    if (gen !== loadGeneration) return; // stale — floor switched
    currentLoading--;
    loadedList[item.path] = img;
    images[item.index]    = img;
    onFrameLoaded(gen);
    launchPreload(gen);
  };
  img.onerror = () => {
    if (gen !== loadGeneration) return;
    currentLoading--;
    onFrameLoaded(gen);
    launchPreload(gen);
  };
  img.src = item.path;
  images[item.index] = img; // expose ref so showFrame can check .complete
}

function reprioritize(pivot) {
  if (toLoadList.length === 0) return;
  refreshPriorities(pivot);
  // Fill any free slots that opened up
  const free = CONFIG.concurrentLoads - currentLoading;
  for (let i = 0; i < free; i++) launchPreload(loadGeneration);
}

function preloadAll() {
  const floor = FLOORS[currentFloor];
  const total = floor.totalFrames;
  const gen   = loadGeneration;

  // Build the pending queue (skip frames already in cache)
  toLoadList = [];
  for (let i = 0; i < total; i++) {
    const path = frameSrc(i, floor);
    if (!loadedList[path]) {
      toLoadList.push({ index: i, path, priority: 0 });
    } else {
      images[i] = loadedList[path];
      onFrameLoaded(gen); // count cached frames toward the ready threshold
    }
  }

  refreshPriorities(currentFrame);

  // Launch up to concurrentLoads workers in parallel
  for (let t = 0; t < CONFIG.concurrentLoads; t++) launchPreload(gen);
}

// ── Floor switching ───────────────────────────

function switchFloor(floorIndex) {
  if (floorIndex === currentFloor && isReady) return;
  currentFloor = floorIndex;

  // Update button states
  floorBtns.forEach((btn, i) => btn.classList.toggle('active', i === floorIndex));

  // Reset viewer
  stopSpin();
  resetZoom();
  isReady        = false;
  loaded         = 0;
  images         = [];
  loadGeneration++;
  toLoadList     = [];
  currentLoading = 0;
  // Note: loadedList is intentionally kept — cross-floor cache is not shared
  // because URLs differ per floor, so it acts as a no-op deduplication guard.

  preloadAll();
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
    if (!isReady) return;
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

// ── Start ────────────────────────────────────

preloadAll();
