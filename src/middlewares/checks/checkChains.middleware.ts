import { checkChainsInlineKeyboard } from '../../keyboards/inline_keyboard/index.ts'
import { ContextType } from '../../types/index.ts'
import { getChains } from '../../utils/index.ts'

export const checkChains = async (ctx: ContextType, next: () => void) => {
  try {
    const msgWait = await ctx.reply(ctx.t('checking'))
    // const message_id = ctx.update.message?.message_id
    const from = ctx.update.message?.from
    const address = ctx.update.message?.text?.toLowerCase() || ''
    const chains = (await getChains(address)).filter(chain => chain.status)

    if (chains.length === 1) {
      ctx.config = {
        msgWait: msgWait,
        user: from,
        address: address,
        chain: chains[0]
      }
      ctx.api.editMessageText(
        msgWait.chat.id,
        msgWait.message_id,
        ctx.t('audit')
      )
      next()
    } else if(chains.length > 1) {
      ctx.api.editMessageText(
        msgWait.chat.id,
        msgWait.message_id,
        ctx.t('chain_selection'),
        {
          parse_mode: 'Markdown',
          // reply_to_message_id: message_id,
          disable_web_page_preview: true,
          reply_markup: checkChainsInlineKeyboard(chains, address)
        }
      )
    } else {
      ctx.reply(ctx.t('only_contracts'))
    }
  } catch (e) {
    console.log(e)
  }
}