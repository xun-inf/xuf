import {cosmiconfigSync} from 'cosmiconfig'
import {TypeScriptLoader} from 'cosmiconfig-typescript-loader'
import {XufContext} from '../types'
import {deepMergeWidthArray, isFunction, isString, toUpperCase} from './utils'
import {appDirectory, resolveApp} from './paths'
import {log} from './logger'
import type {XufConfig} from '../types/config'
import {XUFNAME} from './constants'

const DEFAULT_CONFIG: XufConfig = {
  builder: 'webpack',
  transpiler: 'babel',
  buildType: 'app',
  devServer: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
    hot: true,
  },
}

const explorer = cosmiconfigSync(XUFNAME, {
  searchPlaces: [`${XUFNAME}.config.ts`, `${XUFNAME}.config.js`, `${XUFNAME}.config.cjs`],
  loaders: {
    '.ts': TypeScriptLoader(),
  },
})

export function getConfigPath(config?: string) {
  if (config && isString(config)) {
    return resolveApp(config)
  } else {
    const result = explorer.search(appDirectory)
    if (result === null) {
      log(
        `${toUpperCase(XUFNAME)}: Config file not found. check if file exists at root (${XUFNAME}.config.ts, ${XUFNAME}.config.js)`,
      )
      return ''
    }

    return result.filepath
  }
}

function getConfigAsObject(context: XufContext): XufConfig {
  const configFilePath = context.appConfig
  const result = explorer.load(configFilePath)

  const config = isFunction(result?.config) ? result.config(context) : result?.config

  if (!config) {
    return {}
  }

  return config
}

export function loadXufConfig(context: XufContext): XufConfig {
  // 从上下文中获取配置对象
  const configAsObject = getConfigAsObject(context)

  // 将默认配置与用户配置合并，数组类型字段会被深度合并
  const xufConfig = deepMergeWidthArray({}, DEFAULT_CONFIG, configAsObject)

  return xufConfig
}
