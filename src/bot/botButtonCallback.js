import chains from "../audit/getChains.js"
import audit from "../audit/startAudit.js"

export default async bot => {
  bot.on('callback_query', async callback => {
    const msg = callback.message
    const chainName = callback.data.split(' ')[0]
    const address = callback.data.split(' ')[1]
    const chatId = msg.chat.id
    const msgId = msg.message_id
    const activeChains = (await chains(address)).filter(chain => chain.name === chainName)

    bot.deleteMessage(chatId, msgId)

    try {
      audit(bot, msg, address, ...activeChains)
    } catch (err) {
      console.log(err)
    }
  })
}