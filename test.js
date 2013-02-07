require.config({
	baseUrl:"./",
	shim: {
		'three.min': {
			exports: 'THREE'
		}
	}
});

Array.prototype.each = function(cb) {
	for(var i = 0; i < this.length; i++) {
		cb(this[i]);
	}
}


require(["three.min"], function(three) {
	var makeBaseCube = function() {
		var c = new three.CubeGeometry(1,1,1);
		return c;
	}

	var patternR = function(radius, count, cb) {
		var allGeo = [];
		for(var i = 0; i < count; i++) {
			var geo = cb();
			var mat = new three.Matrix4();
			mat.rotateY(Math.PI * 2 / count * i);
			mat.translate(new three.Vector3(radius, 0, 0));
			geo.vertices.each(function(v) {
				v.applyMatrix4(mat);
			});
			allGeo.push(geo);
		}
		return allGeo;
	}

	var scene = new three.Scene();
	var cam = new three.PerspectiveCamera(75, 4/3, 0.1, 1000);

	var renderer = new three.WebGLRenderer();
	renderer.setSize(800, 600);
	document.body.appendChild(renderer.domElement);

	var mat = new three.MeshLambertMaterial({color: 0xff0000});

	var allGeo = patternR(3, 13, makeBaseCube);
	allGeo.each(function(g) {
		scene.add(new three.Mesh(g, mat));
	});

	var light = new three.PointLight(0xffffff, 1, 100);
	light.position.set( 30, 30, 30);
	scene.add(light);

	var a = 0;
	var lastTime = new Date().getTime();
	var render = function() {
		requestAnimationFrame(render);
		var ct = new Date().getTime();
		var elapsed = (ct - lastTime) / 1000.0;
		lastTime = ct;

		a += elapsed;
		cam.position.z = Math.cos(a / 2) * 7;
		cam.position.x = Math.sin(a / 2) * 7;
		cam.position.y = Math.sin(a / 4) * 0.5 + 2;
		cam.lookAt(new three.Vector3(0,0,0));
		renderer.render(scene, cam);
	}

	render();
});
