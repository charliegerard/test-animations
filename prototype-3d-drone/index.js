window.onload = function(){
  var camera, controls, scene, renderer, light, ambientLight, material;
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

    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 0.1, 2000);
    camera.position.z = 60;

    scene = new THREE.Scene();

    controls = new THREE.OrbitControls(camera);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.addEventListener('change', render);

    light = new THREE.PointLight(0xffffff);
    light.position.copy(camera.position);

    ambientLight = new THREE.AmbientLight(0x404040);
    ambientLight.position.copy(camera.position);

    scene.add(camera);
    camera.add(light);
    camera.add(ambientLight);

    // var jsonLoader = new THREE.JSONLoader();
    var objLoader = new THREE.OBJLoader();

    var material = new THREE.MeshLambertMaterial({color: 0x3177AB});
    material.side = THREE.DoubleSide;

    droneGroup = new THREE.Group();

    objLoader.load('assets/drone.obj', function(object){
      object.traverse(function(child){
        if(child instanceof THREE.Mesh){
          child.material = material;
        }
      })
      object.position.set(0, -0.5, 1);
      droneGroup.add(object);
    })

    // Propellers
    // jsonLoader.load('assets/propeller.json', function(object){
    //   for(var i = 0; i < propellerMeshesCoordinates.length; i++){
    //     propellerMesh = new THREE.Mesh(object);
    //     propellerMeshes.push(propellerMesh);
    //     propellerMeshes[i].position.set(propellerMeshesCoordinates[i].x, propellerMeshesCoordinates[i].y, propellerMeshesCoordinates[i].z);
    //     propellerMesh.material = material;
    //     droneGroup.add(propellerMesh);
    //   }
    // })

    objLoader.load('assets/Propeller-NoPhong.obj', function(propellerObject){
      for(var i = 0; i < propellerMeshesCoordinates.length; i++){
        propellerObject.traverse(function(child){
          console.log('child', propellerObject);
          console.log(propellerMeshesCoordinates.length);
          if(child instanceof THREE.Mesh){
              // propellerMeshes.push(child);
              propellerMeshes.push(child);
              child.material = material;
              droneGroup.add(child);
          }
        })
        // propellerMeshes.push(child);
        propellerMeshes[i].position.set(propellerMeshesCoordinates[i].x, propellerMeshesCoordinates[i].y, propellerMeshesCoordinates[i].z);
        // droneGroup.add(propellerObject);
      }
    })

    droneGroup.rotation.set(0.5, -0.5,0);
    var originalScale = container.offsetWidth / container.offsetHeight - 0.45;
    var minScale = 0.5;
    var maxScale = 1.1;
    var newScale = (originalScale <= minScale) ? minScale : (originalScale >= maxScale) ? maxScale : originalScale;

    droneGroup.scale.set(newScale, newScale, newScale);
    controls.target.set(0,0,0);
    scene.add(droneGroup)

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
  }

  function onWindowResize(){
    var scale = (container.offsetWidth / container.offsetHeight) - 0.45;
    var minScale = 0.5;
    var maxScale = 1.1;
    var newScale = (scale <= minScale) ? minScale : (scale >= maxScale) ? maxScale : scale;

    droneGroup.scale.set(newScale, newScale, newScale);

    renderer.setSize( container.offsetWidth, container.offsetHeight );
    camera.aspect	= container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
  }

  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    for(var i = 0; i < propellerMeshes.length; i++){
      if(i % 2 === 0){
        // propellerMeshes[i].rotation.y -= 1; //rotation clockwise
      } else {
        // propellerMeshes[i].rotation.y += 1; //rotation counter-clockwise
      }
    }
    render();
  }

  function render(){
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
}
