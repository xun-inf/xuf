import {EventDispatcher} from './EventDispatcher'
import {ClampToEdgeWrapping, LinearFilter, RGBAFormat, UByteType} from '../constants'
import {Texture} from '../textures/Texture'

export interface RenderTargetOptions {
  /** color attachment 数据格式 */
  format?: number
  type?: number
  magFilter?: number
  minFilter?: number
  wrapS?: number
  wrapT?: number
  generateMipmaps?: boolean
}

export interface RenderTargetEventMap {
  dispose: object
}

/**
 * RenderTarget — 离屏渲染目标（Framebuffer 抽象）
 *
 * 持有一个作为 color attachment 的 Texture（可被后续 pass 采样）。
 * 面向 2D 合成，只有 color buffer，不含 depth/stencil。
 * Framebuffer 句柄本身不放在 Texture 上，而是由 WebGLTextures
 * 挂在本对象的 properties 里，保持
 * Source(数据) / Texture(采样) / RenderTarget(渲染目标) 三层解耦。
 */
export class RenderTarget extends EventDispatcher<RenderTargetEventMap> {
  readonly isRenderTarget = true

  width: number
  height: number

  /** color attachment，可作为普通纹理被采样 */
  texture: Texture

  constructor(width = 1, height = 1, options: RenderTargetOptions = {}) {
    super()

    this.width = width
    this.height = height

    const texture = new Texture(
      null,
      undefined,
      options.wrapS ?? ClampToEdgeWrapping,
      options.wrapT ?? ClampToEdgeWrapping,
      options.magFilter ?? LinearFilter,
      options.minFilter ?? LinearFilter,
      options.format ?? RGBAFormat,
      options.type ?? UByteType,
    )

    // RenderTarget 纹理默认不生成 mipmap
    texture.generateMipmaps = options.generateMipmaps ?? false
    texture.flipY = false

    // 只分配 GPU 显存，不上传数据
    texture.source.dataReady = false
    texture.isRenderTargetTexture = true

    this.texture = texture
  }

  setSize(width: number, height: number): void {
    if (this.width === width && this.height === height) return

    this.width = width
    this.height = height

    // 尺寸变更需重新分配显存与 framebuffer
    this.dispose()
  }

  dispose(): void {
    this.dispatchEvent('dispose', {})
  }
}
