import {Configuration, container, DefinePlugin} from 'webpack'
import WebpackChain from './webpack-chain'
import Dotenv from 'dotenv-webpack'
import {resolveApp} from '../../paths'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import {XUFNAME} from '../../constants'
import WebpackBar from 'webpackbar'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'
import fs from 'fs'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import EslintWebpackPlugin from 'eslint-webpack-plugin'
import path from 'path'
import {toUpperCase} from '../../utils'

export default class WpPlugins {
  setup(webpackChain: WebpackChain) {
    const ctx = webpackChain.context
    const options = ctx.options
    const isDev = ctx.isDev
    const buildEnv = ctx.options.env
    const envVars = ctx.envVars
    const isLib = webpackChain.config.output?.library !== undefined

    const defineOptions: Record<string, string | boolean | number> = {...envVars}

    const plugins: Configuration['plugins'] = [
      // dotenv
      new Dotenv({
        path: resolveApp(`.env${buildEnv ? '.' + buildEnv : ''}`),
        safe: true, // load '.env.example' to verify the '.env' variables are all set. Can also be a string to a different file.
        allowEmptyValues: true, // allow empty variables (e.g. `FOO=`) (treat it as empty string, rather than missing)
        systemvars: true, // load all the predefined 'process.env' variables which will trump anything local per dotenv specs.
        silent: true, // hide any errors
        defaults: false, // load '.env.defaults' as the default values if empty.
      }),
      // define
      new DefinePlugin(defineOptions),
    ]

    if (!isLib) {
      plugins.push(
        // html
        new HtmlWebpackPlugin({
          title: toUpperCase(XUFNAME),
          template: ctx.appHtml,
          files: {
            css: [],
            js: [],
          },
          minify: !isDev
            ? {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              }
            : false,
        }),
        // ModuleFederation
        new container.ModuleFederationPlugin({}),
      )
    }

    // 打包进度条
    if (options.progress) {
      plugins.push(
        new WebpackBar({
          name: `[${toUpperCase(XUFNAME)}]`,
          color: 'green',
          profile: true,
        }),
      )
    }
    // analyze
    if (options.analyze) {
      plugins.push(
        new BundleAnalyzerPlugin({
          reportFilename: 'report.html',
          openAnalyzer: true,
        }),
      )
    }
    // ts/eslint
    const tsconfigPath = ctx.appTsConfig
    const isTs = fs.existsSync(tsconfigPath)
    if (isTs) {
      plugins.push(
        new ForkTsCheckerWebpackPlugin({
          async: isDev, // true dev环境下部分错误验证通过
          typescript: {
            configFile: tsconfigPath,
            profile: false,
            typescriptPath: require.resolve('typescript'),
          },
        }),
      )
    } else {
      plugins.push(
        new EslintWebpackPlugin({
          extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
          context: ctx.appPath,
          files: ['src/**/*.{ts,tsx,js,jsx}'],
          cache: true,
          cacheLocation: path.resolve(ctx.appCache, 'eslint'),
          fix: true,
          threads: true,
          lintDirtyModulesOnly: false,
        }),
      )
    }

    webpackChain.merge({plugins})
  }
}
