import path from 'path'
import type {MsfwConfig, MsfwContext} from '@msfw/cli/dist/types'

export default (context: MsfwContext): MsfwConfig => {
  return {
    builder: 'vite',
    transpiler: 'swc',
    devServer: {
      port: 3001,
    },
    webpack: {
      alias: {},
    },
    vite: {
      alias: {
        '@': path.resolve(context.appPath, 'src'),
      },
    },
  }
}
