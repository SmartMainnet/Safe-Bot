import rateLimit from 'telegraf-ratelimit'

const limitConfig = {
  window: 2000,
  limit: 2,
  onLimitExceeded: ctx => ctx.reply(ctx.i18n.t('limit'))
}

export const limitMiddleware = rateLimit(limitConfig)