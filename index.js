import 'dotenv/config'
import TelegramApi from 'node-telegram-bot-api'
import axios from 'axios'
import Web3 from 'web3'
import fs from 'fs'

const { BOT_TOKEN, BNB_ENDPOINT, ETH_ENDPOINT } = process.env

const web3 = new Web3()
const web3BNB = new Web3(BNB_ENDPOINT)
const web3ETH = new Web3(ETH_ENDPOINT)
const bot = new TelegramApi(BOT_TOKEN, { polling: true })

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id
  const isPrivateChat = msg.chat.type === 'private'
  
  if (isPrivateChat) {
    const startMessage = (
      "🤝 Welcome to Monsta Safe Bot!\n" +
      "🦺 Audit and Trust Report for BSC Contracts!\n" +
      "➡️ Promote, FAQ and Instructions:\n@MonstaSafeChannel\n\n" +  
      "Enter BSC Contract Address for Audit and Trust Report!\n" +
      "Example: `0xbCe62F8936B1AFF0A57ceB3D1031486f1d61d095`"
    )
    
    bot.sendMessage(chatId, startMessage, { parse_mode: "Markdown" })
  }
})

const commands = [
//  { command: 'start', description: 'Start the bot' },
//  { command: 'audit', description: 'Run an audit' },
]

bot.setMyCommands(commands).then(() => {
  console.log('Bot commands updated successfully')
}).catch((error) => {
  console.log('Error updating bot commands:', error)
})

const getButtonTexts = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile('button.txt', 'utf8', (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const lines = data.split('\n')
      const buttonTexts = lines.map(line => {
        const [buttonText, url] = line.split('|')
        return { text: buttonText.trim(), url: url.trim() }
      })

      resolve(buttonTexts)
    })
  })
}

