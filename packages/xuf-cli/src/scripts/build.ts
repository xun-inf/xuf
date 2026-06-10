import {webpack} from 'webpack'
import {loadXufConfig} from '../lib/config'
import {createXufContext} from '../lib/context'
import {overrideWebpackProd} from '../lib/features/webpack'
import {overrideViteProd} from '../lib/features/vite'
import {Options} from '../types'
import {build as viteBuild} from 'vite'

export default function build(options: Options) {
  console.log('Starting build...')

  const xufContext = createXufContext(options, 'production')
  const xufConfig = loadXufConfig(xufContext)

  const builder = xufConfig.builder || 'webpack'
  xufConfig.buildType = options.type || xufConfig.buildType || 'app'

  console.log(`Builder: ${builder}`)
  console.log(`Build type: ${xufConfig.buildType}`)

  if (builder === 'vite') {
    runViteBuild(xufContext, xufConfig)
  } else {
    runWebpackBuild(xufContext, xufConfig)
  }
}

function runWebpackBuild(xufContext: ReturnType<typeof createXufContext>, xufConfig: ReturnType<typeof loadXufConfig>) {
  console.log('Generating webpack config...')
  const webpackConfig = overrideWebpackProd(xufContext, xufConfig)

  console.log('Compiling with webpack...')
  webpack(webpackConfig, (err, status) => {
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
    console.log('Build completed successfully.')
  })
}

async function runViteBuild(
  xufContext: ReturnType<typeof createXufContext>,
  xufConfig: ReturnType<typeof loadXufConfig>,
) {
  console.log('Generating vite config...')
  const viteConfig = overrideViteProd(xufContext, xufConfig)

  console.log('Compiling with vite...')
  await viteBuild(viteConfig)

  console.log('Build completed successfully.')
}
