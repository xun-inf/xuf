import {Configuration, RuleSetRule} from 'webpack'
import WebpackChain from '../webpack/webpack-chain'

export default class SwcTranspiler {
  setup(webpackChain: WebpackChain) {
    const ctx = webpackChain.context
    const isDev = ctx.isDev

    const swcRule = this.getSwcRule(isDev)

    const config: Configuration = {
      module: {
        rules: [
          {
            test: /\.mjs$/,
            exclude: /(node_modules|bower_components)/,
            resolve: {
              fullySpecified: false,
            },
            use: [swcRule],
          },
          {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /(node_modules|bower_components)/,
            use: [swcRule],
          },
        ],
      },
    }

    webpackChain.merge(config)
  }

  private getSwcRule(isDev: boolean): RuleSetRule {
    const swcRule: RuleSetRule = {
      loader: 'swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
              development: isDev,
            },
          },
          target: 'es2015',
          externalHelpers: true,
        },
        env: {
          targets: '> 0.25%, not dead',
          mode: 'usage',
          coreJs: '3.31',
        },
      },
    }

    return swcRule
  }
}
