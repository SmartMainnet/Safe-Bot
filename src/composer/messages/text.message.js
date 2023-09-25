import { Composer } from 'telegraf'

const composer = new Composer()

export const textMessage = composer.hears(
  (msg, ctx) => ctx.reply(ctx.i18n.t('warning'))
)