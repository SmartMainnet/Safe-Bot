import Web3 from 'web3'
import getChains from './getChains.js'

const web3 = new Web3()

export default async (bot, msg) => {
  const chatId = msg.chat.id
  const msgId = msg.message_id
  const address = msg.text.toLowerCase()

  try {
    const isAddress = web3.utils.isAddress(address)
    
    if (isAddress) {
      const botMsg = await bot.sendMessage(chatId, 'Checking...')
      const botMsgId = botMsg.message_id
      
      const chains = await getChains(address)
      const activeChains = chains.filter(chain => chain.status)

      await bot.deleteMessage(chatId, botMsgId)

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

        return false
      }

      if(activeChains.length === 1) {
        const chain = activeChains[0]
        return chain
      }
    } else {
      await bot.sendMessage(chatId, '⚠️ Only contract addresses!')
      return false
    }
  } catch (err) {
    console.log(err)
  }
}