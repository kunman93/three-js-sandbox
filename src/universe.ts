import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let renderer: any, camera: any, scene: any, controls: any;

/**
 *  ---- Universe animation in Three.js ---- 
 */
main();

function main() {
    // # Initialising the canvas and the renderer
    const canvas = document.querySelector('#canvas-universe') ?? undefined;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });

    // # Setting up the camera
    // ## Setting for the camera
    const fov = 75; // field of view, 75 degree
    const aspect = 2;  // it is the display aspect of the canvas, the default canvas is 300x150 pixel, which makes the aspect 300/150 or 2.
    // near and far represent the space in front of the the camera that will be rendered. Anything before or after that range will be clipped (not drawn)
    const near = 1;
    const far = 1000;

    // ## Initalising the camera
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // Anything inside the defined frustum will be drawn. Anything outside will not.
    camera.position.set(0, 0, 500); // Camera Coordinate System --> left-handed (index finger => x, thumb => y, middle finger => z)

    // # Setting up the scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x00061a, 0.0002);

    // # Creating stars
    const geometry = new THREE.SphereGeometry(0.25, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0xffff00, flatShading: true });

    for (let i = 0; i < 1000; i++) {
        const star = new THREE.Mesh(geometry, material);
        star.position.x = (Math.random() - 0.5) * 1000;
        star.position.y = (Math.random() - 0.5) * 1000;
        star.position.z = (Math.random() - 0.5) * 1000;
        star.updateMatrix();
        star.matrixAutoUpdate = false;
        scene.add(star);
    }

    // # Lights
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
    dirLight1.position.set(1, 1, 1);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x002288, 3);
    dirLight2.position.set(-1, -1, -1);
    scene.add(dirLight2);

    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    // # Add OrbitControl
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window); // optional

    // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05; // The damping inertia used, default is 0.05
    controls.autoRotate = true;

    controls.screenSpacePanning = false;
    controls.enableZoom = false;
    controls.target.set(0, 0, 0); // The focus point of the controls

    controls.maxPolarAngle = Math.PI; // How far you can orbit vertically, upper limit. Range is 0 to Math.PI radians, and default is Math.PI. 
    // # Set an animation loop on the renderer
    // ## The function will be called every available frame.
    renderer.setAnimationLoop(animateRotation);
}

function animateRotation() {
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
