import {PlayerState} from '../PlayerState'
import {WebGLRenderer} from '../renderers/WebGLRenderer'

export interface DrawerLike {
  init(): Promise<void>

  draw(): void

  dispose(): void
}

export abstract class Drawer implements DrawerLike {
  constructor() {}

  abstract init(): Promise<void>

  abstract draw(): void

  dispose() {}
}

export type DrawerConstructor<D extends DrawerLike = DrawerLike> = new (
  renderer: WebGLRenderer,
  state: PlayerState
) => D
