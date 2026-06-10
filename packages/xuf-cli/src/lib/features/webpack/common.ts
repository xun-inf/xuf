import type {Configuration} from 'webpack'

import {resolveApp, resolveModule} from '../../paths'

import WebpackChain from './webpack-chain'
import {XufConfig} from '../../../types'
import {getCdnDomain, parseCdnConfig} from '../../utils/cdn'

export class WpCommon {
  private xufConfig: XufConfig

  constructor(xufConfig: XufConfig) {
    this.xufConfig = xufConfig
  }

  setup(webpackChain: WebpackChain) {
    const ctx = webpackChain.context
    const options = ctx.options
    const isDev = ctx.isDev
    const isLib = this.xufConfig.buildType === 'lib'
    const libConfig = this.xufConfig.lib || {}

    // target
    const target: Configuration['target'] = ['web', 'es5']
    // cache
    const buildDependenciesConfigs = [__filename]
    const configPath = ctx.appConfig
    if (configPath) {
      buildDependenciesConfigs.push(configPath)
    }
    const name = `${isDev ? 'development' : ''}-${ctx.appPackageObj?.version}-${options?.env}-${this.xufConfig.buildType}`

    const cache: Configuration['cache'] = {
      name: name,
      type: 'filesystem',
      cacheDirectory: ctx.appCache,
      buildDependencies: {
        config: buildDependenciesConfigs,
      },
    }
    // entry
    const libEntry = libConfig.entry ? resolveApp(libConfig.entry) : resolveModule(resolveApp, 'src/index')
    const entry: Configuration['entry'] = isLib
      ? {
          index: libEntry,
        }
      : {
          index: ctx.appIndexJs,
        }

    // output - CDN 配置
    const assetsDir = 'assets'
    const {cdn} = this.xufConfig
    const {domains, strategy} = parseCdnConfig(cdn)
    const cdnDomain = getCdnDomain(domains, strategy)

    // 使用 assetModuleFilename 函数动态注入 CDN
    const assetModuleFilename = cdnDomain
      ? (pathData: any) => {
          const filename = `${assetsDir}/[name].[contenthash:8][ext][query]`
          return cdnDomain + '/' + filename
        }
      : `${assetsDir}/[name].[contenthash:8][ext][query]`

    const output: Configuration['output'] = isLib
      ? {
          clean: true,
          path: ctx.appBuild,
          publicPath: 'auto',
          filename: `${libConfig.fileName || (ctx.appPackageObj?.name || 'index').split('/').pop()}.js`,

          library: {
            name: libConfig.name || ctx.appPackageObj?.name,
            type: libConfig.format || 'umd',
          },

          globalObject: 'this',
          assetModuleFilename: `${assetsDir}/[name].[contenthash:8][ext][query]`,
        }
      : {
          clean: true,
          path: ctx.appBuild,
          publicPath: cdnDomain || 'auto',
          filename: cdnDomain
            ? `${assetsDir}/js/[name].[contenthash:8].js`
            : `${assetsDir}/js/[name].[contenthash:8].js`,
          assetModuleFilename,
          environment: {
            arrowFunction: false,
            bigIntLiteral: false,
            const: false,
            destructuring: false,
            forOf: false,
            dynamicImport: false,
            module: false,
          },
        }

    // resolve
    const srcPath = ctx.appSrc
    const resolve: Configuration['resolve'] = {
      modules: ['node_modules', resolveApp('node_modules'), srcPath],
      alias: {
        src: srcPath,
      },
      extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.css', '.scss', '.sass', '.json', '.wasm', '.vue', '.svg'],
    }
    // experiments
    const experiments: Configuration['experiments'] = {
      topLevelAwait: true,
      backCompat: true,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    }
    // stats
    const stats: Configuration['stats'] = {
      preset: 'errors-warnings',
    }
    const externals: Configuration['externals'] = isLib ? libConfig.external : undefined

    webpackChain.merge({
      target,
      cache,
      entry,
      output,
      externals,
      resolve,
      experiments,
      stats,
    })
  }
}
