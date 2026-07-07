import {Object3D} from '../core/Object3D'
import {LayerProps} from '../types'
import {DrawerConstructor, DrawerLike} from './Drawer'
import { ImageDrawer } from './ImageDrawer'
import {LayerView} from './LayerView'
import { TextDrawer } from './TextDrawer'
import { VectorDrawer } from './VectorDrawer'

export class Layer<D extends DrawerLike = DrawerLike> extends Object3D {
  constructor(props: LayerProps, layerView: LayerView, DrawerClass: DrawerConstructor<D>) {
    super()

    this.props = props
    this.layerView = layerView
    this._drawer = new DrawerClass(layerView.renderer, layerView.state)
  }

  readonly props: LayerProps
  readonly layerView: LayerView
  private _drawer: D

  async init() {
    await this._drawer.init()
  }

  render() {}

  dispose() {
    this._drawer.dispose()
  }
}

export const createLayer = (props: LayerProps, layerView: LayerView) => {
  // 预合成处理
  if (props.type === 'precomposition') {
    const compProps = layerView.state.getCompLayerProps(props.id)
    if (compProps) {
      const {id, sourceId, type, ...other} = props
      props = {...compProps, ...other, id, sourceId}
    }
  }
  switch (props.type) {
    case 'text':
      return new Layer(props, layerView, TextDrawer)
    case 'image':
      return new Layer(props, layerView, ImageDrawer)
    case 'video':
      return new Layer(props, layerView, ImageDrawer)
    case 'Solid':
      return new Layer(props, layerView, ImageDrawer)
    case 'vector':
      return new Layer(props, layerView, VectorDrawer)
    case 'ShapeLayer':
      return new Layer(props, layerView, ImageDrawer)
    // case 'Rect':
    //   break
    // case 'Ellipse':
    //   break
    // case 'Path':
    //   break
  }
}
