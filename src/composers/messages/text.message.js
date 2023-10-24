import { newCall } from '../../database/methods/index.js'

export const textMessage = ctx => {
  const from = ctx.update.message.from
  const text = ctx.update.message.text

  ctx.reply(ctx.t('only_contracts'))

  newCall(from.id, text, false)
}