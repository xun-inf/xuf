import {FillMode, PlayerParameters, LkaPlayProps, LayerProps} from './types'

export class PlayerState {
  duration = 0
  frameId = -1
  frames = 0
  frameRate = 30
  frameTimeMs = 0
  width = 0
  height = 0

  compLayers?: LayerProps[]
  sourceBlobMap?: Record<number, Blob>

  readonly loop: boolean = false
  readonly debug: boolean = false
  readonly fillMode: FillMode = FillMode.LongSide
  readonly autoPlay: boolean = false

  constructor(parameters: PlayerParameters) {
    this.loop = parameters.loop ?? this.loop
    this.debug = parameters.debug ?? this.debug
    if (parameters.autoPlay !== undefined) this.autoPlay = parameters.autoPlay
    if (parameters.fillMode !== undefined) this.fillMode = parameters.fillMode
  }

  setLkaProps(props: LkaPlayProps, sourceMap?: Record<number, Blob>) {
    this.duration = props.duration || 0
    this.frameId = -1
    this.frames = Math.round(this.duration * props.frameRate)
    this.frameRate = props.frameRate || 30
    this.frameTimeMs = 1000 / this.frameRate
    this.width = props.width
    this.height = props.height
    // lka props
    this.compLayers = props.comps
    this.sourceBlobMap = sourceMap
  }

  getCompLayerProps(id: number) {
    return this.compLayers?.find(comp => comp.id === id)
  }
}
