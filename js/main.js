// Set up the scene, camera, and renderer as global variables.
var scene, camera, renderer, model;

init();
animate();

// Sets up the scene.
function init() {

    // Create the scene and set the scene size.
    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 20000);
    // camera.position.set(-8, 3, -8);
    camera.position.set(0.5, 3, 13);
    scene.add(camera);

    scene.add(makeSkybox([
        'assets/images/skybox/px.jpg', // right
        'assets/images/skybox/nx.jpg', // left
        'assets/images/skybox/py.jpg', // top
        'assets/images/skybox/ny.jpg', // bottom
        'assets/images/skybox/pz.jpg', // back
        'assets/images/skybox/nz.jpg' // front
    ], 5000));

    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    // Set the background color of the scene.
    renderer.setClearColor(0x003366, 1);

    // Create a light, set its position, and add it to the scene.
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100, 200, 100);
    light.castShadow = true;
    scene.add(light);

    // Load in the mesh and add it to the scene.

    // var loader = new THREE.JSONLoader();
    // loader.load("assets/models/treehouse_logo.js", function(geometry) {
    //     var material = new THREE.MeshLambertMaterial({
    //         color: 0x55B663
    //         //  ,wireframe: true
    //     });
    //     model = new THREE.Mesh(geometry, material);
    //     scene.add(model);
    // });

    // var loader = new THREE.ColladaLoader();
    // loader.load("assets/models/dcu_superman/CHRNPCICOHER101_SKMESHout.dae", function(collada) {
    //     model = collada.scene;
    //     // var skin = collada.skins[0];
    //     console.log(collada);
    //     model.position.set(0, 0, 0);
    //     model.scale.set(1, 1, 1);
    //     scene.add(model);
    // });

    var objectLoader = new THREE.OBJLoader();
    objectLoader.load("assets/models/IronMan/IronMan.obj", function(obj) {
        model = obj;
        model.position.set(0, 0, 0);
        model.scale.set(0.02, 0.02, 0.02);
        model.castShadow = true;
        model.position.y = -2;
        scene.add(model);
    });


    // Add OrbitControls so that we can pan around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

}


// Renders the scene and updates the render as needed.
function animate() {
    // Read more about requestAnimationFrame at http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    requestAnimationFrame(animate);
    if (model) {
        // model.rotation.x += 0.005;
        // model.rotation.y += 0.005;
        // model.rotation.z += 0.005;
    }
    // Render the scene.
    renderer.render(scene, camera);
    controls.update();
}

// init 3D stuff
function makeSkybox(urls, size) {
    var skyboxCubemap = new THREE.CubeTextureLoader().load(urls);
    skyboxCubemap.format = THREE.RGBFormat;
    var skyboxShader = THREE.ShaderLib['cube'];
    skyboxShader.uniforms['tCube'].value = skyboxCubemap;
    return new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.ShaderMaterial({
            fragmentShader: skyboxShader.fragmentShader,
            vertexShader: skyboxShader.vertexShader,
            uniforms: skyboxShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        })
    );
}
