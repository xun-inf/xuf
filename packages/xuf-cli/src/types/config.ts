import type {Configuration as DevServerConfig} from 'webpack-dev-server'
import type {Configuration as WebpackConfig} from 'webpack'
import type {UserConfig as ViteConfig} from 'vite'
import type {XufContext} from './context'

export type BuilderType = 'webpack' | 'vite'
export type TranspilerType = 'babel' | 'swc'
export type BuildType = 'app' | 'lib'
export type WebpackLibFormat =
  | 'var'
  | 'module'
  | 'assign'
  | 'assign-properties'
  | 'this'
  | 'window'
  | 'self'
  | 'global'
  | 'commonjs'
  | 'commonjs2'
  | 'commonjs-module'
  | 'commonjs-static'
  | 'amd'
  | 'amd-require'
  | 'umd'
  | 'umd2'
  | 'jsonp'
  | 'system'
export type ViteLibFormat = 'es' | 'cjs' | 'umd' | 'iife'

export type CdnStrategy = 'first' | 'random' | 'roundrobin'

export interface XufCdnConfig {
  domains: string[]
  strategy?: CdnStrategy
}

export type CdnConfig = string[] | XufCdnConfig

export type Configure<Config, Context> = Config | ((config: Config, context: Context) => Config)

export type WebpackAlias = {[alias: string]: string}
export type ViteAlias = {[alias: string]: string}

export interface XufLibConfig {
  entry?: string
  name?: string
  fileName?: string
  formats?: ViteLibFormat[]
  format?: WebpackLibFormat
  external?: string[]

  globals?: Record<string, string>
}

export interface XufWebpackConfig {
  alias?: WebpackAlias

  configure?: Configure<Omit<WebpackConfig, 'alias' | 'devServer'>, XufContext>
}

export interface XufViteConfig {
  alias?: ViteAlias
  configure?: Configure<Omit<ViteConfig, 'plugins'>, XufContext>
}

export type XufDevServerConfig = DevServerConfig

export interface XufConfig {
  builder?: BuilderType
  transpiler?: TranspilerType
  buildType?: BuildType
  lib?: XufLibConfig
  cdn?: CdnConfig
  webpack?: XufWebpackConfig
  vite?: XufViteConfig
  devServer?: XufDevServerConfig
}
