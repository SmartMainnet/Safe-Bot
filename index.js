import 'dotenv/config'
import TelegramApi from 'node-telegram-bot-api'
import axios from 'axios'
import Web3 from 'web3'

const { BOT_TOKEN, BOT_NAME, BNB_API } = process.env

const web3 = new Web3(BNB_API)
const bot = new TelegramApi(BOT_TOKEN, { polling: true })

const audit = async (chatId, msgId, address) => {
  try {
    const isAddress = web3.utils.isAddress(address)
        
    if (isAddress) {
      const code = await web3.eth.getCode(address)
      const isContractAddress = code !== '0x'
      
      if (isContractAddress) {
        const botMsg = await bot.sendMessage(chatId, 'Checking...')
        const botMsgId = botMsg.message_id

        const resGoPlus = await axios.get(`https://api.gopluslabs.io/api/v1/token_security/56?contract_addresses=${address}`)
        const holderCount = resGoPlus.data.result[address].holder_count
        const ownerAddress = resGoPlus.data.result[address].owner_address
        const tokenName = resGoPlus.data.result[address].token_name
        const tokenSymbol = resGoPlus.data.result[address].token_symbol
        const isRenounced = ownerAddress === '0x0000000000000000000000000000000000000000'
  
        const honeypotRes = await axios.get(`https://aywt3wreda.execute-api.eu-west-1.amazonaws.com/default/IsHoneypot?chain=bsc2&token=${address}`)
        const isHoneypot = honeypotRes.data.IsHoneypot
        const buyTax = honeypotRes.data.BuyTax
        const sellTax = honeypotRes.data.SellTax
        const buyGas = honeypotRes.data.BuyGas.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')
        const sellGas = honeypotRes.data.SellGas.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')
        
        const trustRes = await axios.get(`https://bsc-explorer-api.nodereal.io/api/tools/getSecurityByAddress?address=${address}`)
        const trustLevel = trustRes.data.data.trust_level
        const trustScore = trustRes.data.data.trust_score
        const band = trustRes.data.data.band
  
        bot.deleteMessage(chatId, botMsgId)
        bot.sendMessage(chatId,
          `\`\`\` - Not financial advice - \`\`\`\n\n` +
          `🏷 *Name:* ${tokenName}\n` +
          `💵 *Symbol:* ${tokenSymbol}\n\n` +
          `📝 *Contract Renounced:* ${isRenounced ? 'Yes' : 'No'}\n` +
          `🍯 *Honeypot:* ${isHoneypot ? 'Yes' : 'No'}\n` +
          `🧑 *Holders:* ${holderCount}\n` +
          `💸 *Tax:* Buy ${buyTax}% | Sell ${sellTax}%\n` +
          `⛽️ *Gas:* ${buyGas} | ${sellGas}\n` +
          `🔒 *Trust Level:* ${trustLevel} | ${band}\n` +
          `⚔️ *Trust Score:* ${trustScore}`,
          {
            parse_mode: 'MARKDOWN',
            reply_to_message_id: msgId,
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{ text: 'Buy', url: `https://pancakeswap.finance/swap?outputCurrency=${address}&inputCurrency=BNB` }],
                [
                  { text: 'BscScan', url: `https://bscscan.com/token/${address}` },
                  { text: 'Chart', url: `https://poocoin.app/tokens/${address}` },
                ],
                [{ text: 'BSC AI Global', url: `https://t.me/bscaiglobal` }],
              ]
            })
          }
        )
      } else {
        bot.sendMessage(chatId,
          'BSC Contract Address only ➡️ /help',
          { reply_to_message_id: msgId }
        )
      }
    } else {
      bot.sendMessage(chatId,
        'No Contract Address entered ➡️ /help',
        { reply_to_message_id: msgId }
      )
    }
  } catch (err) {
    console.log(err)
  }
}

