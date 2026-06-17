import {ShaderBuilder} from './ShaderBuilder'
import common from './ShaderChunk/common.glsl'
import mask_pars_fragment from './ShaderChunk/mask_pars_fragment.glsl'
import mask_fragment from './ShaderChunk/mask_fragment.glsl'
import blend_pars_fragment from './ShaderChunk/blend_pars_fragment.glsl'
import blend_fragment from './ShaderChunk/blend_fragment.glsl'
import hsv_pars_fragment from './ShaderChunk/hsv_pars_fragment.glsl'
import hsv_fragment from './ShaderChunk/hsv_fragment.glsl'
import bricon_pars_fragment from './ShaderChunk/bricon_pars_fragment.glsl'
import bricon_fragment from './ShaderChunk/bricon_fragment.glsl'
import vertexShader from './ShaderChunk/ymat_vertex.glsl'
import fragmentShader from './ShaderChunk/ymat_fragment.glsl'
import { Matrix4 } from '../../math/Matrix4'

/**
 * 注册主着色器所需的所有 GLSL 代码片段
 */
export function registerChunks(builder: ShaderBuilder): void {
  const chunks = builder.chunks

  chunks.register('common', common)
  chunks.register('mask_pars_fragment', mask_pars_fragment)
  chunks.register('mask_fragment', mask_fragment)
  chunks.register('blend_pars_fragment', blend_pars_fragment)
  chunks.register('blend_fragment', blend_fragment)
  chunks.register('hsv_pars_fragment', hsv_pars_fragment)
  chunks.register('hsv_fragment', hsv_fragment)
  chunks.register('bricon_pars_fragment', bricon_pars_fragment)
  chunks.register('bricon_fragment', bricon_fragment)
}

// ===== 构建选项与 API =====

export function createShaderBuilder(): ShaderBuilder {
  const builder = new ShaderBuilder()

  registerChunks(builder)

  // 纹理采样
  builder.uniforms.register('common', {
    texture: {value: null},
    dstTexture: {value: null},
    texAlpha: {value: false},
    opacity: {value: 1.0},
    withGrap: {value: false},
  })

  // 遮罩与混合
  builder.uniforms.register('mask_blend', {
    maskMode: {value: 0},
    blendMode: {value: 0},
  })

  // 颜色调整
  builder.uniforms.register('color_adjust', {
    bricon: {value: {x: 0.0, y: 0.0}},
    colorize: {value: 0},
    hsl: {value: {x: 0.0, y: 0.0, z: 0.0}},
  })

  // 顶点
  builder.uniforms.register('vertex', {
    matrix: {value: new Matrix4()},
  })

  return builder
}

/** 全部功能 defines（所有混合模式 + 色相饱和度 + 亮度对比度） */
const ALL_DEFINES: Record<string, boolean> = {
  USE_BRI_CON: true,
  USE_HUE_SAT: true,
  USE_BLEND: true,
  USE_BLEND_UTILS: true,
  USE_BLEND_ADD: true,
  USE_BLEND_SCREEN: true,
  USE_BLEND_OVERLAY: true,
  USE_BLEND_SOFT_LIGHT: true,
  USE_BLEND_LIGHTEN: true,
  USE_BLEND_DARKEN: true,
  USE_BLEND_MULTIPLY: true,
  USE_BLEND_COLOR_BURN: true,
  USE_BLEND_COLOR_DODGE: true,
  USE_BLEND_HARD_LIGHT: true,
  USE_BLEND_DIFFERENCE: true,
  USE_BLEND_EXCLUSION: true,
  USE_BLEND_HUE: true,
  USE_BLEND_SATURATION: true,
  USE_BLEND_COLOR: true,
  USE_BLEND_LUMINOSITY: true,
}

export function buildShader(builder: ShaderBuilder) {
  return builder.build(vertexShader, fragmentShader, {
    defines: ALL_DEFINES,
    uniformGroups: ['vertex', 'common', 'mask_blend', 'color_adjust'],
  })
}
