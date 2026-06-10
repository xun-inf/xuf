import type {UserConfig as ViteConfig} from 'vite'
import {XufConfig} from '../../../types'

export class ViteDevelopment {
  private xufConfig: XufConfig

  constructor(_context: any, xufConfig: XufConfig) {
    this.xufConfig = xufConfig
  }

  getConfig(): ViteConfig {
    const devServerConfig = this.xufConfig.devServer || {}

    return {
      mode: 'development',
      server: {
        host: devServerConfig.host || '0.0.0.0',
        port: Number(devServerConfig.port) || 3000,
        open: devServerConfig.open !== undefined ? Boolean(devServerConfig.open) : true,
        hmr: devServerConfig.hot !== false,
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
      esbuild: {
        jsx: 'automatic',
      },
    }
  }
}
