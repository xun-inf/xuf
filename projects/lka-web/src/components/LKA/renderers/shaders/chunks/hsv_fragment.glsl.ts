export default /* glsl */`
#if defined( USE_HUE_SAT )

  gl_FragColor = hsv_cvt(gl_FragColor);

#endif
`;