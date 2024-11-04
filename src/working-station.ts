import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let renderer: any, camera: any, scene: any, controls: any
let retroComputerModel: any, commodore64ComputerModel: any, gameboyClassicModel: any, childhoodBooksModel: any;

/**
 *  ---- Computers animation in Three.js ---- 
 */
main();

function main() {
    // # Initialising the canvas and the renderer
    const canvas = document.querySelector('#canvas') ?? undefined;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });

    // # Setting up the camera
    // ## Setting for the camera
    const fov = 75; // field of view, 75 degree
    const aspect = 2;  // it is the display aspect of the canvas, the default canvas is 300x150 pixel, which makes the aspect 300/150 or 2.
    // near and far represent the space in front of the the camera that will be rendered. Anything before or after that range will be clipped (not drawn)
    const near = 2;
    const far = 30;

    // ## Initalising the camera
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // Anything inside the defined frustum will be drawn. Anything outside will not.
    camera.position.set(0, 3, 11); // Camera Coordinate System --> left-handed (index finger => x, thumb => y, middle finger => z)

    // # Setting up the scene
    scene = new THREE.Scene();

    // # Load gltf models
    let modelName = `1970s_retro_computer.glb`;
    const gltfLoader = new GLTFLoader();
    let url = `assets/${modelName}`;
    gltfLoader.load(url, async function (gltf) {
        retroComputerModel = gltf.scene;
        retroComputerModel.position.x = -4.5;
        retroComputerModel.position.z = 0.5;
        retroComputerModel.rotation.y += (Math.PI / 8);

        // wait until the model can be added to the scene without blocking due to shader compilation
        await renderer.compileAsync(retroComputerModel, camera, scene);
        scene.add(retroComputerModel);
    });

    modelName = `commodore_64__computer_full_pack.glb`;
    url = `assets/${modelName}`;
    gltfLoader.load(url, async function (gltf) {
        commodore64ComputerModel = gltf.scene;
        commodore64ComputerModel.position.x = 4;
        commodore64ComputerModel.position.y = -0.75;
        commodore64ComputerModel.rotation.y -= (Math.PI / 8);

        // wait until the model can be added to the scene without blocking due to shader compilation
        await renderer.compileAsync(commodore64ComputerModel, camera, scene);
        scene.add(commodore64ComputerModel);
    });
    
    modelName = `game_boy_classic.glb`;
    url = `assets/${modelName}`;
    gltfLoader.load(url, async function (gltf) {
        gameboyClassicModel = gltf.scene;
        gameboyClassicModel.scale.set(8,8,8);
        gameboyClassicModel.rotation.y -= (Math.PI / 4);
        gameboyClassicModel.rotation.z += (Math.PI / 2);
        gameboyClassicModel.position.x = 0.25;
        gameboyClassicModel.position.y = -0.5;
        gameboyClassicModel.position.z = 5;
        
        // wait until the model can be added to the scene without blocking due to shader compilation
        await renderer.compileAsync(gameboyClassicModel, camera, scene);
        scene.add(gameboyClassicModel);
    });

    modelName = `childhood_books.glb`;
    url = `assets/${modelName}`;
    gltfLoader.load(url, async function (gltf) {
        childhoodBooksModel = gltf.scene;
        childhoodBooksModel.scale.set(9,9,9);
        childhoodBooksModel.rotation.y -= Math.PI;
        childhoodBooksModel.position.x = -6;
        childhoodBooksModel.position.y = -0.65;
        childhoodBooksModel.position.z = -4;
        
        // wait until the model can be added to the scene without blocking due to shader compilation
        await renderer.compileAsync(childhoodBooksModel, camera, scene);
        scene.add(childhoodBooksModel);
    });
    
    // # Create a plane to the scene
    
    // ## Geometry
    const boxWidth = 20;
    const boxHeight = 0.25;
    const boxDepth = 12;
    const boxGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    
    // ## Material
    const boxMaterial = new THREE.MeshPhongMaterial({color: 0x331a00});

    // ## Mesh
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.x = 0.5;
    box.position.y = -0.85;

    // ## Add box to the scene
    scene.add(box);
    
    // # Creating light
    const color = 0xFFFFFF;
    const intensity = 150;
    const lightPos = 5;

    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, lightPos, 0);

    // ## Add light to the scene
    scene.add(light);

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
    renderer.setAnimationLoop(animate);
}

function animate() {
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
