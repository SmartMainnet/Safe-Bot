import { ContextType } from "../../types/index.ts"

const { CHANNEL } = process.env

export const checkMember = async (ctx: ContextType, next: () => void) => {
  try {
    const userId = ctx.update.message?.from.id || 0
  
    if (CHANNEL) {
      const join = await ctx.api.getChatMember(CHANNEL, userId)
      const isJoined = join.status !== 'left'
  
      if (isJoined) {
        next()
      } else {
        ctx.reply(
          ctx.t('only_members', { CHANNEL: CHANNEL.replace('@', '') }),
          { parse_mode: 'Markdown' }
        )
      }
    } else {
      next()
    }
  } catch (e) {
    console.log(e)
  }
}