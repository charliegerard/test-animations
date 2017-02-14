var LoopVisualizer = (function() {

	var INIT_RADIUS = 50;
	var SEGMENTS = 512;
	var BIN_COUNT = 512;
	var RINGS = 6;

	var rings = [];
	var loopHolder = new THREE.Object3D();
	var freqByteData;
	var timeByteData;

	var numberOfSpheres = 20;
	var radiansPerSphere = 2 * Math.PI / numberOfSpheres;
	var pivots = [];
	var geometry, material;
	var pivot;
	var meshes;

	var mesh;
	var boost = 0;
	var meshesArray = [];

	function init() {

		rings = [];

		////////INIT audio in
		freqByteData = new Uint8Array(analyser.frequencyBinCount);
		timeByteData = new Uint8Array(analyser.frequencyBinCount);

		//create rings
		scene.add(loopHolder);
    material = new THREE.MeshNormalMaterial();

    // Circle made of cubes.
    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2, 0, Math.PI * 2, 0, Math.PI * 2);
    parent = new THREE.Object3D();
    scene.add(parent);

		for(var y = 0; y < RINGS; y++){
			createRing(y + 1);
		}
	}

	function createRing(position){

		for (var i = 0; i < numberOfSpheres; i++) {
			pivot = new THREE.Object3D();
			pivot.rotation.z = i * radiansPerSphere;
			parent.add(pivot);
			pivots.push(pivot);
		}

		meshes = pivots.map((pivot) => {
			mesh = new THREE.Mesh(geometry, material);
			mesh.position.y = 0.6 * position;
			// mesh.scale.z = 0;
			// pivot.position.z = 800;
			pivot.position.z = 580;
			pivot.add(mesh);
			rings.push(mesh);
			// loopHolder.add(mesh);
			// loopHolder.position.set(0,0,550);
			// mesh.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, - 0.2 / 2 ) );
			meshesArray.push(mesh);
			return mesh;
		});
	}

	function remove() {
		if (loopHolder){
			for(var i = 0; i < RINGS; i++) {
				loopHolder.remove(meshesArray[i]);
			}
		}
	}

	function update() {
		analyser.getByteFrequencyData(freqByteData);

		for(var i = 0; i < freqByteData.length; i++){
			boost += freqByteData[i];
		}
		boost = (boost / freqByteData.length);

		var k = 0;
		for( var x = 0; x < meshesArray.length; x++){
			//test
			var scale = (freqByteData[k]  + boost) / 20;
			// meshesArray[x].scale.z = (scale < 1 ? 1 : scale);
			meshesArray[x].scale.z = (scale < 1 ? 1 : scale);
			// meshesArray[x].translateZ(scale/2);
			// meshesArray[x].geometry.parameters.height = (scale < 1 ? 1 : scale);
			meshesArray[x].position.x += 0.01;
			meshesArray[x].position.y += 0.01;
			k += (k < freqByteData.length ? 1 : 0);

			if(meshesArray[x].position.x > 1){
				meshesArray[x].position.x = 0;
				meshesArray[x].position.y = 0;
			}
		}
	}

	return {
		init:init,
		update:update,
		remove:remove,
		loopHolder:loopHolder
	};
	}());
