import Web3 from 'web3'
import chains from './chains.js'
import audit from './audit.js'

const web3 = new Web3()

export default async (bot, msg) => {
  const chatId = msg.chat.id
  const msgId = msg.message_id
  const address = msg.text.toLowerCase()

  try {
    const isAddress = web3.utils.isAddress(address)
    
    if (isAddress) {
      const activeChains = (await chains(address)).filter(chain => chain.status)

      if(activeChains.length > 1) {
        bot.sendMessage(chatId,
          'Choose which network to audit the token on',
          {
            parse_mode: 'MARKDOWN',
            reply_to_message_id: msgId,
            disable_web_page_preview: true,
            reply_markup: JSON.stringify({
              inline_keyboard: activeChains.map(chain => [
                { text: chain.name, callback_data: `${chain.name} ${address}` }
              ])
            })
          }
        )
      }

      if(activeChains.length === 1) {
        audit(bot, msg, address, ...activeChains)
      }
    }
  } catch (err) {
    
  }
}