bot.setMyCommands([
  { command: '/audit', description: '/audit <Contract Address> - audit contract' },
  { command: '/info', description: 'Returns Trust Level and Trust Score explanation' },
  { command: '/help', description: 'Returns Bot Commands' },
])

bot.on('message', async msg => {
  try {
    const text = msg.text.toLowerCase()
    const chatId = msg.chat.id
    const msgId = msg.message_id
    const isGroup = chatId < 0

    if (text) {
      const command = text.split(/\ /)[0]
      const address = text.split(/\ /)[1]

      if (text === '/start' && !isGroup) {
        await bot.sendMessage(chatId,
          `👋 Hello ${msg.from.first_name}${(msg.from.last_name === undefined) ? '' : ` ${msg.from.last_name}`}!\n` +
          '🤖 Welcome to BSC AI Safe Bot\n' +
          '👨‍💻 Author: @bscaiglobal'
        )
        await bot.sendMessage(chatId,
          '🔒 Trust Level - Likelihood and impact of the risk\n' +
          '⚔️ Trust Score is used to measure the liquidity of trading pairs on cryptocurrency exchanges, as well as to measure overall liquidity and scale of transactions\n' +
          '✅ We use security audit platforms (https://gopluslabs.io, https://hashdit.io, https://blocksec.com)',
          { disable_web_page_preview: true }
        )
        await bot.sendMessage(chatId,
          'Enter the contract address in the BSC network to check it\n' +
          'Example: \`0x7bf1988dc86ef21244ad075686d00d3e9d596c8f\`',
          { parse_mode: 'MARKDOWN' }
        )

        const join = await bot.getChatMember('@bscaiglobal', chatId)
        const isJoined = join.status !== 'left'
  
        if (!isJoined) {
          await bot.sendMessage(chatId,
            'To use the bot, join the [BSC AI Project](https://t.me/bscaiglobal)',
            { parse_mode: 'MARKDOWN' }
          )
        }
      } else if ((text === '/info' && !isGroup) || (text === `/info${BOT_NAME}` && isGroup)) {
        await bot.sendMessage(chatId,
          '🔒 Trust Level - Likelihood and impact of the risk\n' +
          '⚔️ Trust Score is used to measure the liquidity of trading pairs on cryptocurrency exchanges, as well as to measure overall liquidity and scale of transactions\n' +
          '✅ We use security audit platforms (https://gopluslabs.io, https://hashdit.io, https://blocksec.com)',
          {
            reply_to_message_id: msgId,
            disable_web_page_preview: true
          }
        )
      } else if (text === '/help' && !isGroup) {
        await bot.sendMessage(chatId,
          'Enter the contract address in the BSC network to check it\n' +
          'Example: \`0x7bf1988dc86ef21244ad075686d00d3e9d596c8f\`',
          {
            parse_mode: 'MARKDOWN',
            reply_to_message_id: msgId
          }
        )
      } else if (text === `/help${BOT_NAME}` && isGroup) {
        await bot.sendMessage(chatId,
          '🔒 Enter the contract address in the BSC network to check it\n' +
          '✅ Example:\n \`/audit 0x7bf1988dc86ef21244ad075686d00d3e9d596c8f\`',
          {
            parse_mode: 'MARKDOWN',
            reply_to_message_id: msgId
          }
        )
      } else if ((command === '/audit' || command === `/audit${BOT_NAME}`) && isGroup) {
        audit(chatId, msgId, address)
      } else if (!isGroup) {
        try {
          const join = await bot.getChatMember('@bscaiglobal', chatId)
          const isJoined = join.status !== 'left'
      
          if (!isJoined) {
            await bot.sendMessage(chatId,
              'To use the bot, join the [BSC AI Project](https://t.me/bscaiglobal)',
              { parse_mode: 'MARKDOWN' }
            )
          } else {
            audit(chatId, msgId, text)
          }
        } catch (err) {
          console.log(err)
          await bot.sendMessage(chatId, 'Something went wrong')
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
})