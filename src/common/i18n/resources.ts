import type { Locale } from './types'

import ru from '../../locales/ru/common.json'
import en from '../../locales/en/common.json'
import kk from '../../locales/kk/common.json'

export type I18nResources = Record<string, any>

export const resources: Record<Locale, I18nResources> = {
  ru,
  en,
  kk
}
