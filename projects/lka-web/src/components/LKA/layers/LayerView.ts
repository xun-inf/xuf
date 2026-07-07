import {Camera} from '../cameras/Camera'
import {LkaCamera} from '../cameras/LkaCamera'
import {Vector2} from '../math/Vector2'
import {PlayerState} from '../PlayerState'
import {WebGLRenderer} from '../renderers/WebGLRenderer'
import {LayerProps} from '../types'
import {createLayer, Layer} from './Layer'

export class LayerView {
  viewSize: Vector2
  // 额外扩展3D相机
  addonCamera: LkaCamera | null = null

  readonly renderer: WebGLRenderer
  readonly state: PlayerState

  protected camera: Camera
  protected childLayers: Layer[] | null = null

  constructor(renderer: WebGLRenderer, state: PlayerState) {
    this.renderer = renderer
    this.state = state

    this.camera = new Camera()
    this.viewSize = new Vector2()
  }

  setViewSize(width: number, height: number) {
    this.viewSize.set(width, height)
  }

  async initLayers(childProps: LayerProps[], viewInFrame: number, viewOutFrame: number) {
    this.childLayers?.forEach(layer => layer.dispose())
    this.childLayers = null

    let endIdx = 0
    // 是否有3D相机
    if (childProps[0].type === 'camera') {
      const viewSize = this.viewSize
      this.addonCamera = new LkaCamera({...childProps[0], width: viewSize.width, height: viewSize.height})
      endIdx = 1
    }

    const childLayers = (this.childLayers = [])
    const newLayers: Layer[] = []
    for (let i = childProps.length - 1; i >= endIdx; i--) {
      const props = childProps[i]
      // 创建图层
      const outFrame = Math.min(viewOutFrame, props.outFrame ?? viewOutFrame)
      const layer = createLayer({...props, outFrame}, this)
      if (!layer) continue

      newLayers.push(layer)
    }

    await Promise.all(
      newLayers.map(
        layer =>
          new Promise(resolve => {
            layer.init().then(resolve)
          }),
      ),
    )

    // WARNING:异步重入安全对象清理
    if (childLayers !== this.childLayers) {
      newLayers.forEach(el => el.dispose())
    }

  }
}
