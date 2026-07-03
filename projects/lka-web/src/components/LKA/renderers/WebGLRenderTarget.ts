import {RenderTarget, type RenderTargetOptions} from '../core/RenderTarget'

/**
 * WebGLRenderTarget — WebGLRenderer 使用的离屏渲染目标。
 *
 * 当前项目以 2D 合成为主，因此继承的 RenderTarget 只包含 color attachment，
 * 不包含 depth/stencil attachment。
 */
export class WebGLRenderTarget extends RenderTarget {
  readonly isWebGLRenderTarget = true

  constructor(width = 1, height = 1, options: RenderTargetOptions = {}) {
    super(width, height, options)
  }
}
