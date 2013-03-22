varying vec3 vNormal;			
varying vec3 vPosition;
attribute float timeOffset;
attribute vec3 col;
varying vec3 vColor;
uniform float time;

void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
	gl_Position.z += (timeOffset > time) ? 100.0 : 0.0; 
	vColor = col;
	vNormal = normal;
	vPosition = position;
}
