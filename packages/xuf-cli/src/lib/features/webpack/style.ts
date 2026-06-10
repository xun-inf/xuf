import {Configuration} from 'webpack'
import WebpackChain from './webpack-chain'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const sassRegex = /\.(scss|sass)$/
const sassModuleRegex = /\.module\.(scss|sass)$/

export default class WpStyle {
  setup(webpackChain: WebpackChain) {
    const ctx = webpackChain.context
    const isDev = ctx.isDev

    const localIdentName = isDev ? '[path][name]-[local]-[hash:base64:5]' : '[local]-[hash:base64:5]'

    const loaders = this.getLoaders(isDev, localIdentName)
    const moduleLoaders = this.getLoaders(isDev, localIdentName, true)

    const config: Configuration = {
      module: {
        rules: [
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: [...loaders],
          },
          {
            test: cssModuleRegex,
            use: [...moduleLoaders],
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: [
              ...loaders,
              {
                loader: require.resolve('sass-loader'),
                options: {
                  implementation: require('sass'),
                  sourceMap: isDev,
                },
              },
            ],
          },
          {
            test: sassModuleRegex,
            use: [
              ...moduleLoaders,
              {
                loader: require.resolve('sass-loader'),
                options: {
                  implementation: require('sass'),
                  sourceMap: isDev,
                },
              },
            ],
          },
        ],
      },
    }

    if (!isDev) {
      config.optimization = {
        minimizer: [
          new CssMinimizerPlugin({
            parallel: true,
            minimizerOptions: {
              preset: [
                'default',
                {
                  discardComments: {removeAll: true},
                },
              ],
            },
          }),
        ],
      }

      config.plugins = [
        new MiniCssExtractPlugin({
          ignoreOrder: true,
          filename: `assets/css/[name].[contenthash:8].css`,
          chunkFilename: `assets/css/[name].[contenthash:8].chunk.css`,
        }),
      ]
    }

    webpackChain.merge(config)
  }

  private getLoaders(isDev: boolean, localIdentName: string, modules = false) {
    return [
      {
        loader: isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
        options: {},
      },
      {
        loader: require.resolve('css-loader'),
        options: {
          modules: modules
            ? {
                localIdentName,
              }
            : modules,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            hideNothingWarning: true,
          },
        },
      },
    ]
  }
}
