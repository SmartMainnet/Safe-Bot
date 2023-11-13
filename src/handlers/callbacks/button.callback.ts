import { ContextType } from '../../types/index.ts'
import { audit, chainList } from '../../utils/index.ts'

export const buttonCallback = async (ctx: ContextType) => {
  try {
    const data = ctx.update?.callback_query?.data
    const msgWait = ctx.update?.callback_query?.message
    const from = ctx.update?.callback_query?.from
    const address = data?.split(' ')[1]
    const chainName = data?.split(' ')[0]
    const chain = chainList.filter(chain => chain.name === chainName)[0]

    ctx.config = {
      msgWait: msgWait,
      user: from,
      address: address,
      chain: chain
    }
    ctx.editMessageText(ctx.t('audit'))
  
    audit(ctx)
  } catch (e) {
    console.log(e)
  }
}