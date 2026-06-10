import type {CdnConfig, CdnStrategy, XufCdnConfig} from '../../types/config'

let roundRobinIndex = 0

/**
 * 从域名列表中根据策略选择一个域名
 */
export function getCdnDomain(domains: string[], strategy?: CdnStrategy): string | undefined {
  if (!domains || domains.length === 0) {
    return undefined
  }

  if (domains.length === 1) {
    return domains[0]
  }

  switch (strategy) {
    case 'random':
      return domains[Math.floor(Math.random() * domains.length)]
    case 'roundrobin':
      const index = roundRobinIndex % domains.length
      roundRobinIndex++
      return domains[index]
    case 'first':
    default:
      return domains[0]
  }
}

/**
 * 解析 CDN 配置，获取域名列表和策略
 */
export function parseCdnConfig(cdn: CdnConfig | undefined): {domains: string[]; strategy: CdnStrategy} {
  if (!cdn) {
    return {domains: [], strategy: 'first'}
  }

  if (Array.isArray(cdn)) {
    return {domains: cdn, strategy: 'first'}
  }

  return {
    domains: cdn.domains || [],
    strategy: cdn.strategy || 'first',
  }
}

/**
 * 生成带 CDN 域名的资源路径
 */
export function getCdnUrl(cdn: CdnConfig | undefined, path: string): string {
  if (!path) {
    return path
  }

  const {domains, strategy} = parseCdnConfig(cdn)
  const domain = getCdnDomain(domains, strategy)

  if (!domain) {
    return path
  }

  // 确保域名以 / 结尾，路径以 / 开头
  const normalizedDomain = domain.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedDomain}${normalizedPath}`
}
