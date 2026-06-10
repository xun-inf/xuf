import {webpack} from 'webpack'
import {loadXufConfig} from '../lib/config'
import {createXufContext} from '../lib/context'
import {overrideWebpackDev} from '../lib/features/webpack'
import {overrideViteDev} from '../lib/features/vite'
import type {Options} from '../types'
import WebpackDevServer from 'webpack-dev-server'
import {createServer} from 'vite'

export default function dev(options: Options) {
  const xufContext = createXufContext(options, 'development')
  const xufConfig = loadXufConfig(xufContext)

  const builder = xufConfig.builder || 'webpack'

  if (builder === 'vite') {
    runViteDev(xufContext, xufConfig)
  } else {
    runWebpackDev(xufContext, xufConfig)
  }
}

function runWebpackDev(xufContext: ReturnType<typeof createXufContext>, xufConfig: ReturnType<typeof loadXufConfig>) {
  const webpackConfig = overrideWebpackDev(xufContext, xufConfig)

  const compiler = webpack(webpackConfig)

  compiler.run((err, status) => {
    if (err) {
      console.error(err.stack || err)
      return
    }
    if (status?.hasWarnings()) {
      console.log(
        status.toString({
          all: false,
          colors: true,
          warnings: true,
        }),
      )
    }
    if (status?.hasErrors()) {
      console.log(
        status.toString({
          all: false,
          colors: true,
          errors: true,
        }),
      )
      process.exit(1)
    }
    console.log(
      status?.toString({
        all: false,
        colors: true,
        assets: true,
      }),
    )
  })

  // v5 构造函数参数顺序: (devServerOptions, compiler)，与 v4 相反
  const server = new WebpackDevServer(webpackConfig.devServer || {}, compiler)
  server.start()
}

async function runViteDev(
  xufContext: ReturnType<typeof createXufContext>,
  xufConfig: ReturnType<typeof loadXufConfig>,
) {
  const viteConfig = overrideViteDev(xufContext, xufConfig)
  const server = await createServer(viteConfig)
  await server.listen()
  server.printUrls()
}
