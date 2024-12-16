// Import necessary modules
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add Lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Brighten up the scene
scene.add(ambientLight);


const gridHelper = new THREE.GridHelper(5, 5);
gridHelper.position.set(0, -1, 0); 
scene.add(gridHelper);


let clock = new THREE.Clock(); 
let waterMixer; 
let originalDuck; 
let tupacOriginal; 
let tupacClone; 


const orbitCenter = { x: 0, y: 0.5, z: 0 };


const duckLoader = new GLTFLoader();
duckLoader.load(
  '/models/duck/scene.gltf', // Path to the duck model
  (gltf) => {
    originalDuck = gltf.scene;
    originalDuck.scale.set(0.5, 0.5, 0.5);
    originalDuck.position.set(orbitCenter.x + 1.5, orbitCenter.y, orbitCenter.z); // Start on orbit
    scene.add(originalDuck);
    console.log('Duck added:', originalDuck);
  },
  undefined,
  (error) => {
    console.error('Error loading the duck model:', error);
  }
);

// Load the Tupac Model
const tupacLoader = new GLTFLoader();
tupacLoader.load(
  '/models/tupac/tupac_shakur.glb', // Path to Tupac's model
  (gltf) => {
    tupacOriginal = gltf.scene;

    // Original Tupac setup
    tupacOriginal.scale.set(0.8, 0.8, 0.8); 
    tupacOriginal.position.set(-2, 0, 0); 
    tupacOriginal.rotation.set(0, Math.PI / 2, 0); 
    scene.add(tupacOriginal);
    console.log('Original Tupac added:', tupacOriginal);

    // Cloned Tupac for zoom-in effect
    tupacClone = tupacOriginal.clone();
    tupacClone.scale.set(5, 5, 5); 
    tupacClone.position.set(0, 0, 2); 
    tupacClone.visible = false; 
    scene.add(tupacClone);
    console.log('Cloned Tupac for zoom effect added:', tupacClone);
  },
  undefined,
  (error) => {
    console.error('Error loading the Tupac model:', error);
  }
);

// Load the Water Model
const waterLoader = new GLTFLoader();
waterLoader.load(
  '/models/water/water_waves.glb', // Path to the water model
  (gltf) => {
    const water = gltf.scene;

    
    const boundingBox = new THREE.Box3().setFromObject(water);
    const boxSize = new THREE.Vector3();
    boundingBox.getSize(boxSize);

    console.log('Water Bounding Box Size:', boxSize);

  
    const targetSize = 5; 
    const scaleFactor = targetSize / Math.max(boxSize.x, boxSize.z); 
    water.scale.set(scaleFactor, scaleFactor, scaleFactor);
    water.position.set(0, -1, 0); 
    water.rotation.set(0, 0, 0);

    scene.add(water);
    console.log('Water added:', water);

    // Set up animation if available
    if (gltf.animations.length > 0) {
      waterMixer = new AnimationMixer(water);
      const action = waterMixer.clipAction(gltf.animations[0]);
      action.play();
    }
  },
  undefined,
  (error) => {
    console.error('Error loading the water model:', error);
  }
);

// Position the camera
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Animation loop
let angle = 0; 
let cloneVisible = false; 
let cloneTimer = 0;

function animate() {
  const delta = clock.getDelta(); 
  cloneTimer += delta; 

 
  if (originalDuck) {
    angle += 0.02;
    const radius = 1.5;
    const x = orbitCenter.x + radius * Math.cos(angle);
    const z = orbitCenter.z + radius * Math.sin(angle);

    originalDuck.position.set(x, orbitCenter.y, z);

  
    const nextX = orbitCenter.x + radius * Math.cos(angle + 0.1);
    const nextZ = orbitCenter.z + radius * Math.sin(angle + 0.1);
    originalDuck.lookAt(nextX, orbitCenter.y, nextZ);
  }

  
  if (tupacClone) {
    if (cloneTimer >= 5 && cloneTimer < 6) {
      if (!tupacClone.visible) {
        console.log("Tupac becomes visible!");
      }
      tupacClone.visible = true; 
      tupacClone.lookAt(camera.position);
      tupacClone.position.set(0, -2.5, 10.75);
    } else if (cloneTimer >= 6) {
      if (tupacClone.visible) {
        console.log("Tupac becomes invisible!");
      }
      tupacClone.visible = false;
      cloneTimer = 0;
    }
  }


  if (waterMixer) waterMixer.update(delta);


  if (tupacClone && tupacClone.visible) {
    renderer.render(scene, camera);
  }

 
  renderer.render(scene, camera);
}





renderer.setAnimationLoop(animate);

// Handle window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
