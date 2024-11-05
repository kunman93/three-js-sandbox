import * as THREE from 'three';

let renderer: any, camera: any, scene: any;

// Variables for mouse tracking and rotation
const spheres: any = [];
let isDragging = false;
let selectedSphere: any = null;
let previousMousePosition = { x: 0, y: 0 };

// Create a raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

/**
 *  ---- Orbs animation in Three.js ---- 
 */
main();

function main() {
    // # Initialising the canvas and the renderer
    const canvas = document.querySelector('#canvas-orbs') ?? undefined;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });

    // # Setting up the camera
    // ## Setting for the camera
    const fov = 75; // field of view, 75 degree
    const aspect = 2;  // it is the display aspect of the canvas, the default canvas is 300x150 pixel, which makes the aspect 300/150 or 2.
    // near and far represent the space in front of the the camera that will be rendered. Anything before or after that range will be clipped (not drawn)
    const near = 0.1;
    const far = 1000;

    // ## Initalising the camera
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // Anything inside the defined frustum will be drawn. Anything outside will not.
    camera.position.set(0, 0, 8); // Camera Coordinate System --> left-handed (index finger => x, thumb => y, middle finger => z)

    // # Setting up the scene
    scene = new THREE.Scene();
    
    // # Create Orbs
    // ## Geometry
    const radius = 1;
    const widthSegments = 7;
    const heightSegments = 7;
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    // ## Material
    const material = new THREE.MeshPhongMaterial({ color: 0x331a00 });
    material.flatShading = true;

    // ## Mesh
    let posX = -4;
    for (let i = 0; i < 3; i++) {
        // ## Mesh
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = posX;
        posX += 4;
        // ## Add box to the scene
        scene.add(sphere);
        spheres.push(sphere);
    }

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

    // # Event listeners
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mousemove', onMouseMove, false);
    window.addEventListener('mouseup', onMouseUp, false);

    // # Set an animation loop on the renderer
    // ## The function will be called every available frame.
    renderer.setAnimationLoop(animate);
}


// Helper function to update mouse position
function updateMousePosition(event: any) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Function to handle mouse down event
function onMouseDown(event: any) {
    updateMousePosition(event);

    // Perform raycasting to check for intersection with spheres
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(spheres, false);

    // If a sphere is clicked, set it as selected and start dragging
    if (intersects.length > 0) {
        selectedSphere = intersects[0].object;
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    }
}

// Function to handle mouse move event
function onMouseMove(event: any) {
    if (!isDragging || !selectedSphere) return;

    // Calculate mouse movement delta
    const deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y,
    };

    // Set a rotation speed factor
    const rotationSpeed = 0.005;

    // Rotate the selected sphere around its X and Y axes
    selectedSphere.rotation.y += deltaMove.x * rotationSpeed;
    selectedSphere.rotation.x += deltaMove.y * rotationSpeed;

    // Update previous mouse position
    previousMousePosition = { x: event.clientX, y: event.clientY };
}

// Function to handle mouse up event
function onMouseUp() {
    isDragging = false;
    selectedSphere = null;
}

function animate() {
    onWindowResize();
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
