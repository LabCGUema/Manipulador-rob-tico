var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, orbit;

var camera, scene;
var canvasRenderer, webglRenderer;

var mesh, zmesh, geometry, materials;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var meshes = [];

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000);
    camera.position.x = 40;
    camera.position.y = 40;
    camera.position.z = 5;



    scene = new THREE.Scene();

    // LIGHTS
    var ambient = new THREE.AmbientLight(0x666666);
    scene.add(ambient);

    var directionalLight = new THREE.DirectionalLight(0xffeedd);
    directionalLight.position.set(0, 70, 100).normalize();
    scene.add(directionalLight);

    // RENDERER
    webglRenderer = new THREE.WebGLRenderer();
    webglRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    webglRenderer.domElement.style.position = "relative";

    // Habilita rotacionar o objeto
    orbit = new THREE.OrbitControls( camera, webglRenderer.domElement );
    orbit.enableZoom = true;


    container.appendChild(webglRenderer.domElement);
    var loader = new THREE.JSONLoader(),
        callbackKey = function (geometry, materials,bones) {
            createScene(geometry, materials, 0, 0, 0, 6);
        };
    loader.load("public/images/manipulador.js", callbackKey);

    window.addEventListener('resize', onWindowResize, false);

}

function createScene(geometry, material, x, y, z, scale) {
    material.skinning = true;
    mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(material));
    mesh.position.set(x, y, z);
    mesh.scale.set(scale, scale, scale);
    meshes.push(mesh);




    var helpset = new THREE.SkeletonHelper(mesh);
    scene.add(helpset);



    scene.add(mesh);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    webglRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {


    camera.lookAt(scene.position);
    webglRenderer.render(scene, camera);
}