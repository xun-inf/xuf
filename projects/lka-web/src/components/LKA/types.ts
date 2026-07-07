export interface TransformProps {
  anchorPoint?: {
    inFrame: number
    value: number[]
    timeFunc?: number
  }[]
  position?: {
    inFrame: number
    value: number[]
    timeFunc?: number
  }[]
  scale?: {
    inFrame: number
    value: number[]
    timeFunc?: number
  }[]
  opacity?: {
    inFrame: number
    value: number
    timeFunc?: number
  }[]
  rotationX?: {
    inFrame: number
    value: number
    timeFunc?: number
  }[]
  rotationY?: {
    inFrame: number
    value: number
    timeFunc?: number
  }[]
  rotationZ?: {
    inFrame: number
    value: number
    timeFunc?: number
  }[]
  orientation?: {
    inFrame: number
    value: number[]
    timeFunc?: number
  }[]
  animationConfig?: Record<
    string,
    {
      inFrame: number
      outFrame: number
    }
  >
}

export enum MaskMode {
  None = 0,
  ALPHA = 1,
  ALPHA_INVERTED = 2,
  LUMA = 3,
  LUMA_INVERTED = 4,
}

export enum BlendMode {
  None = 0,
  Add,
  Screen,
  Overlay,
  SoftLight,
  Lighten,
  Darken,
  Multiply,
  ColorBurn,
  ColorDodge,
  HardLight,
  Difference,
  Exclusion,
  Hue,
  Saturation,
  Color,
  Luminosity,
}

export interface EffectsProps {
  bri_con?: {
    contrast: number
    brightness: number
  }
  hue_sat?: {
    colorize: number
    hue: number
    saturation: number
    brightness: number
  }
}

export interface LayerBaseProps {
  id: number
  type: string
  name?: string
  transform: TransformProps
  width: number
  height: number
  inFrame: number
  outFrame: number
  isTrackMatte?: boolean
  trackMatteLayer?: number
  trackMatteType?: MaskMode
  blendMode?: BlendMode
  is3D?: boolean
  effects?: EffectsProps
  sourceId?: number
  parent?: number
  enabled?: 0 | 1 | 2
  clickAble?: boolean
  endMode?: number
  compDuration?: number
  compFrameRate?: number
}

export type ImageProps = {
  type: 'image'
  content: string
  fillMode?: FillMode
}

export type VideoProps = {
  type: 'video'
  content: string
  isAlpha?: boolean
  fillMode?: FillMode
  videoUrl?: string
}

export interface TextDocAttr {
  text: string
  textColor: number[]
  font: string
  fontFamily: string
  fontSize: number
  fontStyle: string
  fauxBold?: boolean
  fauxItalic?: boolean
  lineSpacing?: number
  wordSpacing?: number
  textAligment?: number
  orientation?: number
}

export type LayerTextProps = {
  type: 'text'
  textDocAttr: TextDocAttr
  content: string
}

interface ShapeFillInfo {
  blendMode?: number
  color: [number, number, number, number]
  opacity: number
}

interface ShapeStrokeInfo {
  blendMode?: number
  color: [number, number, number, number]
  opacity: number
  width: number
  lineCap: number
  lineJoin: number
  miterLimit: number
  dashesInfo?: {
    dash: number[]
    offset: [{inFrame: number; value: number; timeFunc?: number}]
  }
}

export type PathProps = {
  type: 'Path'
  name?: string
  blendMode?: number
  elements: {
    shapeInfo: {
      points: Array<[number, number]>
      actions: number[]
    }
    strokeInfo?: ShapeStrokeInfo
    fillInfo?: ShapeFillInfo
  }
}

export type RectProps = {
  type: 'Rect'
  name?: string
  blendMode?: number
  elements: {
    rectInfo: {
      direction?: number
      size: [number, number]
      position: [number, number]
      roundness?: number
    }
    strokeInfo?: ShapeStrokeInfo
    fillInfo?: ShapeFillInfo
  }
  transform: TransformProps
}

export type EllipseProps = {
  type: 'Ellipse'
  name?: string
  blendMode?: number
  elements: {
    ellipseInfo: {
      direction?: number
      size: [number, number]
      position: [number, number]
    }
    strokeInfo?: ShapeStrokeInfo
    fillInfo?: ShapeFillInfo
  }
}

export type ShapeProps = {
  type: 'ShapeLayer'
  content: Array<RectProps | EllipseProps | PathProps>
}

export type SolidProps = {
  type: 'Solid'
  color: number[]
}

export type VectorProps = {
  type: 'vector'
  layers: LayerProps[]
}

export type CameraProps = {
  type: 'camera'
  options?: {
    zoom?: {
      inFrame: number
      value: number
      timeFunc?: number
    }[]
  }
}

export type LayerProps = LayerBaseProps &
  (
    | ImageProps
    | VideoProps
    | LayerTextProps
    | ShapeProps
    | SolidProps
    | PathProps
    | RectProps
    | EllipseProps
    | SolidProps
    | VectorProps
    | CameraProps
    | {type: 'precomposition'}
  )

export interface LkaPlayProps {
  width: number
  height: number
  duration: number // s
  frameRate: number // ms
  targetComp: {
    layers: LayerProps[]
  }
  comps: LayerProps[]
  endMode?: number
}

export enum FillMode {
  LongSide = 0, // 默认长边对齐
  ShortSide, // 短边对齐
  Fill, // 填充
}

export interface PlayerParameters {
  loop?: boolean
  debug?: boolean
  fillMode?: FillMode
  autoPlay?: boolean
}
