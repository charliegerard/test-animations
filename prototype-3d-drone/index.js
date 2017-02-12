window.onload = function(){
  var camera, controls, scene, renderer, light, material;
  var droneMesh, droneGroup, propellerMesh;
  var propellerMeshes = [];
  var propellerMeshesCoordinates = [
    {x: 18.7, y: -1.1, z: 0.3}, //right
    {x: -18.7, y: -1.1, z: 0.3}, //left
    {x: -9.3, y: -1.1, z: -15.8}, //back left
    {x: 9.3, y: -1.1, z: -15.8}, //back right
    {x: -9.3, y: -1.1, z: 16.3}, //front left
    {x: 9.3, y: -1.1, z: 16.3} //front right
  ]

  init();
  animate();

  function init(){
    var container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 100;

    scene = new THREE.Scene();

    controls = new THREE.OrbitControls(camera);
    controls.minDistance = 30;
    controls.maxDistance = 100;
    controls.addEventListener('change', render);

    light = new THREE.PointLight(0xffffff);
    light.position.copy(camera.position);
    scene.add(camera);
    camera.add(light);

    var jsonLoader = new THREE.JSONLoader();

    var material = new THREE.MeshLambertMaterial({color: 0xffffff});
    material.side = THREE.DoubleSide;

    droneGroup = new THREE.Group();

    // Drone body
    jsonLoader.load('assets/drone.json', function(object){
      droneMesh = new THREE.Mesh(object);
      droneMesh.position.set(0,-0.5,1);
      droneMesh.material = material;
      droneGroup.add(droneMesh);
    })

    // Propellers
    jsonLoader.load('assets/propeller.json', function(object){
      for(var i = 0; i < propellerMeshesCoordinates.length; i++){
        propellerMesh = new THREE.Mesh(object);
        propellerMeshes.push(propellerMesh);
        propellerMeshes[i].position.set(propellerMeshesCoordinates[i].x, propellerMeshesCoordinates[i].y, propellerMeshesCoordinates[i].z);
        propellerMesh.material = material;
        droneGroup.add(propellerMesh);
      }
    })

    droneGroup.rotation.set(0.5, -0.5,0);
    scene.add(droneGroup)

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize(){
    camera.aspect = window.innerwidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  }

  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    for(var i = 0; i < propellerMeshes.length; i++){
      if(i % 2 === 0){
        propellerMeshes[i].rotation.y -= 0.05; //rotation clockwise
      } else {
        propellerMeshes[i].rotation.y += 0.05; //rotation counter-clockwise
      }
    }
    render();
  }

  function render(){
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
}
