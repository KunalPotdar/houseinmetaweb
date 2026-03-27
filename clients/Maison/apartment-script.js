import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
const clock = new THREE.Clock();
// Renderer 
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.setSize(rightPanel.clientWidth, rightPanel.clientHeight);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);


const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 1;

// Create an Perpective camera for Human Hight 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 2.8, 6); // Start height like a human (1.6 meters)

// Mobile detection (touch device)
const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Controls
const controls = new PointerLockControls(camera, renderer.domElement); // Use renderer.domElement, not document.body
if (!isMobile) scene.add(controls); // PointerLockControls only active on desktop

const walkthroughPanel = document.getElementById('walkthrough-controls');
const walkthroughBtn = document.getElementById('startWalkthroughBtn');

if (!isMobile) {
  // Enter walkthrough mode on button click
  walkthroughBtn.addEventListener('click', () => {
    controls.lock();
    walkthroughBtn.style.display = 'none';
  });

  // Show instructions when controls are locked
  controls.addEventListener('lock', () => {
    walkthroughPanel.style.display = 'block';
  });

  // Hide instructions and show button when controls unlock
  controls.addEventListener('unlock', () => {
    walkthroughPanel.style.display = 'none';
    walkthroughBtn.style.display = 'block';
  });
} else {
  // Mobile: hide desktop-only button immediately
  walkthroughBtn.style.display = 'none';
}

// ── Mobile touch look + D-pad ─────────────────────────────────────────────────
let yaw = 0, pitch = 0;
let touchLookId = null, touchLookLastX = 0, touchLookLastY = 0;
const _fwd = new THREE.Vector3();
const _rgt = new THREE.Vector3();

if (isMobile) {
  // Right-side drag → look around
  renderer.domElement.addEventListener('touchstart', (e) => {
    for (const t of e.changedTouches) {
      if (t.clientX > window.innerWidth / 2 && touchLookId === null) {
        touchLookId = t.identifier;
        touchLookLastX = t.clientX;
        touchLookLastY = t.clientY;
      }
    }
  }, { passive: true });

  renderer.domElement.addEventListener('touchmove', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchLookId) {
        yaw   -= (t.clientX - touchLookLastX) * 0.003;
        pitch -= (t.clientY - touchLookLastY) * 0.003;
        pitch = Math.max(-Math.PI * 0.45, Math.min(Math.PI * 0.45, pitch));
        touchLookLastX = t.clientX;
        touchLookLastY = t.clientY;
      }
    }
  }, { passive: true });

  renderer.domElement.addEventListener('touchend', (e) => {
    for (const t of e.changedTouches) {
      if (t.identifier === touchLookId) touchLookId = null;
    }
  }, { passive: true });

  // D-pad button bindings
  function bindDpad(id, key) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('touchstart',  (e) => { e.preventDefault(); move[key] = true;  }, { passive: false });
    el.addEventListener('touchend',    (e) => { e.preventDefault(); move[key] = false; }, { passive: false });
    el.addEventListener('touchcancel', (e) => { e.preventDefault(); move[key] = false; }, { passive: false });
  }
  bindDpad('btn-forward',  'forward');
  bindDpad('btn-backward', 'backward');
  bindDpad('btn-left',     'left');
  bindDpad('btn-right',    'right');
}
// LIGHTS

// Natural ambient lighting - strong for overall brightness
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Full intensity for bright, even lighting
scene.add(ambientLight);

// Subtle directional light simulating natural daylight from above
const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
sunLight.position.set(50, 100, 30);
sunLight.target.position.set(0, 0, 0);
scene.add(sunLight);

// Soft fill light for shadow areas
const fillLight = new THREE.DirectionalLight(0xd0e8f2, 0.25);
fillLight.position.set(-50, 50, -50);
scene.add(fillLight);

// Load HDRI and create large sphere
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://apt-hsim-models.s3.eu-west-3.amazonaws.com/clients-hsm/hdri.hdr', function(texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  
  // Create large sphere for HDRI background
  const sphereGeometry = new THREE.SphereGeometry(500, 64, 64);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide, // Render from inside
    toneMapped: false // Don't tone map HDRI
  });
  const hdriSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(hdriSphere);
  
  // Use HDRI as visual background only, not as environment lighting
  // to preserve original surface colors
  // scene.environment = texture;  // Commented out to prevent color shifts
  scene.background = texture;
});

//const loader = new GLTFLoader().setPath('client/project2/apts/');
const loader = new GLTFLoader();

// Material refraction control settings
const materialSettings = {
  transmissionLevel: 0.3,    // 0 = opaque (no transparency), increase if you want glass-like effect
  refractionIndex: 1.5,      // IOR (Index of Refraction) - 1.5 for glass, 1.33 for water
  thickness: 0.3,            // Thickness for refraction effect
  metalness: 0.05,            // Metallic properties (lower for less shiny)
  roughness: 0.8             // Surface roughness (higher = more matte)
};

