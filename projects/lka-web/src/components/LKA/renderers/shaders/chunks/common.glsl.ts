/** 片元着色器公共 uniform 声明 */
export default /* glsl */ `
precision mediump float;
varying vec2 v_texcoord;

// 纹理采样
uniform sampler2D texture;
uniform sampler2D dstTexture;
uniform bool texAlpha;

// 全局透明度
uniform float opacity;

// 抓取模式
uniform bool withGrap;
`
