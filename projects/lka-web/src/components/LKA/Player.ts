import {WebGLRenderer} from './renderers/WebGLRenderer'
import {PlayerParameters} from './types'
import {PlayerState} from './PlayerState'
import {LkaRenderView} from './views/LkaRenderView'

class LkaPlayer {
  private renderer: WebGLRenderer
  private state: PlayerState
  private renderView: LkaRenderView

  constructor(container: HTMLElement, parameters: PlayerParameters) {
    const canvas = document.createElement('canvas')
    canvas.style.cssText = `width:100%; height:100%;`
    container.appendChild(canvas)

    this.state = new PlayerState(parameters)
    this.renderer = new WebGLRenderer({canvas, alpha: true, premultipliedAlpha: true})
    this.renderView = new LkaRenderView(this.renderer, this.state)
  }

  async load(props: {file: ArrayBufferLike | string}) {
    await this.renderView.load(props)
  }

  play() {}

  replay() {}

  pause() {}

  seek(frameId: number) {}

  resizeCanvasToDisplaySize(width = 0, height = 0) {}

  async grap(x: number, y: number) {}

  dispose() {}
}

export {LkaPlayer}
