import type {UserConfig as ViteConfig} from 'vite'
import {XufConfig, XufContext} from '../../../types'
import {getCdnDomain, parseCdnConfig} from '../../utils/cdn'

export class ViteProduction {
  private context: XufContext
  private xufConfig: XufConfig

  constructor(context: XufContext, xufConfig: XufConfig) {
    this.context = context
    this.xufConfig = xufConfig
  }

  getConfig(): ViteConfig {
    const {cdn, buildType} = this.xufConfig
    const {domains, strategy} = parseCdnConfig(cdn)
    const cdnDomain = getCdnDomain(domains, strategy)
    const isLib = buildType === 'lib'

    return {
      mode: 'production',
      base: isLib ? './' : cdnDomain ? cdnDomain + '/' : './',
      build: {
        target: 'es2015',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: isLib
          ? {}
          : {
              output: {
                manualChunks: {
                  vendor: ['react', 'react-dom'],
                },
              },
            },
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    }
  }
}
