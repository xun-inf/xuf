import type {Configuration as WebpackConfig} from 'webpack'
import {CustomizeRule, mergeWithRules} from 'webpack-merge'
import type {XufContext} from '../../../types'

export default class WebpackChain {
  constructor(context: XufContext) {
    this.context = context
  }

  readonly context: XufContext
  config: WebpackConfig = {}

  merge(cfg: WebpackConfig) {
    this.config = mergeWithRules({
      module: {
        rules: {
          test: CustomizeRule.Match,
          loaders: CustomizeRule.Append,
        },
      },
      plugins: CustomizeRule.Append,
    })(this.config, cfg)
  }
}
