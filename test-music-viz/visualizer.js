var LoopVisualizer = (function() {

	var RINGCOUNT = 16;
	var SEPARATION = 300;
	var INIT_RADIUS = 50;
	var SEGMENTS = 512;
	var VOL_SENS = 2;
	var BIN_COUNT = 512;

	var rings = [];
	var levels = [];
	var colors = [];
	var loopHolder = new THREE.Object3D();
	var loopGeom;//one geom for all rings
	var perlin = new ImprovedNoise();
	var noisePos = 0;
	var freqByteData;
	var timeByteData;


	function init() {

		rings = [];
		levels = [];
		colors = [];

		////////INIT audio in
		freqByteData = new Uint8Array(analyser.frequencyBinCount);
		timeByteData = new Uint8Array(analyser.frequencyBinCount);


		//create ring geometry
		var loopShape = new THREE.Shape();
		loopShape.absarc( 0, 0, INIT_RADIUS, 0, Math.PI*2, false );

		loopGeom = loopShape.createPointsGeometry(SEGMENTS/2);
		loopGeom.dynamic = true;

		//create rings
		scene.add(loopHolder);
		var scale = 1;

    var material = new THREE.MeshNormalMaterial();

    // Circle made of cubes.
        // geometry
    var geometry = new THREE.BoxGeometry(1, 1, 1, 0, Math.PI * 2, 0, Math.PI * 2)
      // material
    var material = new THREE.MeshBasicMaterial({
      color: 0xfff000,
      wireframe: false
    });

    // parent
    parent = new THREE.Object3D();
    scene.add(parent);
    var numberOfSpheres = 10;
    var radiansPerSphere = 2 * Math.PI / numberOfSpheres;
    // pivots
    var pivots = [];
    for (var i = 0; i < numberOfSpheres; i++) {
      var pivot = new THREE.Object3D();
      pivot.rotation.z = i * radiansPerSphere;
      parent.add(pivot);
      pivots.push(pivot);
    }

    var meshes = pivots.map((pivot) => {
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = 5;
      pivot.position.z = 550;
      pivot.add(mesh)
      return mesh;
    });

    // End



		for(var i = 0; i < RINGCOUNT; i++) {

      for(var j = 0; j < 10; j++){
        var geometry = new THREE.BoxGeometry(1,1,1);
        var cube = new THREE.Mesh(geometry, material);
        rings.push(cube);
        cube.scale.x *= 1.05;
        cube.scale.y *= 1.05;
        cube.position.set(0, 5, 570);
        loopHolder.add(cube);
      }

			var m = new THREE.LineBasicMaterial( { color: 0xffffff,
				linewidth: 1 ,
				opacity : 0.7,
				blending : THREE.AdditiveBlending,
				depthTest : false,
				transparent : true
			});

			var line = new THREE.Line( loopGeom, m);

			// rings.push(line);
			scale *= 1.05;
			line.scale.x = scale;
			line.scale.y = scale;
			// loopHolder.add(line);

			levels.push(0);
			colors.push(0);

		}

	}

	function remove() {
		if (loopHolder){
			for(var i = 0; i < RINGCOUNT; i++) {
				loopHolder.remove(rings[i]);
			}
		}
	}

	function update() {

		analyser.getByteFrequencyData(freqByteData);
		analyser.getByteTimeDomainData(timeByteData);

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

		//write current waveform into all rings
		for(var j = 0; j < SEGMENTS; j++) {
			loopGeom.vertices[j].z = timeByteData[j]*2;//stretch by 2
		}
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
			rings[i].scale.z = normLevel;
		}

	}

	return {
		init:init,
		update:update,
		remove:remove,
		loopHolder:loopHolder
	};
	}());
