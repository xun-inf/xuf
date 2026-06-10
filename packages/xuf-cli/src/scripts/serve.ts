import {loadXufConfig} from '../lib/config'
import {createXufContext} from '../lib/context'
import {Options} from '../types'
import express from 'express'
import compression from 'compression'
import cors from 'cors'
import url from 'url'
import chalk from 'chalk'
import {ip} from 'address'
import defaultGateway from 'default-gateway'
import path from 'path'
import fs from 'fs-extra'
import https from 'https'

function formatUrl(protocol: string, host: string, port: number, pathname = '/') {
  const format = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port,
      pathname,
    })

  const pretty = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port: chalk.bold(port),
      pathname,
    })

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::'
  let prettyHost, lanUrlForConfig
  let lanUrlForTerminal = chalk.gray('unavailable')
  if (isUnspecifiedHost) {
    prettyHost = 'localhost'
    try {
      // This can only return an IPv4 address
      const gw4 = defaultGateway.v4.sync()
      lanUrlForConfig = ip(gw4 && gw4.interface)
      if (lanUrlForConfig) {
        // Check if the address is a private ip
        // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
        if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(lanUrlForConfig)) {
          // Address is private, format it for later use
          lanUrlForTerminal = pretty(lanUrlForConfig)
        } else {
          // Address is not private, so we will discard it
          lanUrlForConfig = undefined
        }
      }
    } catch (_e) {
      // ignored
    }
  } else {
    prettyHost = host
    lanUrlForConfig = host
    lanUrlForTerminal = pretty(lanUrlForConfig)
  }
  const localUrlForTerminal = pretty(prettyHost)
  const localUrlForBrowser = format(prettyHost)
  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser,
  }
}

function startLog({httpsOptions, host, port, publicPath}: any) {
  if (publicPath && (publicPath.indexOf('http://') > -1 || publicPath.indexOf('https://') > -1)) {
    console.log(`- Network: ${chalk.hex('#3498db')(publicPath)} \n`)
  } else {
    const protocol = httpsOptions ? 'https' : 'http'
    const realHost = host || '0.0.0.0'
    const urls = formatUrl(protocol, realHost, port)
    console.log(`- Local:   ${chalk.hex('#3498db')(urls.localUrlForTerminal)}`)
    console.log(`- Network: ${chalk.hex('#3498db')(urls.lanUrlForTerminal)} \n`)
  }
}

export default async function serve(options: Options) {
  const xufContext = createXufContext(options)
  const xufConfig = loadXufConfig(xufContext)

  const app = express()
  app.use(compression())
  app.use(cors())

  const staticRoot = xufContext.appBuild
  app.use(express.static(staticRoot))

  const html = await fs.readFile(path.join(staticRoot, 'index.html'), 'utf8')
  app.get('*', (req, res) => res.send(html))

  const devServer = xufConfig.devServer as any
  const {host, port} = devServer
  const httpsOptions = devServer.https
  const publicPath = xufContext.appPublic
  if (httpsOptions) {
    const httpsServer = https.createServer(httpsOptions, app)
    httpsServer.listen(port, () => {
      startLog({httpsOptions, host, port, publicPath})
    })
  } else {
    app.listen(port, () => {
      startLog({httpsOptions, host, port, publicPath})
    })
  }
}