loader.load('https://apt-hsim-models.s3.eu-west-3.amazonaws.com/Maison/Maison000000.glb', (gltf) => {
  const mesh = gltf.scene;

 // Center model in scene
  const box = new THREE.Box3().setFromObject(mesh);
  const center = new THREE.Vector3();
  box.getCenter(center);
  // Ensure natural colors by processing all materials
  mesh.traverse((child) => {
    if (child.isMesh && child.material) {
      // Handle both single materials and arrays of materials
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((mat) => {
        if (mat && mat.isMaterial) {
          // Ensure proper color space for textures
          if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
          if (mat.normalMap) mat.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
          if (mat.roughnessMap) mat.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
          if (mat.metalnessMap) mat.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
          
          // Apply material properties - preserve original texture values if they exist
          if (!mat.roughnessMap) {
            mat.roughness = materialSettings.roughness;
          }
          if (!mat.metalnessMap) {
            mat.metalness = materialSettings.metalness;
          }
          
          // Add refraction/transmission only for transparent materials (like glass)
          // Only enable transmission if you want specific materials to be glass-like
          if (mat.transmission !== undefined && materialSettings.transmissionLevel > 0) {
            // Only apply to materials with "glass" or similar in the name
            if (mat.name && (mat.name.toLowerCase().includes('glass') || 
                             mat.name.toLowerCase().includes('window') || 
                             mat.name.toLowerCase().includes('transparent'))) {
              mat.transmission = materialSettings.transmissionLevel;
              mat.ior = materialSettings.refractionIndex;
              if (mat.thickness !== undefined) {
                mat.thickness = materialSettings.thickness;
              }
            }
          }
          
          mat.needsUpdate = true;
        }
      });
    }
  });
  
  mesh.position.sub(center); // Recenter model

  // Place bottom of model exactly on HDRI ground (horizon at Y=0)
  box.setFromObject(mesh); // Recalculate after shift
  mesh.position.y -= box.min.y;

  // Ensure model is centered at origin (X/Z only, preserve Y offset)
  mesh.position.x = 0;
  mesh.position.z = 0;

  scene.add(mesh);
  
    // Compute bounding box and size
  const bbox = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  bbox.getSize(size);
  console.log('Model dimensions:', size);
  
  animate();
  document.getElementById('progress-container').style.display = 'none';
  if (!isMobile) {
    walkthroughBtn.style.display = 'block';
  }
  if (isMobile) {
    document.getElementById('mobile-dpad').style.display = 'flex';
    document.getElementById('mobile-hint').style.display = 'block';
  }
   }, (xhr) => {
  if (xhr.lengthComputable) {
    const pct = Math.round(xhr.loaded / xhr.total * 100);
    const bar = document.getElementById('progress-bar');
    const percent = document.getElementById('progress-percent');
    if (bar) bar.style.width = `${pct}%`;
    if (percent) percent.textContent = `${pct}%`;
  }
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});

// Movement
const move = { forward: false, backward: false, left: false, right: false };
const velocity = new THREE.Vector3();
const speed = 3;
const direction = new THREE.Vector3();
const friction = 1.0; // Higher = smoother deceleration


document.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW' || e.code === 'ArrowUp') move.forward = true;
  if (e.code === 'KeyS' || e.code === 'ArrowDown') move.backward = true;
  if (e.code === 'KeyA' || e.code === 'ArrowLeft') move.left = true;
  if (e.code === 'KeyD' || e.code === 'ArrowRight') move.right = true;
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW' || e.code === 'ArrowUp') move.forward = false;
  if (e.code === 'KeyS' || e.code === 'ArrowDown') move.backward = false;
  if (e.code === 'KeyA' || e.code === 'ArrowLeft') move.left = false;
  if (e.code === 'KeyD' || e.code === 'ArrowRight') move.right = false;
});


function animate() {
 requestAnimationFrame(animate);
  const delta = clock.getDelta(); // Use delta for consistent speed

  if (isMobile) {
    // Apply touch look via yaw/pitch Euler angles
    camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));

    direction.z = Number(move.forward) - Number(move.backward);
    direction.x = Number(move.right) - Number(move.left);
    direction.normalize();

    if (move.forward || move.backward) velocity.z -= direction.z * speed * delta;
    if (move.left || move.right)       velocity.x -= direction.x * speed * delta;
    velocity.x -= velocity.x * friction * delta;
    velocity.z -= velocity.z * friction * delta;

    // Move in camera's flat forward/right directions (no vertical drift)
    _fwd.set(0, 0, -1).applyQuaternion(camera.quaternion); _fwd.y = 0; _fwd.normalize();
    _rgt.set(1, 0, 0).applyQuaternion(camera.quaternion);  _rgt.y = 0; _rgt.normalize();
    camera.position.addScaledVector(_fwd, -velocity.z * delta);
    camera.position.addScaledVector(_rgt, -velocity.x * delta);

  } else if (controls.isLocked) {
    direction.z = Number(move.forward) - Number(move.backward);
    direction.x = Number(move.right) - Number(move.left);
    direction.normalize();
    
    // Apply velocity based on direction and speed
    if (move.forward || move.backward) {
      velocity.z -= direction.z * speed * delta;
    }
    if (move.left || move.right) {
      velocity.x -= direction.x * speed * delta;
    }
  
    // Apply friction
    velocity.x -= velocity.x * friction * delta;
    velocity.z -= velocity.z * friction * delta;
  
    // Move camera
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }

  renderer.render(scene, camera);
}


