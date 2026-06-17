export default /* glsl */`
#if defined( USE_BRI_CON )

  gl_FragColor = bricon_cvt(gl_FragColor);

#endif
`;