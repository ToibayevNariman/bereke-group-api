import type { Locale } from './types'
import { resources } from './resources'

export const supportedLocales: readonly Locale[] = ['kk', 'ru', 'en'] as const
export const defaultLocale: Locale = 'ru'

type HeadersLike = Record<string, unknown>

function normalizeLocale(value: string): Locale | null {
  const v = value.trim().toLowerCase()
  if (v === 'ru' || v.startsWith('ru-')) return 'ru'
  if (v === 'en' || v.startsWith('en-')) return 'en'
  if (v === 'kk' || v.startsWith('kk-')) return 'kk'
  return null
}

function getHeader(headers: HeadersLike, name: string): string | undefined {
  const raw = (headers as any)[name]
  if (typeof raw === 'string') return raw
  if (Array.isArray(raw) && typeof raw[0] === 'string') return raw[0]
  return undefined
}

export function resolveLocale(headers: HeadersLike): Locale {
  // 1) X-Lang (preferred)
  const xLang = getHeader(headers, 'x-lang')
  if (xLang) {
    const normalized = normalizeLocale(xLang)
    if (normalized) return normalized
  }

  // 2) Accept-Language
  const acceptLanguage = getHeader(headers, 'accept-language')
  if (acceptLanguage) {
    const candidates = acceptLanguage
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [tagRaw, ...params] = part.split(';').map((p) => p.trim())
        const tag = tagRaw || ''
        const qParam = params.find((p) => p.startsWith('q='))
        const q = qParam ? Number.parseFloat(qParam.slice(2)) : 1
        return { tag, q: Number.isFinite(q) ? q : 0 }
      })
      .sort((a, b) => b.q - a.q)

    for (const { tag } of candidates) {
      const normalized = normalizeLocale(tag)
      if (normalized) return normalized
    }
  }

  // 3) fallback
  return defaultLocale
}

function getByPath(obj: any, path: string): unknown {
  const parts = path.split('.').filter(Boolean)
  let cur: any = obj
  for (const p of parts) {
    if (!cur || typeof cur !== 'object' || !(p in cur)) return undefined
    cur = cur[p]
  }
  return cur
}

function interpolate(template: string, params?: Record<string, any>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      return String(params[key])
    }
    return match
  })
}

export function createTranslator(locale: Locale) {
  return (key: string, params?: Record<string, any>): string => {
    const primary = getByPath(resources[locale], key)
    if (typeof primary === 'string') return interpolate(primary, params)

    const fallback = getByPath(resources[defaultLocale], key)
    if (typeof fallback === 'string') return interpolate(fallback, params)

    return key
  }
}

export type { Locale }
