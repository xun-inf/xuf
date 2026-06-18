export default /* glsl */`
#if defined( USE_BLEND )

  gl_FragColor = blend_cvt(gl_FragColor);

#endif
`;