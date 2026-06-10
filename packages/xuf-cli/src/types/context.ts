import type {BuildType} from './config'

export interface Options {
  env?: 'dev' | 'test' | 'prod'
  progress?: boolean
  config?: string
  analyze?: boolean
  type?: BuildType
}

export interface XufContext {
  // 命令行选项
  options: Options
  // 开发模式
  isDev: boolean
  // 环境变量
  envVars: {
    __PROD__: boolean
    __TEST__: boolean
    __DEV__: boolean
  }
  // Paths
  appPath: string
  appSrc: string
  appBuild: string
  appPublic: string
  appHtml: string
  appIndexJs: string
  appPackageJson: string
  appTsConfig: string
  appConfig: string
  appCache: string
  // Objects
  appPackageObj?: Record<string, any>
}
