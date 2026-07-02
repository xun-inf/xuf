import {ClampToEdgeWrapping, NearestFilter, RGBAFormat, UByteType, UVMapping} from '../constants'
import {Texture} from './Texture'

/**
 * DataTexture — 数据纹理
 */
export class DataTexture extends Texture {
  readonly isDataTexture = true

  constructor(
    data: ArrayBufferView | null = null,
    width = 1,
    height = 1,
    format: number = RGBAFormat,
    type: number = UByteType,
    mapping: number = UVMapping,
    wrapS: number = ClampToEdgeWrapping,
    wrapT: number = ClampToEdgeWrapping,
    magFilter: number = NearestFilter,
    minFilter: number = NearestFilter,
    anisotropy = 1,
    colorSpace?: string,
  ) {
    super(null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, colorSpace)

    // 结构化数据对象
    this.image = {data, width, height} as unknown as HTMLImageElement

    this.generateMipmaps = false
    this.flipY = false // 数据纹理无需 Y 翻转
    this.unpackAlignment = 1 // 数据紧密排列
  }
}
