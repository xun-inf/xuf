import fs from 'fs'
import path from 'path'
import type {UserConfig as ViteConfig} from 'vite'
import {XufConfig, XufContext} from '../../../types'

export class ViteCommon {
  private context: XufContext
  private xufConfig: XufConfig

  constructor(context: XufContext, xufConfig: XufConfig) {
    this.context = context
    this.xufConfig = xufConfig
  }

  getResolveConfig(): ViteConfig['resolve'] {
    const srcPath = this.context.appSrc
    const userAlias = this.xufConfig.vite?.alias || {}

    return {
      alias: {
        src: srcPath,
        ...userAlias,
      },
      extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.vue', '.svg'],
    }
  }

  getCssConfig(): ViteConfig['css'] {
    const srcPath = this.context.appSrc
    const appPath = this.context.appPath

    // 解析 webpack 风格的 ~ 前缀路径
    const resolveTilde = (url: string): string | null => {
      if (!url.startsWith('~')) return null
      const stripped = url.slice(1)
      const exts = ['', '.scss', '.sass', '.css']
      const candidates: string[] = []
      for (const base of [srcPath, path.resolve(appPath, 'node_modules')]) {
        for (const ext of exts) {
          candidates.push(path.resolve(base, stripped + ext))
          // 支持 sass 的 _partial 文件
          const dir = path.dirname(stripped)
          const name = path.basename(stripped)
          candidates.push(path.resolve(base, dir, '_' + name + ext))
        }
      }
      for (const candidate of candidates) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return candidate
        }
      }
      return null
    }

    // Legacy API importer (兼容性更好)
    const legacyImporter = (url: string) => {
      const resolved = resolveTilde(url)
      if (resolved) {
        return {file: resolved}
      }
      return null
    }

    return {
      preprocessorOptions: {
        scss: {
          importer: [legacyImporter],
        },
        sass: {
          importer: [legacyImporter],
        },
      },
    }
  }
}
