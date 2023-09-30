import path from 'path'
import TelegrafI18n from 'telegraf-i18n'

const i18n = new TelegrafI18n({
  defaultLanguage: 'en',
  allowMissing: false,
  directory: path.resolve(`${process.cwd()}/src`, 'locales')
})

export const i18nMiddleware = i18n.middleware()