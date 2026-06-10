# TSConfig

## Install
+ `yarn add @xuf/tsconfig -D`

## Config
+ `tsconfig.json`
```js
module.exports = {
  "extends": "@xuf/tsconfig",
  "compilerOptions": {
    "types": ["node", "react", "@xuf/tsconfig"],
    "rootDir": ".",
    "baseUrl": ".",
    "paths": {
      "src/*": ["src/*"]
    },
  }
}
```
