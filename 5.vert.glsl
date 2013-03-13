varying vec3 vNormal;			
varying vec3 vPosition;
attribute float timeOffset;
attribute float bottom;
varying float bot;
varying float t;
uniform float time;
attribute vec3 vTarget;
uniform float twist;

void main() {
	vNormal = normal;
	t = timeOffset;
	float myTwist = sin(time*3.0 + timeOffset)*0.03-0.03 + twist;
	vec3 tp = position * (1.0-myTwist) + vTarget * myTwist;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(tp,1.0);
	float st = time * 4.0;
	gl_Position.y += pow(max(min(timeOffset-st,1.0),0.0), 0.5) * 1.0;
	gl_Position.z += (timeOffset - st > sin(st/4.0) * 2.0) ? 100.0 : 0.0; 
	bot = bottom;
	vPosition = position;//(modelViewMatrix * vec4(position, 1.0)).xyz;
}
