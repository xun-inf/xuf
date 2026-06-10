import {mergeConfig} from 'vite'
import type {UserConfig as ViteConfig} from 'vite'
import {XufConfig, XufContext} from '../../../types'
import {resolveApp, resolveModule} from '../../paths'
import {isFunction} from '../../utils'
import {ViteCommon} from './common'
import {ViteDevelopment} from './development'
import {ViteProduction} from './production'
import {VitePlugins} from './plugins'

function overrideVite(context: XufContext, xufConfig: XufConfig): ViteConfig {
  const common = new ViteCommon(context, xufConfig)
  const plugins = new VitePlugins(context, xufConfig)
  const isLib = xufConfig.buildType === 'lib'
  const libConfig = xufConfig.lib || {}
  const libEntry = libConfig.entry ? resolveApp(libConfig.entry) : resolveModule(resolveApp, 'src/index')
  const packageName = context.appPackageObj?.name || 'index'
  const fileName = libConfig.fileName || packageName.split('/').pop() || 'index'

  const config: ViteConfig = {
    root: context.appPath,
    publicDir: isLib ? false : context.appPublic,
    build: {
      outDir: context.appBuild,
      rollupOptions: isLib
        ? {
            external: libConfig.external,
            output: {
              globals: libConfig.globals,
            },
          }
        : {
            input: context.appHtml, // public/index.html
          },
      ...(isLib
        ? {
            lib: {
              entry: libEntry,
              name: libConfig.name || packageName,
              fileName: format => `${fileName}.${format}.js`,
              formats: libConfig.formats || ['es', 'umd'],
            },
          }
        : {}),
    },
    resolve: common.getResolveConfig(),
    css: common.getCssConfig(),
    plugins: plugins.getPlugins(),
  }

  return config
}

export function overrideViteDev(context: XufContext, xufConfig: XufConfig): ViteConfig {
  const viteConfig = overrideVite(context, xufConfig)

  const development = new ViteDevelopment(context, xufConfig)
  const devConfig = development.getConfig()

  const mergedConfig = mergeConfig(viteConfig, devConfig)

  if (xufConfig.vite?.configure && isFunction(xufConfig.vite.configure)) {
    return xufConfig.vite.configure(mergedConfig, context)
  }

  return mergedConfig
}

export function overrideViteProd(context: XufContext, xufConfig: XufConfig): ViteConfig {
  const viteConfig = overrideVite(context, xufConfig)

  const production = new ViteProduction(context, xufConfig)
  const prodConfig = production.getConfig()

  const mergedConfig = mergeConfig(viteConfig, prodConfig)

  if (xufConfig.vite?.configure && isFunction(xufConfig.vite.configure)) {
    return xufConfig.vite.configure(mergedConfig, context)
  }

  return mergedConfig
}
