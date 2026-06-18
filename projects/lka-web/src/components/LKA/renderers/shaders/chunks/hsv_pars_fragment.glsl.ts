/** HSV / RGB 互转工具函数 */
export default /* glsl */ `
#ifdef USE_HUE_SAT
uniform int colorize;
uniform vec3 hsl;               // x=hue, y=saturation, z=lightness

#define EPSILON 1e-10
vec3 saturate(vec3 v) { return clamp(v, vec3(0.0), vec3(1.0)); }

vec3 HUE2RGB(float H) {
  float R = abs(H * 6.0 - 3.0) - 1.0;
  float G = 2.0 - abs(H * 6.0 - 2.0);
  float B = 2.0 - abs(H * 6.0 - 4.0);
  return saturate(vec3(R,G,B));
}

vec3 RGB2HCV(vec3 RGB) {
  vec4 P = (RGB.g < RGB.b) ? vec4(RGB.bg, -1.0, 2.0/3.0) : vec4(RGB.gb, 0.0, -1.0/3.0);
  vec4 Q = (RGB.r < P.x) ? vec4(P.xyw, RGB.r) : vec4(RGB.r, P.yzx);
  float C = Q.x - min(Q.w, Q.y);
  float H = abs((Q.w - Q.y) / (6.0 * C + EPSILON) + Q.z);
  return vec3(H, C, Q.x);
}

vec3 RGB2HSV(vec3 RGB) {
  vec3 HCV = RGB2HCV(RGB);
  float S = HCV.y / (HCV.z + EPSILON);
  return vec3(HCV.x, S, HCV.z);
}

vec3 HSV2RGB(vec3 HSV) {
  vec3 RGB = HUE2RGB(HSV.x);
  return ((RGB - 1.0) * HSV.y + 1.0) * HSV.z;
}

vec4 hsv_cvt(vec4 src) {
  if (colorize == 0) {
    return src;
  }

  vec3 rgbColor = src.rgb;
  vec3 hsvColor = RGB2HSV(rgbColor);
  if (colorize == 1) {
      hsvColor.x = fract(hsvColor.x + hsl.x);
      hsvColor.y *= (hsl.y + 1.0);
      rgbColor = HSV2RGB(hsvColor);
      rgbColor += hsl.z;
    } else {
      hsvColor.x = fract(hsl.x);
      hsvColor.y = hsl.y;
      rgbColor = HSV2RGB(hsvColor);
      rgbColor += hsl.z;
    }

  return vec4(rgbColor * src.a, src.a);
}
#endif
`
