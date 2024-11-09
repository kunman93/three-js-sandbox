import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DecalGeometry } from 'three/examples/jsm/Addons.js';

let renderer: any, camera: any, scene: any, controls: any
let clock: any
let orbGroup: any, orb: any, decal: any;

/**
 *  ---- Orb animation in Three.js ---- 
 */
main();

function main() {
    // # Initialising the canvas and the renderer
    const canvas = document.querySelector('#canvas-orb') ?? undefined;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas });

    // # Setting up the camera
    // ## Setting for the camera
    const fov = 75; // field of view, 75 degree
    const aspect = 2;  // it is the display aspect of the canvas, the default canvas is 300x150 pixel, which makes the aspect 300/150 or 2.
    // near and far represent the space in front of the the camera that will be rendered. Anything before or after that range will be clipped (not drawn)
    const near = 0.1;
    const far = 30;

    // ## Initalising the camera
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far); // Anything inside the defined frustum will be drawn. Anything outside will not.
    camera.position.set(0, 0, -2); // Camera Coordinate System --> left-handed (index finger => x, thumb => y, middle finger => z)

    // # Setting up the scene
    scene = new THREE.Scene();

    // Setting up the clock
    clock = new THREE.Clock();

    // # Create an Orb with image
    
    // ## Geometry
    const radius = 1;
    const detail = 2;
    const geometry = new THREE.IcosahedronGeometry(radius, detail);

    // ## Material
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x808080,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        flatShading: true,
        shininess: 20,
        specular: 0x222222,
    });

    // ## Orb Mesh 
    orb = new THREE.Mesh(geometry, material);

    // ## DecalGeometry
    const img = 'css.png';
    const texture = new THREE.TextureLoader().load(`/assets/tech/${img}`);

    const position = new THREE.Vector3(0, 0, 1);
    const orientation = new THREE.Euler(2 * Math.PI); // good
    const size = new THREE.Vector3(1, 1, 1); // good
    const decalGeometry = new DecalGeometry( orb, position, orientation, size ); 
    const decalMaterial = new THREE.MeshPhongMaterial( { 
        map: texture, 
        transparent: true,
        flatShading: true,
        shininess: 20,
        specular: 0x222222,
    } ); 
    decal = new THREE.Mesh( decalGeometry, decalMaterial ); 
    decal.rotation.y = -Math.PI;

    // ## Add orb and decal to orbGroup
    orbGroup = new THREE.Group();
    orbGroup.add(orb);
    orbGroup.add(decal);

    // ## Add orbGroup to the scene
    scene.add(orbGroup)

    // # Creating light
    const color = 0xFFFFFF;
    const intensity = 250;
    const lightPos = 10;

    const lightTop = new THREE.PointLight(color, intensity);
    lightTop.position.set(0, lightPos, 0);

    const lightBelow = new THREE.PointLight(color, intensity);
    lightBelow.position.set(0, -lightPos, 0);

    const lightLeft = new THREE.PointLight(color, intensity);
    lightLeft.position.set(-lightPos, 0, 0);

    const lightRight = new THREE.PointLight(color, intensity);
    lightRight.position.set(lightPos, 0, 0);

    const lightFront = new THREE.PointLight(color, intensity);
    lightFront.position.set(0, 0, lightPos);

    const lightBack = new THREE.PointLight(color, intensity);
    lightBack.position.set(0, 0, -lightPos);


    // ## Add light to the scene
    scene.add(lightTop);
    scene.add(lightBelow);
    scene.add(lightLeft);
    scene.add(lightRight);
    scene.add(lightFront);
    scene.add(lightBack);

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
    const time = clock.getElapsedTime();

    orbGroup.rotation.y += Math.sin( time ) * 0.005;
    orbGroup.position.x = Math.sin( time ) * 0.05;
    orbGroup.position.y = Math.sin( time ) * 0.05;

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