const audit = async (chatId, msgId, address) => {
  try {
    const isAddress = web3.utils.isAddress(address)
        
    if (isAddress) {
      const codeBNB = await web3BNB.eth.getCode(address)
      const codeETH = await web3ETH.eth.getCode(address)

      const isContractAddressBNB = codeBNB !== '0x'
      const isContractAddressETH = codeETH !== '0x'
      
      if (isContractAddressBNB || isContractAddressETH) {
        const botMsg = await bot.sendMessage(chatId, 'Checking...')
        const botMsgId = botMsg.message_id

        const resGoPlus = await axios.get(`https://api.gopluslabs.io/api/v1/token_security/${isContractAddressBNB ? 56 : 1}?contract_addresses=${address}`)

        const ownerAddress = resGoPlus.data.result[address].owner_address
        const tokenName = resGoPlus.data.result[address].token_name
        const tokenSymbol = resGoPlus.data.result[address].token_symbol
        const totalSupply = resGoPlus.data.result[address].total_supply.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')
        const holderCount = resGoPlus.data.result[address].holder_count
		
        const buyTaxValue = resGoPlus.data.result[address].buy_tax * 100
        const sellTaxValue = resGoPlus.data.result[address].sell_tax * 100
        const buyTax = buyTaxValue.toFixed(0) + (buyTaxValue > 15 ? ` % ⚠️` : '%')
        const sellTax = sellTaxValue.toFixed(0) + (sellTaxValue > 15 ? ` % ⚠️` : '%')



        const isRenounced = ownerAddress === '0x000000000000000000000000000000000000dead' || ownerAddress === '0x0000000000000000000000000000000000000000' ? 'Yes' : 'No'
        const isContractVerified = parseInt(resGoPlus.data.result[address].is_open_source) === 1 ? 'Yes' : 'No ⚠️'

        const isProxy = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].is_proxy) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isAntiWhale = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].is_anti_whale) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isBlacklist = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].is_blacklisted) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isMintable = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].is_mintable) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isHiddenOwner = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].hidden_owner) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isWhitelisted = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].is_whitelisted) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isTradingCooldown = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].trading_cooldown) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isTransferPausable = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].transfer_pausable) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isSlippageModifiable = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].slippage_modifiable) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isAntiWhaleModifiable = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].anti_whale_modifiable) === 1 ? '⚠️ Yes:' : '🟢 No:')
        const isBackOwner = isContractVerified === 'No ⚠️' ? '❓' : (parseInt(resGoPlus.data.result[address].can_take_back_ownership) === 1 ? '⚠️ Yes:' : '🟢 No:')

        const trustRes = await axios.get(`https://bsc-explorer-api.nodereal.io/api/tools/getSecurityByAddress?address=${address}`)

        const trustLevel = isContractVerified === 'No ⚠️' ? '0' : trustRes.data.data.trust_level
        const trustScore = isContractVerified === 'No ⚠️' ? '0' : trustRes.data.data.trust_score
        const band = isContractVerified === 'No ⚠️' ? '0' : trustRes.data.data.band
		
        const buttonTexts = await getButtonTexts()
        const randomIndex = Math.floor(Math.random() * buttonTexts.length)
        const { text: buttonText, url } = buttonTexts[randomIndex]
		
  
        bot.deleteMessage(chatId, botMsgId)
        bot.sendMessage(
          chatId,
          `🏷 *Name:* ${tokenName}\n` +
          `⭐ *Symbol:* ${tokenSymbol}\n` +
          `🔗 *Network:* ${isContractAddressBNB ? 'BNB' : 'ETH'}\n` +
          `➡️ *Total Supply:* ${totalSupply}\n` +
          `👥 *Holders:* ${holderCount}\n` +
          `💰 *Tax:* Buy ${buyTax} | Sell ${sellTax}\n` +
          `📄 *Contract Verified:* ${isContractVerified}\n` +
          `🔁 *Renounced Ownership:* ${isRenounced}\n\n` +
          `👨‍💻 *Audit Report:*\n` +
          `${isBackOwner} *Regain Ownership*\n` +
          `${isHiddenOwner} *Hidden Ownership*\n` +
          `${isProxy} *Proxy Contract*\n` +
          `️${isAntiWhale} *Anti Whale*\n` +
          `️${isAntiWhaleModifiable} *Anti Whale Modifiable*\n` +
          `${isBlacklist} *Blacklist*\n` +
          `${isMintable} *Mintable*\n` +
          `${isTradingCooldown} *Trading Cooldown*\n` +
          `${isTransferPausable} *Trading Pausable*\n` +
          `${isSlippageModifiable} *Tax Modifiable*\n` +
          `${isWhitelisted} *Whitelist*\n\n` +
          `👨‍💻 *Trust Report:*\n` +
          `🤝 *Trust Level:* ${trustLevel} | ${band}\n` +
          `⚔️ *Trust Score:* ${trustScore}\n\n` +
          `❗️*NOT FINANCIAL ADVICE*❗️\n\n` +
          `[🔥 Promote](https://t.me/MonstaSafeChannel/12)\n` +
          `[💡 Audit FAQ](https://t.me/MonstaSafeChannel/14)\n` +
          `[ℹ️ Bot Instructions](https://t.me/MonstaSafeChannel/20)\n`,
          {
            parse_mode: 'MARKDOWN',
            reply_to_message_id: msgId,
            disable_web_page_preview: true,
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  { text: 'Audit', url: `https://gopluslabs.io/token-security/56/${address}` },
                  { text: 'Contract', url: `https://bscscan.com/token/${address}#balances` }
                ],
                [
                  { text: 'Buy', url: `https://pancakeswap.finance/swap?outputCurrency=${address}&inputCurrency=BNB` },
                  { text: 'Chart', url: `https://poocoin.app/tokens/${address}` }
                ],
                [{ text: buttonText, url: url }]
              ]
            })
          }
        )
      } else {
        bot.sendMessage(chatId,
          'BSC Contracts only!',
          { reply_to_message_id: msgId }
        )
      }
    } else {
      bot.sendMessage(chatId,
        'No BSC Contract Address entered!',
        { reply_to_message_id: msgId }
      )
    }
  } catch (err) {
    console.log(err)
  }
}

bot.on('message', async msg => {
  try {
    // Check if the message contains text and is not null
    if (msg.text && typeof msg.text === 'string') {
      const text = msg.text.toLowerCase()
      const chatId = msg.chat.id
      const msgId = msg.message_id
      const isGroup = chatId < 0

      if (text) {
        const address = text.trim()

        if (address && /^(0x)?[0-9a-fA-F]{40}$/i.test(address)) {
          await audit(chatId, msgId, address)
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
})