/** 亮度和对比度处理函数 */
export default /* glsl */ `
#ifdef USE_BRI_CON
uniform vec2 bricon;

// 亮度和对比度
vec4 bricon_cvt(vec4 src) {
  vec3 rgb = src.rgb * bricon.y + 0.5 - bricon.y * 0.5;
  if (bricon.x == 0.0) {
    return src;
  }

  vec3 hsv = RGB2HSV(rgb);
  hsv.z *= (bricon.x + 1.0);
  rgb = HSV2RGB(hsv);
  rgb += (bricon.x / 2.0);

  return vec4(rgb * src.a, src.a);
}
#endif
`
