import path from 'path'

const xufPackageJson = require(`${path.resolve(__dirname, '../../')}/package.json`)

export const XUFNAME = 'xuf'

export const XUFVERSION = xufPackageJson.version
