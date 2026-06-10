import {PlayerParameters, LkaPlayProps} from './types'

class LkaPlayer {
  constructor(container: HTMLElement, parameters: PlayerParameters) {}

  async load(props: {file: ArrayBufferLike | string; mockJson?: LkaPlayProps}) {}

  play() {}

  replay() {}

  pause() {}

  resizeCanvasToDisplaySize() {}

  async grap(x: number, y: number) {}

  dispose() {}
}

export {LkaPlayer}
