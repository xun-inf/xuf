import {PlayerState} from '../PlayerState'
import {WebGLRenderer} from '../renderers/WebGLRenderer'
import {DrawerLike} from './Drawer'
import {LayerView} from './LayerView'

export class VectorDrawer extends LayerView implements DrawerLike {
  constructor(renderer: WebGLRenderer, state: PlayerState) {
    super(renderer, state)
  }

  async init() {}

  draw() {}

  dispose() {}
}
