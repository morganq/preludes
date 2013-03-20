require.config({
	baseUrl:"./",
	shim: {
		'three.min': {
			exports: 'THREE'
		}
	}
});

require(["three.min", "util", "util3d", "text!5.frag.glsl", "text!5.vert.glsl", "text!5.obj"],
	function(three, util, util3d, frag, vert, obj) {
	obj = JSON.parse(obj);
	var trans = util3d.trans;
	var mergeGeometry = util3d.mergeGeometry;
	var rotxyz = util3d.rotxyz;
	var scale = util3d.scale;
	var makeBaseCube = function() {
		var c = new three.CubeGeometry(0.6,0.5,1);
		return c;
	}

	var makeHex = function() {
		return util3d.rotxyz(new three.CircleGeometry(4, 6),0,-Math.PI/2,0);
	}

	var patternR = function(radius, count, cb, deg, start) {
		deg = (deg || 360) * 3.14159 / 180;
		start = (start || 0) * 3.14159 / 180;
		var parentGeo = new three.Geometry();
		for(var i = 0; i < count; i++) {
			parentGeo = mergeGeometry(parentGeo,
				rotxyz(trans(cb(), radius, 0, 0),
					   0, deg / count * i + start));
		}
		parentGeo.computeBoundingSphere();
		return parentGeo;
	}

	var scene = new three.Scene();
	var cam = new three.PerspectiveCamera(75, 4/3, 0.1, 1000);

	var renderer = new three.WebGLRenderer({
		antialias:true,
		preserveDrawingBuffer:true
	});
	renderer.autoClear = true;
	renderer.setClearColorHex(0x000000, 0.3);

	var dir = -1;
	var width = 800;
	var speed = 1;
	var velo = 0;

	renderer.domElement.onmousemove = function(e) {
		if(e.offsetX > width / 2) { dir = 1; }
		else { dir = -1; }
		pitch = e.offsetY / 100;
	}

	renderer.shadowMapEnabled = true;
	renderer.setSize(800, 600);
	document.body.appendChild(renderer.domElement);

	var uniforms = {
		time: { type:"f", value:0 },
		twist: { type:"f", value: 0}
	};

	var light;
	var ready = false;

	var a = 0;
	var time = 0;
	var lastTime = new Date().getTime();
	var fov = 75;

	var ind = 8

	var makeBGMesh = function(geo) {
		return new three.Mesh(geo, new three.MeshPhongMaterial({color:0xffffff})); 
	}

	var makeMesh = function(geo, start) {
		var attrs = {
			vTarget: {type:"v3", value:[]},
			timeOffset: {type:"f", value:[]},
			bottom: {type:"f", value:[]}
		};
		var bot = 999999999;
		for(var i = 0; i < geo.vertices.length; i++) { 
			if(geo.vertices[i].y < bot) { bot = geo.vertices[i].y; }
			attrs.timeOffset.value.push(start/3);
			if(i % 8 == 7) { start += 1; }
		}
		for(var i = 0; i < geo.vertices.length; i++) { 
			attrs.bottom.value.push(bot);
			var orthize = new three.Vector3(
				geo.vertices[i].x, geo.vertices[i].y, geo.vertices[i].z);
			if(i%8 < 4) {
				// based on model
				orthize.x = obj[ind][0] * 1.4
				orthize.z = obj[ind][2]
			}
			else {
				orthize.x = obj[ind][0]/2 * 1.4;
				orthize.z = obj[ind][2]/2;
			}
			ind += 1;
			attrs.vTarget.value.push(orthize);
		}
		var mat = new three.ShaderMaterial({
			vertexShader: vert,
			fragmentShader: frag,
			uniforms: uniforms,
			attributes: attrs,
			transparent:true,
		});
		return new three.Mesh(geo, mat);
	}

	var makeScene = function() {
		scene = new three.Scene();
		for(var i = 0; i < 5; i++) {
			var base = makeBGMesh(trans(
						rotxyz(
							new three.CircleGeometry(4 + i*2, 6),
							-Math.PI/2, 0, 0),
						0, -0.5 - i, 0), 0);
			scene.add(base);
		}

		var y = 0;
		var scTime = 0;
		var sculptPart = function(radius, count, degrees, start) {
			var g = patternR(radius, count, makeBaseCube, degrees, start);
			var sy = Math.cos(y*3) * 0.2 + 0.55;
			scale(g, 1, sy, 1);
			trans(g, 0, y-0.25, 0);
			y += 0.5 * sy;
			scene.add(makeMesh(g,scTime));
			scTime += count + 5;
		}

		sculptPart(2.5, 13, 360, 0);
		sculptPart(2.4, 12, 360, 50);
		sculptPart(2.3, 9, 300, -30);
		sculptPart(2.1, 9, 270, 0);
		sculptPart(1.9, 6, 240, 30);
		sculptPart(1.6, 4, 180, 80);
		sculptPart(1.4, 3, 140, 120);
		sculptPart(1.2, 2, 120, 130);
		sculptPart(1.4, 4, 180, 0);
		sculptPart(1.8, 5, 180, -45);
		sculptPart(2.2, 7, 220, -70);
		sculptPart(2.4, 10, 260, -125);
		sculptPart(2.5, 14, 360, -135);
		sculptPart(2.65, 13, 360, -95);
		sculptPart(2.73, 15, 360, -55);
		sculptPart(2.8, 15, 360, -95);
		sculptPart(2.81, 14, 360, -55);
		sculptPart(2.83, 12, 280, -95);
		sculptPart(2.84, 8, 240, -130);
		sculptPart(2.84, 8, 200, -160);
		sculptPart(2.84, 7, 180, -180);
		sculptPart(2.84, 9, 210, -210);
		sculptPart(2.83, 12, 250, -240);
		sculptPart(2.81, 14, 300, -95);
		sculptPart(2.73, 14, 360, -55);
		sculptPart(2.81, 14, 360, -95);

		y = -40;
		bgTime = 0;
		var bgPart = function(radius, count, start) {
			var g = patternR(radius, count, makeHex, 360, start);
			var sy = 8;
			trans(g, 0, y, 0);
			y += 0.5 * sy;
			scene.add(makeBGMesh(g,scTime));
			scTime += count + 5;
		}

		for(var i = 0; i < 16; i++) {
			var z = Math.abs(i-8)*0;
			bgPart(30-z, 12, 0);
			bgPart(29.8-z, 12, 15);
		}


		light = new three.PointLight(0x000000, 10, 70);
		light.position.set( 0, 5, 0);
		scene.add(light);

		ready = true;
		a = 0;
		time = 0;
		lastTime = new Date().getTime();
		fov = 75;
	}

	var pitch = 0;
	var yaw = 0;

	var speeds = [
		[0, 0.3],
		[4.9, 0.3],
		[5, 2], 
		[10, 1],
		[999999999, 1]
	];

	var twist = 0;

	var render = function() {
		if(!ready) { return; }
		requestAnimationFrame(render);
		//renderer.updareShadowMap(scene, cam);
		var ct = new Date().getTime();
		var elapsed = (ct - lastTime) / 1000.0;
		lastTime = ct;

		time += elapsed;
		uniforms.time.value = time;
		twist = Math.min(Math.max(twist + dir*speed*elapsed*2, 0), 1);
		uniforms.twist.value = twist;

		//light.intensity = Math.max(10 - time, 2);
		light.position.x = Math.sin(time) * 5 + 5;

		velo += dir * speed * elapsed;
		velo = Math.max(Math.min(velo, speed * 0.1), speed * -0.1);
		yaw += velo;

		for(var i = 0; i < speeds.length; i++) {
			var lastS = 0;
			var lastT = 0;
			var nextS = 0;
			var nextT = 0;
			if(speeds[i][0] > time) {
				lastS = speeds[i-1][1];
				lastT = speeds[i-1][0];
				nextS = speeds[i][1];
				nextT = speeds[i][0];
				var t = (time - lastT) / (nextT - lastT);
				speed = (nextS - lastS) * t + lastS;
				break;
			}
		}
		speed = 0.5;

		cam.position.z = Math.cos(yaw / 2) * 7;
		cam.position.x = Math.sin(yaw / 2) * 7;
		cam.position.y = pitch;
		if(Math.random() > 0.95) {
			//fov = Math.random() * speed * 5 + 75;
		}
		cam.setLens(45, fov);
		var tx = Math.pow(Math.random(), 4) * Math.cos(time) * speed * 0.3;
		var tz = Math.pow(Math.random(), 4) * Math.sin(time) * speed * 0.3;
		tx = 0;
		ty = 0;
		var ty = 3;
		cam.lookAt(new three.Vector3(tx,ty,tz));
		renderer.render(scene, cam);
	}

	update = function() {
		makeScene();
		render();
	};
	update();
});
