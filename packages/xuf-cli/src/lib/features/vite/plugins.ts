import type {Plugin} from 'vite'
import {XufConfig, XufContext} from '../../../types'
import {htmlEntryPlugin} from './html-entry-plugin'

export class VitePlugins {
  private context: XufContext
  private xufConfig: XufConfig

  constructor(context: XufContext, xufConfig: XufConfig) {
    this.context = context
    this.xufConfig = xufConfig
  }

  getPlugins(): Plugin[] {
    const plugins: Plugin[] = []

    if (this.xufConfig.buildType !== 'lib') {
      // 处理 public/index.html 作为入口
      plugins.push(htmlEntryPlugin(this.context))
    }

    return plugins
  }
}
