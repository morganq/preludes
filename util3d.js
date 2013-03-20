define(['util', 'three.min'], function(util, three) {
	var exports = {};
	exports.rotxyz = function(geo, x, y, z) {
		var mat = new three.Matrix4();
		if(x) { mat.rotateX(x); }
		if(y) { mat.rotateY(y); }
		if(z) { mat.rotateZ(z); }
		geo.vertices.each(function(v) {
			v.applyMatrix4(mat);
		});
		geo.normals.each(function(n) {
			n.applyMatrix4(mat);
		});
		geo.faces.each(function(f) {
			f.normal.applyMatrix4(mat);
		});
		return geo;
	}

	exports.trans = function(geo, x, y, z) {
		geo.vertices.each(function(v) {
			v.x += x; v.y += y; v.z += z;
		});
		return geo;
	}

	exports.scale = function(geo, x, y, z) {
		geo.vertices.each(function(v) {
			v.x *= x; v.y *= y; v.z *= z;
		});
		return geo;
	}

	exports.mergeGeometry = function(a, b) {
		var geo = new three.Geometry();
		geo.vertices.extend(a.vertices);
		var start = geo.vertices.length;
		geo.vertices.extend(b.vertices);
		geo.faces.extend(a.faces);
		geo.faces.extend(b.faces.map(function(f) {
			if(f.d !== undefined) {
				return new three.Face4(f.a + start, 
								 f.b + start,
								 f.c + start,
								 f.d + start,
								 f.normal, f.color, f.materialIndex);
			}
			return new three.Face3(f.a + start,
							 f.b + start,
							 f.c + start,
							 f.normal, f.color, f.materialIndex);
		}));
		return geo;
	};
	return exports;
});
