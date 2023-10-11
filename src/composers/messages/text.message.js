import Composer from 'telegraf'

import { newCall } from '../../database/index.js'

const composer = new Composer()

export const textMessage = composer.hears(
  (msg, ctx) => {
    const from = ctx.update.message.from
    const text = ctx.update.message.text

    ctx.reply(ctx.i18n.t('only_contracts'))

    newCall(from.id, text, false)
  }
)