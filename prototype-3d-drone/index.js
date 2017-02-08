window.onload = function(){
  var camera, controls, scene, renderer, light, material;
  var droneMesh, droneGroup, propellerMesh;
  var propellerMeshes = [];
  var propellerMeshesCoordinates = [
    {x: 18.7, y: -1.2, z: 1}, //right
    {x: -18.7, y: -1.2, z: 1}, //left
    {x: -9.3, y: -1.2, z: -15.3}, //back left
    {x: 9.3, y: -1.2, z: -15.3}, //back right
    {x: -9.3, y: -1.2, z: 17.3}, //front left
    {x: 9.3, y: -1.2, z: 17.3} //front right
  ]

  init();
  animate();

  function init(){
    var container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 100;

    scene = new THREE.Scene();

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', render);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1,1,1);
    scene.add(light);

    var jsonLoader = new THREE.JSONLoader();

    var material = new THREE.MeshLambertMaterial({color: 0xffffff});

    droneGroup = new THREE.Group();

    // Drone body
    jsonLoader.load('assets/drone-body-NoPhong.json', function(object){
      droneMesh = new THREE.Mesh(object);
      droneMesh.position.set(0,-0.5,1);
      droneMesh.material = material;
      droneGroup.add(droneMesh);
    })

    // Propellers
    jsonLoader.load('assets/Propeller-NoPhong.json', function(object){
      for(var i = 0; i < propellerMeshesCoordinates.length; i++){
        propellerMesh = new THREE.Mesh(object);
        propellerMeshes.push(propellerMesh);
        propellerMeshes[i].position.set(propellerMeshesCoordinates[i].x, propellerMeshesCoordinates[i].y, propellerMeshesCoordinates[i].z);
        propellerMesh.material = material;
        droneGroup.add(propellerMesh);
      }
    })

    scene.add(droneGroup)

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize(){
    console.log(droneGroup);
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
