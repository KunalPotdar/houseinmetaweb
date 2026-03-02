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
camera.position.set(3, 1.7, 6); // Start height like a human (1.6 meters)

// Controls
const controls = new PointerLockControls(camera, renderer.domElement); // Use renderer.domElement, not document.body
scene.add(controls); // Add controls directly, not controls.getObject()

const walkthroughPanel = document.getElementById('walkthrough-controls');
const walkthroughBtn = document.getElementById('startWalkthroughBtn');

// Enter walkthrough mode on button click
walkthroughBtn.addEventListener('click', () => {
  controls.lock();
  walkthroughBtn.style.display = 'none';        // Hide button when walkthrough starts
});

// Show instructions when controls are locked
controls.addEventListener('lock', () => {
  walkthroughPanel.style.display = 'block';
});

// Hide instructions and show button when controls unlock
controls.addEventListener('unlock', () => {
  walkthroughPanel.style.display = 'none';
  walkthroughBtn.style.display = 'block';       // Show button again
});
// LIGHTS

// Natural ambient lighting - strong for overall brightness
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

// Subtle directional light simulating natural daylight from above
const sunLight = new THREE.DirectionalLight(0xffffff, 0.4);
sunLight.position.set(50, 100, 30);
sunLight.target.position.set(0, 0, 0);
scene.add(sunLight);

// Soft fill light for shadow areas
const fillLight = new THREE.DirectionalLight(0xd0e8f2, 0.3);
fillLight.position.set(-50, 50, -50);
scene.add(fillLight);


//const loader = new GLTFLoader().setPath('client/project2/apts/');
const loader = new GLTFLoader();

// Material refraction control settings
const materialSettings = {
  transmissionLevel: 0,    // 0 = opaque (no transparency), increase if you want glass-like effect
  refractionIndex: 1.5,      // IOR (Index of Refraction) - 1.5 for glass, 1.33 for water
  thickness: 0.3,            // Thickness for refraction effect
  metalness: 0.05,            // Metallic properties (lower for less shiny)
  roughness: 0.8             // Surface roughness (higher = more matte)
};

loader.load('./bois2.glb', (gltf) => {
  console.log('Apartment model');
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

  // Optional: place bottom of model on ground
  box.setFromObject(mesh); // Recalculate after shift
  mesh.position.y -= box.min.y;
  
  // Ensure model is centered at origin
  mesh.position.set(0, 0, 0);

  scene.add(mesh);
  
    // Compute bounding box and size
  const bbox = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  bbox.getSize(size);
  console.log('Model dimensions:', size);
  
  animate();
  document.getElementById('progress-container').style.display = 'none';
   }, (xhr) => {
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
  if (e.code === 'KeyW') move.forward = true;
  if (e.code === 'KeyS') move.backward = true;
  if (e.code === 'KeyA') move.left = true;
  if (e.code === 'KeyD') move.right = true;
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') move.forward = false;
  if (e.code === 'KeyS') move.backward = false;
  if (e.code === 'KeyA') move.left = false;
  if (e.code === 'KeyD') move.right = false;
});


function animate() {
 requestAnimationFrame(animate);
  const delta = clock.getDelta(); // Use delta for consistent spee
  if (controls.isLocked) {
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


