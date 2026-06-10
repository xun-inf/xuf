import {logTitle} from './lib/logger'
import type {Options} from './types'

const xuf = async (cmd: string, options: Options) => {
  logTitle(`begin with command: ${cmd}`)

  // 执行脚本
  switch (cmd) {
    case 'dev':
      {
        const {default: dev} = await import('./scripts/dev')
        dev(options)
      }
      break
    case 'build':
      {
        const {default: build} = await import('./scripts/build')
        build(options)
      }
      break
    case 'serve':
      {
        const {default: serve} = await import('./scripts/serve')
        serve(options)
      }
      break
    default:
      break
  }
}

export default xuf
