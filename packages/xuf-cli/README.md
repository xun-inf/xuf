# @XUF/CLI ⚡

XUF CLI 是一个前端项目构建工具，内置 Webpack / Vite 构建能力，支持 React、TypeScript、Babel、SWC、开发服务、生产构建和 lib 打包。

## Installation

```bash
pnpm add -D @xuf/cli
```

也可以在 monorepo 中通过 workspace 方式使用：

```json
{
  "devDependencies": {
    "@xuf/cli": "workspace:^"
  }
}
```

## 常用命令

```bash
# 启动开发服务，默认 env=dev
xuf dev

# 指定环境启动开发服务
xuf dev --env test

# 生产构建，默认 env=prod，默认 app 打包
xuf build

# 指定环境构建
xuf build --env dev

# 生成构建分析报告
xuf build --analyze

# lib 打包
xuf build --type lib

# 正式环境本地调试
xuf serve
```

## 命令参数

### `xuf dev`

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-e, --env <env>` | `dev` | 部署环境，支持 `dev` / `test` / `prod` |
| `-p, --progress` | `true` | 是否显示构建进度 |
| `-c, --config <config>` | 空 | 指定配置文件路径 |

### `xuf build`

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-e, --env <env>` | `prod` | 部署环境，支持 `dev` / `test` / `prod` |
| `-p, --progress` | `false` | 是否显示构建进度 |
| `-c, --config <config>` | 空 | 指定配置文件路径 |
| `-a, --analyze` | `false` | 是否生成 bundle 分析报告 |
| `-t, --type <type>` | 空 | 打包方式，支持 `app` / `lib`，优先级高于配置文件的 `buildType` |

## 配置文件

默认会在项目根目录查找以下配置文件：

- `xuf.config.ts`
- `xuf.config.js`
- `xuf.config.cjs`

也可以通过 `--config` 指定配置文件：

```bash
xuf build --config ./configs/xuf.config.ts
```

## 基础配置示例

```ts
import path from 'path'
import type {xufConfig, xufContext} from '@xuf/cli/dist/types'

export default (context: xufContext): xufConfig => {
  return {
    builder: 'vite',
    transpiler: 'swc',
    devServer: {
      port: 3001,
    },
    webpack: {
      alias: {
        '@': path.resolve(context.appPath, 'src'),
      },
    },
    vite: {
      alias: {
        '@': path.resolve(context.appPath, 'src'),
      },
    },
  }
}
```

## 配置项

| 配置项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `builder` | `'webpack' \| 'vite'` | `webpack` | 构建器 |
| `transpiler` | `'babel' \| 'swc'` | `babel` | Webpack 构建时使用的转译器 |
| `buildType` | `'app' \| 'lib'` | `app` | 打包方式 |
| `cdn` | `string[] \| { domains: string[]; strategy?: 'first' \| 'random' \| 'roundrobin' }` | - | CDN 域名配置 |
| `lib` | `xufLibConfig` | - | lib 打包配置 |
| `webpack.alias` | `Record<string, string>` | - | Webpack alias 配置 |
| `webpack.configure` | `object \| function` | - | 合并或完全自定义 Webpack 配置 |
| `vite.alias` | `Record<string, string>` | - | Vite alias 配置 |
| `vite.configure` | `object \| function` | - | 合并或完全自定义 Vite 配置 |
| `devServer` | `webpack-dev-server` 配置 | - | 开发服务配置 |

## lib 打包

可以通过命令行开启 lib 打包：

```bash
xuf build --type lib
```

也可以在配置文件中固定使用 lib 打包：

```ts
import type {xufConfig} from '@xuf/cli/dist/types'

const config: xufConfig = {
  builder: 'vite',
  buildType: 'lib',
  lib: {
    entry: 'src/index.ts',
    name: 'MyLibrary',
    fileName: 'my-library',
    formats: ['es', 'umd'],
    external: ['react', 'react-dom'],
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
}

export default config
```

### `lib` 配置项

| 配置项 | 说明 |
| --- | --- |
| `entry` | lib 入口文件，默认 `src/index` |
| `name` | UMD / IIFE 全局变量名称 |
| `fileName` | 输出文件名前缀 |
| `formats` | Vite lib 输出格式，支持 `es` / `cjs` / `umd` / `iife` |
| `format` | Webpack library 输出类型，默认 `umd` |
| `external` | 不打进产物的外部依赖 |
| `globals` | Vite UMD / IIFE 格式下 external 依赖对应的全局变量 |

## CDN 配置

```ts
import type {xufConfig} from '@xuf/cli/dist/types'

const config: xufConfig = {
  cdn: {
    domains: ['https://cdn1.example.com', 'https://cdn2.example.com'],
    strategy: 'random',
  },
}

export default config
```

`strategy` 支持：

- `first`：始终使用第一个域名
- `random`：随机选择域名
- `roundrobin`：轮询选择域名
