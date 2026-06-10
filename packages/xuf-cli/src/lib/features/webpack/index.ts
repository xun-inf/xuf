import {XufConfig, XufContext} from '../../../types'
import WpAssetModules from './asset-modules'
import WpBabel from '../transpiler/babel'
import {WpCommon} from './common'
import WpDevelopment from './development'
import {mergeWebpackConfig} from './merge-config'
import WpPlugins from './plugins'
import WpProduction from './production'
import WpStyle from './style'
import WebpackChain from './webpack-chain'
import SwcTranspiler from '../transpiler/swc'

function overrideWebpack(context: XufContext, xufConfig: XufConfig) {
  const webpackChain = new WebpackChain(context)

  new WpCommon(xufConfig).setup(webpackChain)
  new WpStyle().setup(webpackChain)
  new WpAssetModules().setup(webpackChain)

  if (xufConfig.transpiler === 'swc') {
    new SwcTranspiler().setup(webpackChain)
  } else {
    new WpBabel().setup(webpackChain)
  }

  new WpPlugins().setup(webpackChain)

  return webpackChain
}

export function overrideWebpackDev(context: XufContext, xufConfig: XufConfig) {
  const webpackChain = overrideWebpack(context, xufConfig)

  new WpDevelopment().setup(webpackChain)

  if (xufConfig.devServer) {
    webpackChain.merge({
      devServer: xufConfig.devServer,
    })
  }

  const webpackConfig = webpackChain.config

  return mergeWebpackConfig(xufConfig, webpackConfig, context)
}

export function overrideWebpackProd(context: XufContext, xufConfig: XufConfig) {
  const webpackChain = overrideWebpack(context, xufConfig)

  new WpProduction().setup(webpackChain)

  const webpackConfig = webpackChain.config

  return mergeWebpackConfig(xufConfig, webpackConfig, context)
}
