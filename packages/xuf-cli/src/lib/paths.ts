import fs from 'fs'
import {log} from './logger'
import path from 'path'

export const appDirectory = fs.realpathSync(process.cwd())
log('Project root path resolved to: ', appDirectory)

export const resolveApp = (relativePath: string) => path.resolve(appDirectory, relativePath)

export function isAppFileExist(relativePath: string) {
  return fs.existsSync(resolveApp(relativePath))
}

export const resolveCli = (relativePath: string) => path.resolve(__dirname, '..', relativePath)

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
]

export const resolveModule = (resolveFn: (path: string) => string, filePath: string) => {
  const extension = moduleFileExtensions.find(extension => fs.existsSync(resolveFn(`${filePath}.${extension}`)))

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}
