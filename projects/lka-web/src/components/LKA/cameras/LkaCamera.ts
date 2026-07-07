import {Property, Transform3D} from '../core/Transform3D'
import {CameraProps, LayerProps} from '../types'
import {Camera} from './Camera'

export class LkaCamera extends Camera {
  readonly props: CameraProps
  readonly transform: Transform3D
  readonly zoomProp: Property<number> | null = null

  constructor(props: CameraProps & LayerProps) {
    super()

    this.props = props
    this.transform = new Transform3D(props.transform)
    if (props.options?.zoom) {
      this.zoomProp = new Property(props.options.zoom)
    }
  }
}
