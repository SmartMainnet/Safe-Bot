import rateLimit from 'telegraf-ratelimit'

const limitConfig = {
  window: 3000,
  limit: 1,
  onLimitExceeded: ctx => ctx.reply(ctx.i18n.t('limit'))
}

export const limitMiddleware = rateLimit(limitConfig)