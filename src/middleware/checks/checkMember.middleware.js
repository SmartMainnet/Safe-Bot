const { CHANNEL } = process.env

export const checkMember = async (ctx, next) => {
  try {
    const userId = ctx.update.message.from.id
  
    if (CHANNEL) {
      const join = await ctx.telegram.getChatMember(CHANNEL, userId)
      const isJoined = join.status !== 'left'
  
      if (isJoined) {
        next()
      } else {
        ctx.reply(
          `To use the Bot, you must be a Member from [Smart Bots](https://t.me/${CHANNEL.replace('@', '')})`,
          { parse_mode: 'MARKDOWN' }
        )
      }
    } else {
      next()
    }
  } catch (e) {
    console.log(e)
  }
}