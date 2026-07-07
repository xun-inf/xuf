import {Camera} from '../cameras/Camera'
import {Object3D} from '../core/Object3D'
import {RenderTarget} from '../core/RenderTarget'
import {Vector4} from '../math/Vector4'
import type {Texture} from '../textures/Texture'
import {createCanvasElement} from '../utils'
import type {BuiltShader} from './shaders/ShaderBuilder'
import {WebGLAttributes, type WebGLAttributeInfo} from './webgl/WebGLAttributes'
import {WebGLInfo} from './webgl/WebGLInfo'
import {WebGLPrograms} from './webgl/WebGLPrograms'
import {WebGLState} from './webgl/WebGLState'
import {WebGLTextures} from './webgl/WebGLTextures'

export interface WebGLRendererParameters {
  canvas?: HTMLCanvasElement | OffscreenCanvas

  /**
   * default is false.
   */
  alpha?: boolean

  /**
   * default is true.
   */
  premultipliedAlpha?: boolean
}

export interface WebGLDrawParameters {
  shader: BuiltShader
  attributes: Record<string, WebGLAttributeInfo>
  uniforms?: Record<string, unknown>
  mode?: number
  first?: number
  count: number
}

export class WebGLRenderer {
  constructor(parameters: WebGLRendererParameters = {}) {
    const {canvas = createCanvasElement(), alpha = false, premultipliedAlpha = true} = parameters

    this.canvas = canvas

    const canvasWidth = canvas.width
    const canvasHeight = canvas.height
    this._width = canvasWidth
    this._height = canvasHeight

    this._pixelRatio = 1
    this._viewport = new Vector4(0, 0, canvasWidth, canvasHeight)

    canvas.addEventListener('webglcontextlost', this.onContextLost, false)
    canvas.addEventListener('webglcontextrestored', this.onContextRestore, false)
    canvas.addEventListener('webglcontextcreationerror', this.onContextCreationError, false)

    this._gl = canvas.getContext('webgl2', {
      alpha,
      premultipliedAlpha,
    }) as WebGL2RenderingContext

    this.info = new WebGLInfo(this._gl)
    this._state = new WebGLState(this._gl)
    this._programs = new WebGLPrograms(this._gl, this.info)
    this._attributes = new WebGLAttributes(this._gl, this.info)
    this._textures = new WebGLTextures(this._gl, this.info)

    this.initGLContext()
  }

  readonly canvas: HTMLCanvasElement | OffscreenCanvas
  readonly info: WebGLInfo

  private _gl: WebGL2RenderingContext
  private _state: WebGLState
  private _programs: WebGLPrograms
  private _attributes: WebGLAttributes
  private _textures: WebGLTextures
  private _isContextLost = false
  private _width: number
  private _height: number
  private _pixelRatio: number
  private _viewport: Vector4
  /** 当前绑定的离屏渲染目标，null 表示默认帧缓冲（canvas） */
  private _currentRenderTarget: RenderTarget | null = null

  getContext() {
    return this._gl
  }

  setPixelRatio(value: number) {
    this._pixelRatio = value

    this.setSize(this._width, this._height)
  }

  setSize(width: number, height: number) {
    const canvas = this.canvas

    this._width = width
    this._height = height

    const pixelRatio = this._pixelRatio
    canvas.width = Math.floor(width * pixelRatio)
    canvas.height = Math.floor(height * pixelRatio)

    this.setViewport(0, 0, width, height)
  }

  setViewport(x: number, y: number, width: number, height: number) {
    this._viewport.set(x, y, width, height)

    if (this._currentRenderTarget === null) {
      this._state.viewport(x, y, width, height)
    }
  }

  /**
   * 设置渲染目标：传入 RenderTarget 则渲染到其 framebuffer，传 null 恢复到 canvas。
   */
  setRenderTarget(renderTarget: RenderTarget | null): void {
    const gl = this._gl
    this._currentRenderTarget = renderTarget

    if (renderTarget !== null) {
      this._textures.setupRenderTarget(renderTarget)
      this._state.bindFramebuffer(gl.FRAMEBUFFER, this._textures.getFramebuffer(renderTarget))
      this._state.viewport(0, 0, renderTarget.width, renderTarget.height)
    } else {
      this._state.bindFramebuffer(gl.FRAMEBUFFER, null)
      const v = this._viewport
      this._state.viewport(v.x, v.y, v.z, v.w)
    }
  }

  getRenderTarget(): RenderTarget | null {
    return this._currentRenderTarget
  }

  swapRenderTarget(renderTarget = this._currentRenderTarget): Texture | null {
    if (renderTarget === null) return null

    const texture = renderTarget.swap()
    this._textures.updateRenderTarget(renderTarget)

    if (renderTarget === this._currentRenderTarget) {
      this._state.reset()
      this.setRenderTarget(renderTarget)
    }

    return texture
  }

  getState(): WebGLState {
    return this._state
  }

  setTexture2D(texture: Texture, slot = 0): void {
    this._textures.setTexture2D(texture, slot)
  }

  clear(color = true, depth = false, stencil = false): void {
    this._state.clear(color, depth, stencil)
  }

  dispose() {
    const canvas = this.canvas

    this._attributes.dispose()
    this._programs.dispose()

    canvas.removeEventListener('webglcontextlost', this.onContextLost, false)
    canvas.removeEventListener('webglcontextrestored', this.onContextRestore, false)
    canvas.removeEventListener('webglcontextcreationerror', this.onContextCreationError, false)
  }

  renderObject(object: Object3D, camera: Camera) {
    if (this._isContextLost === true) return
  }

  private initGLContext() {
    this._state.reset()
    this._state.init()
    this.setRenderTarget(this._currentRenderTarget)
  }

  private onContextLost = (event: Event) => {
    console.log('Ly3D.WebGLRenderer: Context Lost.')

    event.preventDefault()

    this._isContextLost = true
  }

  private onContextRestore = () => {
    console.log('[LKA]WebGLRenderer: Context Restored.')

    this._isContextLost = false

    this.initGLContext()
  }

  private onContextCreationError = (event: Event) => {
    console.error('[LKA]WebGLRenderer: Context could not be created, Error: ', (event as any).statusMessage)
  }
}
