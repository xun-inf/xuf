import toUpper from 'lodash/toUpper'
import mergeWith from 'lodash/mergeWith'

export function isFunction(value: any): value is (...args: any[]) => any {
  return typeof value === 'function'
}

export function isArray(value: any): value is Array<any> {
  return Array.isArray(value)
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}

export function deepMergeWidthArray(dest: any, ...src: any) {
  return mergeWith(dest, ...src, (x: any, y: any) => {
    if (isArray(x)) {
      return x.concat(y)
    }
  })
}

export function toUpperCase(value: string) {
  if (value.toUpperCase) {
    return value.toUpperCase()
  }
  return toUpper(value)
}
