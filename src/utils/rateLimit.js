import rateLimit from 'telegraf-ratelimit'

const limitConfig = {
  window: 3000,
  limit: 1,
  onLimitExceeded: (ctx, next) => ctx.reply('Rate limit exceeded')
}

export const limit = rateLimit(limitConfig)