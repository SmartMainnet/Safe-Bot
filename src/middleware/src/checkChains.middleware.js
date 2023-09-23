import getChains from '../../utils/getChains.js'

const checkChainsMiddleware = async (ctx, next) => {
  const msgWait = await ctx.reply('Checking...')

  try {
    const message_id = ctx.update.message.message_id
    const address = ctx.update.message.text.toLowerCase()
    const chains = await getChains(address)
    const activeChains = chains.filter(chain => chain.status)

    if (activeChains.length === 1) {
      ctx.address = address
      ctx.chain = activeChains[0]
      ctx.msgWait = msgWait
      ctx.telegram.editMessageText(
        msgWait.chat.id,
        msgWait.message_id,
        undefined,
        'Audit...'
      )
      next()
    } else if(activeChains.length > 1) {
      ctx.telegram.editMessageText(
        msgWait.chat.id,
        msgWait.message_id,
        undefined,
        'Choose which network to audit the token on',
        {
          parse_mode: 'MARKDOWN',
          reply_to_message_id: message_id,
          disable_web_page_preview: true,
          reply_markup: JSON.stringify({
            inline_keyboard: activeChains.map(chain => [
              { text: chain.name, callback_data: `${chain.name} ${address}` }
            ])
          })
        }
      )
    } else {
      ctx.reply('⚠️ Only contract addresses!')
    }
  } catch (e) {
    console.log(e)
  } finally {
    // ctx.telegram.deleteMessage(msgWait.chat.id, msgWait.message_id)
  }
}

export default checkChainsMiddleware