/** 遮罩模式函数（alpha / luma / inverted 变体 + cvtMask 分发） */
export default /* glsl */ `

  gl_FragColor = mask_cvt(gl_FragColor);

`
