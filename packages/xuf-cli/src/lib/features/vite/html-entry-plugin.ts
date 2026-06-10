import fs from 'fs'
import path from 'path'
import type {Plugin} from 'vite'
import {XufContext} from '../../../types'

/**
 * 处理 public/index.html 作为入口的插件
 * - 开发模式: 拦截 / 和 /index.html 请求，返回注入脚本后的 HTML
 * - 构建模式: 将 HTML 输出到 dist/index.html，并修正静态资源路径
 */
export function htmlEntryPlugin(context: XufContext): Plugin {
  const htmlPath = context.appHtml
  const entryPath = context.appIndexJs
  const entryRelative = '/' + path.relative(context.appPath, entryPath).replace(/\\/g, '/')

  const injectScript = (html: string) => {
    if (/<script[^>]+type=["']module["']/.test(html)) {
      return html
    }
    const scriptTag = `<script type="module" src="${entryRelative}"></script>`
    if (html.includes('</body>')) {
      return html.replace('</body>', `  ${scriptTag}\n  </body>`)
    }
    return html + scriptTag
  }

  return {
    name: 'xuf:html-entry',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/' || req.url === '/index.html') {
          try {
            let html = fs.readFileSync(htmlPath, 'utf-8')
            html = injectScript(html)
            html = await server.transformIndexHtml(req.url, html, req.originalUrl)
            res.setHeader('Content-Type', 'text/html')
            res.end(html)
            return
          } catch (err) {
            return next(err)
          }
        }
        next()
      })
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return injectScript(html)
      },
    },
    // 构建完成后：将 dist/public/index.html 移动到 dist/index.html
    // 并修正资源路径
    closeBundle() {
      const outDir = context.appBuild
      const publicSubDir = path.join(outDir, 'public')
      const publicHtml = path.join(publicSubDir, 'index.html')

      if (!fs.existsSync(publicHtml)) {
        return
      }

      // 读取构建产物 HTML，修正相对路径
      let html = fs.readFileSync(publicHtml, 'utf-8')
      html = html.replace(/(["'])\.\.\/assets\//g, '$1/assets/')

      // 写入 dist/index.html（覆盖 publicDir 复制的原始 HTML）
      const targetPath = path.join(outDir, 'index.html')
      fs.writeFileSync(targetPath, html)

      // 删除 dist/public/index.html
      fs.unlinkSync(publicHtml)

      // 如果 dist/public 空了，删除该目录
      try {
        const remaining = fs.readdirSync(publicSubDir)
        if (remaining.length === 0) {
          fs.rmdirSync(publicSubDir)
        }
      } catch {}
    },
  }
}
