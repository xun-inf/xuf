import type {XufContext, Options} from '../types'
import {getConfigPath} from './config'
import {resolveApp, resolveModule} from './paths'

export function createXufContext(options: Options, mode: 'development' | 'production' | '' = '') {
  // 开发模式
  const isDev = mode === 'development' ? true : false
  // 环境参数
  const envVars = {
    __PROD__: options.env === 'prod' ? true : false,
    __TEST__: options.env === 'test' ? true : false,
    __DEV__: options.env === 'dev' ? true : false,
  }
  // Paths
  const appPath = resolveApp('.')
  const appSrc = resolveApp('src')
  const appBuild = resolveApp('dist')
  const appPublic = resolveApp('public')
  const appHtml = resolveApp('public/index.html')
  const appIndexJs = resolveModule(resolveApp, 'src/index')
  const appPackageJson = resolveApp('package.json')
  const appTsConfig = resolveApp('tsconfig.json')
  const appConfig = getConfigPath(options.config)
  const appCache = resolveApp('node_modules/.xuf-cache')
  // Objects
  const appPackageObj: Record<string, any> = require(appPackageJson)

  const context: XufContext = {
    options: options,
    isDev,
    envVars,
    appPath,
    appSrc,
    appBuild,
    appPublic,
    appHtml,
    appIndexJs,
    appPackageJson,
    appTsConfig,
    appConfig,
    appCache,
    appPackageObj,
  }

  return context
}
