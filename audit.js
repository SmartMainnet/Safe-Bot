import 'dotenv/config'
import axios from 'axios'
import Web3 from 'web3'
import * as db from './db.js'

const { BNB_ENDPOINT, ETH_ENDPOINT } = process.env

const web3 = new Web3()
const web3BNB = new Web3(BNB_ENDPOINT)
const web3ETH = new Web3(ETH_ENDPOINT)

export default async (bot, msg) => {
  const chatId = msg.chat.id
  const msgId = msg.message_id
  const address = msg.text.toLowerCase()

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

        const goPlus = name => parseInt(resGoPlus.data.result[address][name]) === 1

        const ownerAddress = resGoPlus.data.result[address].owner_address
        const tokenName = resGoPlus.data.result[address].token_name
        const tokenSymbol = resGoPlus.data.result[address].token_symbol
        const totalSupply = resGoPlus.data.result[address].total_supply.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')

        const buyTaxValue = resGoPlus.data.result[address].buy_tax * 100
        const sellTaxValue = resGoPlus.data.result[address].sell_tax * 100
        const buyTax = buyTaxValue.toFixed(0) + (buyTaxValue > 15 ? ` % ⚠️` : '%')
        const sellTax = sellTaxValue.toFixed(0) + (sellTaxValue > 15 ? ` % ⚠️` : '%')

        const isRenounced = ownerAddress === '0x000000000000000000000000000000000000dead' || ownerAddress === '0x0000000000000000000000000000000000000000' ? 'Yes' : 'No'
        const isContractVerified = goPlus('is_open_source')

        const yes = '⚠️ Yes:'
        const no = '🟢 No:'
        const unknown = '❓'

        const isProxy = isContractVerified ? (goPlus('is_proxy') ? yes : no) : unknown
        const isAntiWhale = isContractVerified ? (goPlus('is_anti_whale') ? yes : no) : unknown
        const isBlacklist = isContractVerified ? (goPlus('is_blacklisted') ? yes : no) : unknown
        const isMintable = isContractVerified ? (goPlus('is_mintable') ? yes : no) : unknown
        const isHiddenOwner = isContractVerified ? (goPlus('hidden_owner') ? yes : no) : unknown
        const isWhitelisted = isContractVerified ? (goPlus('is_whitelisted') ? yes : no) : unknown
        const isTradingCooldown = isContractVerified ? (goPlus('trading_cooldown') ? yes : no) : unknown
        const isTransferPausable = isContractVerified ? (goPlus('transfer_pausable') ? yes : no) : unknown
        const isSlippageModifiable = isContractVerified ? (goPlus('slippage_modifiable') ? yes : no) : unknown
        const isAntiWhaleModifiable = isContractVerified ? (goPlus('anti_whale_modifiable') ? yes : no) : unknown
        const isBackOwner = isContractVerified ? (goPlus('can_take_back_ownership') ? yes : no) : unknown

        const trustRes = await axios.get(`https://bsc-explorer-api.nodereal.io/api/tools/getSecurityByAddress?address=${address}`)

        const trustLevel = isContractVerified ? '0' : trustRes.data.data.trust_level
        const trustScore = isContractVerified ? '0' : trustRes.data.data.trust_score
        const band = isContractVerified ? '0' : trustRes.data.data.band

        bot.deleteMessage(chatId, botMsgId)
        bot.sendMessage(
          chatId,
          `🏷 *Name:* ${tokenName}\n` +
          `⭐ *Symbol:* ${tokenSymbol}\n` +
          `🔗 *Network:* ${isContractAddressBNB ? 'BSC' : 'ETH'}\n` +
          `➡️ *Total Supply:* ${totalSupply}\n` +
          `💰 *Tax:* Buy ${buyTax} | Sell ${sellTax}\n` +
          `📄 *Contract Verified:* ${isContractVerified ? 'Yes' : 'No ⚠️'}\n` +
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
                  { text: 'Audit', url: `https://gopluslabs.io/token-security/${isContractAddressBNB ? 56 : 1}/${address}` },
                  { text: 'Contract', url: `https://${isContractAddressBNB ? 'bscscan.com' : 'etherscan.io'}/token/${address}` }
                ],
                [
                  { text: 'Buy', url: `https://app.1inch.io/#/${isContractAddressBNB ? 56 : 1}/simple/swap/${isContractAddressBNB ? 'BNB' : 'ETH'}/${address}` },
                  { text: 'Chart', url: `https://${isContractAddressBNB ? 'poocoin.app/tokens' : 'coingecko.com/en/coins'}/${address}` }
                ],
              ]
            })
          }
        )

        await db.successfulCall(msg)
      } else {
        bot.sendMessage(chatId,
          '⚠️ BSC/ETH Contracts only!',
          { reply_to_message_id: msgId }
        )

        await db.badCall(msg)
      }
    } else {
      bot.sendMessage(chatId,
        '⚠️ No BSC/ETH Contract Address entered!',
        { reply_to_message_id: msgId }
      )

      await db.badCall(msg)
    }
  } catch (err) {
    console.log(err)
  }
}