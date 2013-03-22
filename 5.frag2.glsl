varying vec3 vNormal;
varying vec3 vPosition;
uniform float time;
varying vec3 vColor;

void main() {
	float d = dot(cameraPosition.xyz, vNormal);
	float dy = abs(cameraPosition.y - vPosition.y);
	float off = sin(time + vPosition.y + vNormal.x + vPosition.x/2.0) * 0.1 + 0.5;
	off += fract(sin(dot(vPosition.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.2; 
	float bright = min(1.0 / dy * pow(d/2.0,2.0) * off, 1.0);
	bright = 0.0 + bright/3.0;
	vec3 vBright = vec3(1,1,1) * bright;
	float d2 = pow(d/7.0,5.0)/2.0;
	gl_FragColor = vec4(vBright * (1.0-d2) + vColor * d2 ,1.0);
}
