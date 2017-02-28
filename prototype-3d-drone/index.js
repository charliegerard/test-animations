window.onload = function(){
  var camera, controls, scene, renderer, light, ambientLight, material;
  var droneMesh, droneGroup, propellerMesh;
  var propellerMeshes = [];
  var blurMeshes = [];
  var propellerMeshesCoordinates = [
    {x: 18.7, y: -1.1, z: 0.3}, //right
    {x: -18.7, y: -1.1, z: 0.3}, //left
    {x: -9.3, y: -1.1, z: -15.8}, //back left
    {x: 9.3, y: -1.1, z: -15.8}, //back right
    {x: -9.3, y: -1.1, z: 16.3}, //front left
    {x: 9.3, y: -1.1, z: 16.3} //front right
  ]

  var objLoader, manager, mtlLoader, jsonLoader;
  var speed = 0.03;

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

    jsonLoader = new THREE.JSONLoader();
    manager = new THREE.LoadingManager();
    objLoader = new THREE.OBJLoader(manager);

    material = new THREE.MeshLambertMaterial({color: 0x3177AB});
    material.side = THREE.DoubleSide;

    droneGroup = new THREE.Group();

    loadDroneBody();
    loadPropellers();
    loadDisk();

    // Display the drone once all assets have been loaded.
    manager.onLoad = function(){
      droneGroup.rotation.set(0.6, -0.4, 0);

      var originalScale = container.offsetWidth / container.offsetHeight - 0.9;
      var minScale = 0.5;
      var maxScale = 1.1;
      var newScale = (originalScale <= minScale) ? minScale : (originalScale >= maxScale) ? maxScale : originalScale;

      droneGroup.scale.set(newScale, newScale, newScale);

      droneGroup.position.set(0, 0, 0);
      scene.add(droneGroup);
    }

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
  }

  function loadPropellers(){
    for(var i = 0; i < propellerMeshesCoordinates.length; i++){
      loadPropeller(propellerMeshesCoordinates[i]);
    }
  }

  function loadPropeller(coordinates){
    objLoader.load('assets/Propeller-NoPhong.obj', function(propellerObject){
        propellerObject.traverse(function(child){
          if(child instanceof THREE.Mesh){
              child.material = material;
          }
        })
        propellerMeshes.push(propellerObject)
        propellerObject.position.set(coordinates.x,coordinates.y,coordinates.z);
        droneGroup.add(propellerObject);
    });
  }

  function loadDisk(){
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('assets/Assets/Blur/Disk-test.png', function(tex){
      // var texture = THREE.TextureLoader('assets/Assets/Blur/Disk.png');
      var blurMaterial = new THREE.MeshPhongMaterial( { map: tex, transparent: true, alphaTest: 0, opacity: 1, alphaMap: tex } );
      blurMaterial.side = THREE.DoubleSide;
      blurMaterial.depthWrite = false;

      objLoader.load('assets/Assets/Blur/Blur.obj', function(object){
        object.traverse(function(child){
          if(child instanceof THREE.Mesh){
            child.material = blurMaterial
          }
        });

        object.scale.set(0.035,0.035,0.035);
        object.position.set(18.7,-2,0.3);
        object.rotation.set(0, 1, 0);
        blurMeshes.push(object);

        droneGroup.add(object);
      });
    });
  }

  function loadDroneBody(){
    objLoader.load('assets/drone.obj', function(object){
      object.traverse(function(child){
        if(child instanceof THREE.Mesh){
          child.material = material;
        }
      })
      object.position.set(0, -0.5, 1);
      droneGroup.add(object);
    })
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
        propellerMeshes[i].rotation.y -= 0.1; //rotation clockwise
      } else {
        propellerMeshes[i].rotation.y += 0.1; //rotation counter-clockwise
      }
    }

    for(var i = 0; i < blurMeshes.length; i++){
      if(i % 2 === 0){
        blurMeshes[i].rotation.y -= 0.1; //rotation clockwise
      } else {
        blurMeshes[i].rotation.y += 0.1; //rotation counter-clockwise
      }
    }
    //Up/down movement
    droneGroup.position.y += speed;

    if( droneGroup.position.y >= 1 ){
      speed = -speed;
    } else if (droneGroup.position.y <= -1){
      speed = -speed;
    }

    render();
  }

  function render(){
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
}
