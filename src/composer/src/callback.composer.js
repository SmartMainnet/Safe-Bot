import { Composer } from 'telegraf'
import chains from '../../utils/chains.js'
import audit from '../../utils/audit.js'

const composer = new Composer()

export default composer.action(async (data, ctx) => {
  try {
    const address = data.split(' ')[1]
    const chainName = data.split(' ')[0]
    const chain = chains.filter(chain => chain.name === chainName)[0]
    
    ctx.editMessageText('Audit...')
    ctx.msgWait = ctx.update.callback_query.message
    ctx.address = address
    ctx.chain = chain
  
    audit(ctx)
  } catch (e) {
    console.log(e)
  }
})