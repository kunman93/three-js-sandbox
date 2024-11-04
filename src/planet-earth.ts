import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let renderer: any, camera: any, scene: any, planetEarthModel: any, controls: any;

/**
 *  ---- Planet Earth animation in Three.js ---- 
 */
main();

function main() {
  // # Initialising the canvas and the renderer
  const canvas = document.querySelector('#canvas-earth') ?? undefined;
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });

  // # Setting up the camera
  // ## Setting for the camera
  const fov = 75; // field of view, 75 degree
  const aspect = 2;  // it is the display aspect of the canvas, the default canvas is 300x150 pixel, which makes the aspect 300/150 or 2.
  // near and far represent the space in front of the the camera that will be rendered. Anything before or after that range will be clipped (not drawn)
  const near = 5;
  const far = 30;

  // ## Initalising the camera
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // Anything inside the defined frustum will be drawn. Anything outside will not.
  camera.position.set(0, 0, 9); // Camera Coordinate System --> left-handed (index finger => x, thumb => y, middle finger => z)

  // # Setting up the scene
  scene = new THREE.Scene();

  // # Load gltf model
  const modelName = `planet_earth.glb`;
  const gltfLoader = new GLTFLoader();
  const url = `assets/${modelName}`;
  gltfLoader.load(url, async function (gltf) {
    planetEarthModel = gltf.scene;

    // wait until the model can be added to the scene without blocking due to shader compilation
    await renderer.compileAsync(planetEarthModel, camera, scene);
    scene.add(planetEarthModel);
  });

  // # Creating lights
  const color = 0xFFFFFF;
  const intensity = 3;
  const lightPos = 100;

  const light1 = new THREE.DirectionalLight(color, intensity);
  light1.position.set(-lightPos, 0, 0);

  const light2 = new THREE.DirectionalLight(color, intensity);
  light2.position.set(lightPos, 0, 0);

  const light3 = new THREE.DirectionalLight(color, intensity);
  light3.position.set(0, lightPos, 0);

  const light4 = new THREE.DirectionalLight(color, intensity);
  light4.position.set(0, -lightPos, 0);

  const light5 = new THREE.DirectionalLight(color, intensity);
  light3.position.set(0, 0, lightPos);

  const light6 = new THREE.DirectionalLight(color, intensity);
  light4.position.set(0, 0, -lightPos);

  // ## Add lights to the scene
  scene.add(light1);
  scene.add(light2);
  scene.add(light3);
  scene.add(light4);
  scene.add(light5);
  scene.add(light6);

  // # Add OrbitControl
  controls = new OrbitControls(camera, renderer.domElement);
  controls.listenToKeyEvents(window); // optional

  // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05; // The damping inertia used, default is 0.05

  controls.screenSpacePanning = false;
  controls.enableZoom = false;
  controls.target.set(0, 0, 0); // The focus point of the controls

  controls.maxPolarAngle = Math.PI; // How far you can orbit vertically, upper limit. Range is 0 to Math.PI radians, and default is Math.PI. 

  // # Set an animation loop on the renderer
  // ## The function will be called every available frame.
  renderer.setAnimationLoop(animateRotation);
}

function animateRotation() {
  if (planetEarthModel) {
    if (planetEarthModel.rotation.y > 2 * Math.PI) {
      planetEarthModel.rotation.y = 0;
    } else {
      planetEarthModel.rotation.y += (Math.PI / 360);
    }
  }

  onWindowResize();
  controls.update();
  render();
}

// the below code block was added to fix the low resolution or blocky and blurry problems
function onWindowResize() {
  if (resizeRendererToDisplaySize()) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }
}

function resizeRendererToDisplaySize() {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio; // for handling HD-DPI
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);
  const needResize = canvas.width !== width || canvas.height !== height;

  if (needResize) {
    renderer.setSize(width, height, false); // Setting updateStyle to false prevents any style changes to the output canvas. 
  }

  return needResize;
}

function render() {
  renderer.render(scene, camera);
}
