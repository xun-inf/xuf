import type {Configuration as DevServerConfiguration} from 'webpack-dev-server'
import type {Configuration} from 'webpack'
import WebpackChain from './webpack-chain'

export default class WpDevelopment {
  setup(webpackChain: WebpackChain) {
    const ctx = webpackChain.context

    const devServer: DevServerConfiguration = {
      host: '0.0.0.0',
      allowedHosts: 'all',
      historyApiFallback: true,
      // compress: true,
      static: [
        // 输出静态文件
        {
          directory: ctx.appPublic,
          publicPath: '/',
        },
      ],
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      },
      compress: true,
      client: {
        overlay: {
          errors: true,
          warnings: true,
        },
      },
    }

    const config: Configuration = {
      mode: 'development',
      devtool: 'inline-source-map',
      devServer,
      optimization: {
        chunkIds: 'deterministic',
      },
    }

    webpackChain.merge(config)
  }
}
