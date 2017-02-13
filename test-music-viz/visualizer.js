var LoopVisualizer = (function() {

	var RINGCOUNT = 16;
	var SEPARATION = 300;
	var INIT_RADIUS = 50;
	var SEGMENTS = 512;
	var VOL_SENS = 2;
	var BIN_COUNT = 512;
	var RINGS = 3;

	var rings = [];
	var levels = [];
	var colors = [];
	var loopHolder = new THREE.Object3D();
	var loopGeom;//one geom for all rings
	var perlin = new ImprovedNoise();
	var noisePos = 0;
	var freqByteData;
	var timeByteData;

	var numberOfSpheres = 30;
	var radiansPerSphere = 2 * Math.PI / numberOfSpheres;
	var pivots = [];
	var geometry, material;
	var pivot;
	var meshes;

	var mesh;
	var array = new Array();
	var boost = 0;
	var meshesArray = [];

	function init() {

		rings = [];
		levels = [];
		colors = [];

		////////INIT audio in
		freqByteData = new Uint8Array(analyser.frequencyBinCount);
		timeByteData = new Uint8Array(analyser.frequencyBinCount);
		array = new Uint8Array(analyser.frequencyBinCount);

		//create ring geometry
		var loopShape = new THREE.Shape();
		loopShape.absarc( 0, 0, INIT_RADIUS, 0, Math.PI*2, false );
		loopGeom = loopShape.createPointsGeometry(SEGMENTS/2);
		loopGeom.dynamic = true;

		//create rings
		scene.add(loopHolder);
		var scale = 1;
    material = new THREE.MeshNormalMaterial();

    // Circle made of cubes.
    geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5, 0, Math.PI * 2, 0, Math.PI * 2);
    parent = new THREE.Object3D();
    scene.add(parent);

		for(var y = 0; y < RINGS; y++){
			createRing(y + 1);
		}

    // End

		for(var i = 0; i < RINGCOUNT; i++) {

			// rings.push(line);
			scale *= 1.05;
			// loopHolder.add(line);

			levels.push(0);
			colors.push(0);
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
			mesh.position.y = 0.5 * position;
			pivot.position.z = 580;
			pivot.add(mesh);
			rings.push(mesh);
			// loopHolder.add(mesh);
			// loopHolder.position.set(0,0,550)
			meshesArray.push(mesh);
			return mesh;
		});

	}

	function remove() {
		if (loopHolder){
			for(var i = 0; i < RINGCOUNT; i++) {
				loopHolder.remove(rings[i]);
			}
		}
	}

	function update() {

		// analyser.getByteFrequencyData(freqByteData);
		// analyser.getByteTimeDomainData(timeByteData);

		analyser.getByteFrequencyData(array);

		for(var i = 0; i < array.length; i++){
			boost += array[i];
		}
		boost = (boost / array.length);

		//add a new average volume onto the list
		var sum = 0;
		for(var i = 0; i < BIN_COUNT; i++) {
			sum += freqByteData[i];
		}
		var aveLevel = sum / BIN_COUNT;
		var scaled_average = (aveLevel / 256) * VOL_SENS; //256 is the highest a level can be
		levels.push(scaled_average);
		levels.shift(1);

		//add a new color onto the list
		noisePos += 0.005;
		var n = Math.abs(perlin.noise(noisePos, 0, 0));
		colors.push(n);
		colors.shift(1);

		var k = 0;
		//write current waveform into all rings
		// for(var j = 0; j < SEGMENTS; j++) {
			// loopGeom.vertices[j].z = timeByteData[j]*2;//stretch by 2

			for( var x = 0; x < meshesArray.length; x++){
				//test
				var scale = (array[k]  + boost) / 20;
				meshesArray[x].scale.z = (scale < 1 ? 1 : scale);
				// meshesArray[x].position.x = (scale < 1 ? 1 : scale);
				// meshesArray[x].position.y = (scale < 1 ? 1 : scale);
				k += (k < array.length ? 1 : 0);
			}

		// }
		// link up last segment
		loopGeom.vertices[SEGMENTS].z = loopGeom.vertices[0].z;
		loopGeom.verticesNeedUpdate = true;

		for( i = 0; i < RINGCOUNT ; i++) {
			var ringId = RINGCOUNT - i - 1;
			var normLevel = levels[ringId] + 0.01; //avoid scaling by 0
			var hue = colors[i];
			// rings[i].material.color.setHSL(hue, 1, normLevel);
			// rings[i].material.linewidth = normLevel*3;
			// rings[i].material.opacity = normLevel;
			// rings[i].scale.z = normLevel;
		}
	}

	return {
		init:init,
		update:update,
		remove:remove,
		loopHolder:loopHolder
	};
	}());
