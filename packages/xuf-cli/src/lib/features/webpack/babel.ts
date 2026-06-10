import {Configuration, RuleSetRule} from 'webpack'
import WebpackChain from './webpack-chain'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

export default class WpBabel {
  setup(webpackChain: WebpackChain) {
    const ctx = webpackChain.context
    const isDev = ctx.isDev
    const reactVersion = ctx.appPackageObj?.dependencies?.react

    const babelRule = this.getBabelRule(isDev, reactVersion)

    const config: Configuration = {
      module: {
        rules: [
          {
            test: /\.mjs$/,
            exclude: /(node_modules|bower_components)/,
            resolve: {
              fullySpecified: false,
            },
            use: [babelRule],
          },
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: [babelRule],
          },
        ],
      },
    }
    if (isDev) {
      config.plugins = [new ReactRefreshWebpackPlugin()]
    }

    webpackChain.merge(config)
  }

  private getBabelRule(isDev: boolean, reactVersion?: string): RuleSetRule {
    const presets: any[] = [
      [
        require.resolve('@babel/preset-env'),
        {
          useBuiltIns: 'entry',
          corejs: 3,
          exclude: ['transform-typeof-symbol'],
          loose: true,
        },
      ],
      require.resolve('@babel/preset-typescript'),
    ]

    const plugins: any[] = [
      [require(require.resolve('@babel/plugin-syntax-top-level-await')).default],
      [
        require.resolve('@babel/plugin-transform-runtime'),
        {
          corejs: false,
          helpers: true,
          version: require(require.resolve('@babel/runtime/package.json')).version,
          regenerator: true,
          useESModules: false,
          absoluteRuntime: false,
        },
      ],
      [require.resolve('@babel/plugin-proposal-decorators'), {legacy: true}],
      [require.resolve('@babel/plugin-proposal-class-properties'), {loose: true}],
    ]

    const babelRule: RuleSetRule = {
      loader: require.resolve('babel-loader'),
      options: {
        presets,
        plugins,
      },
    }

    if (reactVersion) {
      presets.push([
        require.resolve('@babel/preset-react'),
        {
          runtime: 'automatic',
        },
      ])
      isDev && plugins.unshift(require.resolve('react-refresh/babel'))
    }

    return babelRule
  }
}
