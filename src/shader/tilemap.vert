precision lowp float;

attribute vec2 aPosition;
attribute vec2 aRegion;
attribute float aTextureId;
attribute vec4 aColor;

uniform mat4 uProjectionModel;

varying vec2 vRegion;
varying float vTextureId;
varying vec4 vColor;

void main(void) {
    vRegion = aRegion;
    vTextureId = aTextureId;
    vColor = aColor;
    gl_Position = uProjectionModel * vec4(aPosition, 0.0, 1.0);
}