import {Object3D} from '../core/Object3D'
import {Drawer} from './Drawer'

class Layer<D extends Drawer = Drawer> extends Object3D {
  constructor() {
    super()
  }

  protected drawer_: D | null = null

  get drawer() {
    return this.drawer_
  }

  setDrawer(d: D) {
    this.drawer_?.despose()

    this.drawer_ = d
  }

  despose() {}
}

export {Layer}
