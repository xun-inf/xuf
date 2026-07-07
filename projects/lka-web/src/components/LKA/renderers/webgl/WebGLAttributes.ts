import type {WebGLInfo} from './WebGLInfo'

type WebGLAttributeArray = ArrayBufferView & {
  readonly BYTES_PER_ELEMENT: number
}

type TypedArrayConstructor = abstract new (...args: any[]) => ArrayBufferView

export interface WebGLAttributeInfo {
  array?: WebGLAttributeArray
  usage?: number
  buffer?: WebGLBuffer
  type?: number
  elementSize?: number
  isFloat16BufferAttribute?: boolean
  isGLBufferAttribute?: boolean
}

export interface WebGLAttributeBuffer {
  buffer: WebGLBuffer
  type: number
  bytesPerElement: number
  size?: number
}

export class WebGLAttributes {
  private readonly buffers = new WeakMap<WebGLAttributeInfo, WebGLAttributeBuffer>()
  private readonly attributes = new Set<WebGLAttributeInfo>()

  constructor(
    private readonly gl: WebGL2RenderingContext,
    private readonly info?: WebGLInfo,
  ) {}

  get(attribute: WebGLAttributeInfo): WebGLAttributeBuffer | undefined {
    return this.buffers.get(attribute)
  }

  remove(attribute: WebGLAttributeInfo): void {
    const data = this.buffers.get(attribute)

    if (data) {
      this.gl.deleteBuffer(data.buffer)
      this.buffers.delete(attribute)
      this.attributes.delete(attribute)
    }
  }

  update(attribute: WebGLAttributeInfo, bufferType: number): void {
    if (attribute.isGLBufferAttribute) {
      if (!attribute.buffer || attribute.type === undefined || attribute.elementSize === undefined) {
        return
      }

      this.buffers.set(attribute, {
        buffer: attribute.buffer,
        type: attribute.type,
        bytesPerElement: attribute.elementSize,
      })
      this.attributes.add(attribute)
      return
    }

    const data = this.buffers.get(attribute)

    if (data === undefined) {
      const buffer = this.createBuffer(attribute, bufferType)

      if (!buffer) {
        return
      }

      this.buffers.set(attribute, buffer)
      this.attributes.add(attribute)
      return
    }

    const array = this.getArray(attribute)

    if (!array) {
      return
    }

    if (data.size !== array.byteLength) {
      this.remove(attribute)
      this.update(attribute, bufferType)
      return
    }

    this.updateBuffer(data.buffer, attribute, bufferType)
  }

  dispose(): void {
    this.attributes.forEach(attribute => {
      const data = this.buffers.get(attribute)

      if (data) {
        this.gl.deleteBuffer(data.buffer)
        this.buffers.delete(attribute)
      }
    })

    this.attributes.clear()
    void this.info
  }

  private createBuffer(attribute: WebGLAttributeInfo, bufferType: number): WebGLAttributeBuffer | null {
    const gl = this.gl
    const array = this.getArray(attribute)

    if (!array) {
      return null
    }

    const type = this.getAttributeType(attribute, array)

    if (type === null) {
      return null
    }

    const usage = attribute.usage ?? gl.STATIC_DRAW
    const size = array.byteLength
    const buffer = gl.createBuffer()

    if (!buffer) {
      return null
    }

    gl.bindBuffer(bufferType, buffer)
    gl.bufferData(bufferType, array, usage)

    return {
      buffer,
      type,
      bytesPerElement: array.BYTES_PER_ELEMENT,
      size,
    }
  }

  private updateBuffer(buffer: WebGLBuffer, attribute: WebGLAttributeInfo, bufferType: number): void {
    const gl = this.gl
    const array = this.getArray(attribute)

    if (!array) {
      return
    }

    gl.bindBuffer(bufferType, buffer)
    gl.bufferSubData(bufferType, 0, array)
  }

  private getAttributeType(attribute: WebGLAttributeInfo, array: WebGLAttributeArray): number | null {
    const gl = this.gl
    const Float16ArrayCtor = (globalThis as unknown as {Float16Array?: TypedArrayConstructor}).Float16Array

    if (array instanceof Float32Array) {
      return gl.FLOAT
    }

    if (Float16ArrayCtor && array instanceof Float16ArrayCtor) {
      return gl.HALF_FLOAT
    }

    if (array instanceof Uint16Array) {
      return attribute.isFloat16BufferAttribute ? gl.HALF_FLOAT : gl.UNSIGNED_SHORT
    }

    if (array instanceof Int16Array) {
      return gl.SHORT
    }

    if (array instanceof Uint32Array) {
      return gl.UNSIGNED_INT
    }

    if (array instanceof Int32Array) {
      return gl.INT
    }

    if (array instanceof Int8Array) {
      return gl.BYTE
    }

    if (array instanceof Uint8Array || array instanceof Uint8ClampedArray) {
      return gl.UNSIGNED_BYTE
    }

    return null
  }

  private getArray(attribute: WebGLAttributeInfo): WebGLAttributeArray | null {
    return attribute.array ?? null
  }
}
