precision mediump float;
uniform sampler2D uTextures[%TEXTURE_NUM%];

varying vec2 vRegion;
varying float vTextureId;
varying vec4 vColor;

void main(void) {
    vec4 color;
    %GET_COLOR%

    gl_FragColor = texture2D(uTextures[0], vRegion) * vColor; // texture2D(uTextures[0], vec2(0.5,0.5)); // * vColor
}