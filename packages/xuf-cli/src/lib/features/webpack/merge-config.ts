import type {Configuration as WebpackConfig} from 'webpack'
import merge from 'webpack-merge'
import type {Configure, XufConfig, XufContext, WebpackAlias} from '../../../types'
import {log} from '../../logger'
import {isFunction} from '../../utils'

function addAlias(webpackConfig: WebpackConfig, webpackAlias: WebpackAlias) {
  if (webpackConfig.resolve) {
    // TODO: ensure is a plain object, if not, log an error.
    webpackConfig.resolve.alias = Object.assign(webpackConfig.resolve.alias || {}, webpackAlias)
  }

  log('Added webpack alias.')
}

function giveTotalControl(
  webpackConfig: WebpackConfig,
  configureWebpack: Configure<WebpackConfig, XufContext>,
  context: XufContext,
) {
  if (isFunction(configureWebpack)) {
    webpackConfig = configureWebpack(webpackConfig, context)

    if (!webpackConfig) {
      throw new Error("xuf-cli: 'webpack.configure' function didn't returned a webpack config object.")
    }
  } else {
    webpackConfig = merge(webpackConfig, configureWebpack)
  }

  log("Merged webpack config with 'webpack.configure'.")

  return webpackConfig
}

export function mergeWebpackConfig(xufConfig: XufConfig, webpackConfig: WebpackConfig, context: XufContext) {
  let resultingWebpackConfig = webpackConfig

  if (xufConfig.webpack) {
    const {alias, configure} = xufConfig.webpack

    if (alias) {
      addAlias(resultingWebpackConfig, alias)
    }

    if (configure) {
      resultingWebpackConfig = giveTotalControl(resultingWebpackConfig, configure, context)
    }
  }

  return resultingWebpackConfig
}
