import telegraf from 'telegraf'
import chains from '../../utils/chains.js'
import audit from '../../utils/audit.js'

const composer = new telegraf.Composer()

export const buttonCallback = composer.action(async (data, ctx) => {
  try {
    const msgWait = ctx.update.callback_query.message
    const from = ctx.update.callback_query.from
    const address = data.split(' ')[1]
    const chainName = data.split(' ')[0]
    const chain = chains.filter(chain => chain.name === chainName)[0]
    
    ctx.msgWait = msgWait
    ctx.user = from
    ctx.address = address
    ctx.chain = chain
    ctx.editMessageText(ctx.i18n.t('audit'))
  
    audit(ctx)
  } catch (e) {
    console.log(e)
  }
})