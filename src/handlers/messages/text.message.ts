import { ContextType } from '../../types/index.ts'

export const textMessage = (ctx: ContextType) => {
  ctx.reply(ctx.t('only_contracts'))
}