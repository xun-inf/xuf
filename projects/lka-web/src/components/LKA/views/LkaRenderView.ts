import {LkaCamera} from '../cameras/LkaCamera'
import {Layer} from '../layers/Layer'
import { LayerView } from '../layers/LayerView'
import {PlayerState} from '../PlayerState'
import {WebGLRenderer} from '../renderers/WebGLRenderer'
import {LkaPlayProps} from '../types'
import {parseLka} from './parseLka'

export class LkaRenderView extends LayerView {
  constructor(renderer: WebGLRenderer, state: PlayerState) {
    super(renderer, state)
  }

  async load({file}: {file: ArrayBufferLike | string}) {
    let info: {playProps: LkaPlayProps | null; sourceMap: Record<number, Blob>} | null = null
    try {
      info = await this.loadLKA(file)
    } catch (err: any) {
      console.error(err.message)
      return null
    }
    if (!info.playProps) {
      return null
    }
    const playState = this.state
    const playProps = info.playProps
    
    playState.setLkaProps(playProps)

    const rootLayers = playProps.targetComp?.layers
    if (!rootLayers) {
      console.error('props.targetComp.layers is null!')
      return null
    }

    await this.initLayers(rootLayers, 0, playState.frames)

    return {
      info: {
        width: playProps.width,
        height: playProps.height,
        frames: playState.frames,
        duration: playState.duration,
      }
    }
  }

  dispose() {}

  private async loadLKA(file: string | ArrayBufferLike) {
    let buffer: ArrayBufferLike | null = null

    if (typeof file === 'string') {
      const response = await fetch(file)
      if (!response.ok) {
        throw new Error(`load LKA file failed: ${response.status} ${response.statusText}`)
      }

      buffer = await response.arrayBuffer()
    } else {
      buffer = file
    }
    if (!buffer) {
      throw new Error('buffer is empty!')
    }

    const info = parseLka(buffer)
    if (!info) {
      throw new Error('parseLka failed!')
    }

    let props: LkaPlayProps | null = null
    try {
      props = JSON.parse(info.jsonStr)
    } catch (err) {
      throw new Error('JSON.parse failed!')
    }

    return {playProps: props, sourceMap: info.sourceMap}
  }
}
