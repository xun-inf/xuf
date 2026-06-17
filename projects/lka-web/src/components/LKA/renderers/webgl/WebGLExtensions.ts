class WebGLExtensions {
  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl
    this.extensions = {}
  }

  protected gl: WebGL2RenderingContext
  private extensions: Record<string, any>

  has(name: string) {
    return this.getExtension(name) !== null
  }

  get(name: string) {
    const extension = this.getExtension(name)

    if (extension === null) {
      console.warn('[LKA]WebGLRenderer: ' + name + ' extension not supported.')
    }

    return extension
  }

  private getExtension(name: string) {
    if (this.extensions[name] !== undefined) {
      return this.extensions[name]
    }

    let extension

    const gl = this.gl
    switch (name) {
      default:
        extension = gl.getExtension(name)
    }

    this.extensions[name] = extension

    return extension
  }
}

export {WebGLExtensions}
