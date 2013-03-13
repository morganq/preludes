#if MAX_POINT_LIGHTS > 0
	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];
	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];
	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];
#endif

varying vec3 vNormal;
varying vec3 vPosition;
uniform float time;
varying float t;
varying float bot;

void main() {
	vec3 pos = vec3(0.0, 5.0, 0.0);//pointLightPosition[0];
	vec3 offset = pos-vPosition;
	float dp = dot(vNormal, offset);
	float len = length(offset);
	float bright = 1.0 / (len * dp);
	vec4 absPos = viewMatrix * vec4(pos, 1.0);
	vec4 absNorm = viewMatrix * vec4(vNormal, 1.0);
	//float relHeight = (bot + time*4.0-t)/10.0 - vPosition.y - 3.0;
	float relHeight = time/5.0 - vPosition.y - 1.0;
	float alpha = relHeight - sin(vPosition.x * 6.0 + time*3.0) * cos(vPosition.z * 4.0 + time*6.0) * 0.04 + 0.2;
	alpha = (alpha > 0.5) ? 1.0 : 0.0;

	float r2 = pow(2.0/len, 2.0) * 3.0;
	float g2 = pow(2.0/len, 1.5 + sin(time+vPosition.y*1.3) * 0.2) * 1.5;
	float b2 = pow(2.0/len, 1.0 + sin(time*1.2+vPosition.y*2.0) * 0.15);

	float r = bright * (1.0-alpha) + r2 * alpha;
	float g = bright * (1.0-alpha) + g2 * alpha;
	float b = bright * (1.0-alpha) + b2 * alpha;

	float st = time * 3.0;

	//gl_FragColor = vec4(bright, bright, bright, 1.0);
	gl_FragColor = vec4(r, g, b, 1.0);
	//gl_FragColor = vec4(vNormal.x, vNormal.y, vNormal.z, 1.0);
	//gl_FragColor = vec4(vPosition.x, vPosition.y/10.0, vPosition.z, 1.0);
}
