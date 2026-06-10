import WebpackChain from './webpack-chain'
import TerserPlugin from 'terser-webpack-plugin'

export default class WpProduction {
  setup(webpackChain: WebpackChain) {
    webpackChain.merge({
      mode: 'production',
      devtool: 'source-map',
      performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      },
      optimization: {
        minimizer: [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              format: {
                comments: false,
              },
            },
          }),
        ],
      },
    })
  }
}
