import axios from 'axios'
import * as db from '../database/db.js'

export default async (bot, msg, address, chain) => {
  const chatId = msg.chat.id

  try {
    const botMsg = await bot.sendMessage(chatId, 'Audit...')
    const botMsgId = botMsg.message_id

    const resGoPlus = await axios.get(`https://api.gopluslabs.io/api/v1/token_security/${chain.id}?contract_addresses=${address}`)

    const goPlus = name => parseInt(resGoPlus.data.result[address][name]) === 1

    const ownerAddress = resGoPlus.data.result[address].owner_address
    const tokenName = resGoPlus.data.result[address].token_name
    const tokenSymbol = resGoPlus.data.result[address].token_symbol
    const totalSupply = String(Math.floor(resGoPlus.data.result[address].total_supply)).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')

    const buyTaxValue = resGoPlus.data.result[address].buy_tax * 100
    const sellTaxValue = resGoPlus.data.result[address].sell_tax * 100
    const buyTax = buyTaxValue.toFixed(0) + (buyTaxValue > 15 ? ` % ⚠️` : '%')
    const sellTax = sellTaxValue.toFixed(0) + (sellTaxValue > 15 ? ` % ⚠️` : '%')

    const isRenounced = ownerAddress === '0x000000000000000000000000000000000000dead' || ownerAddress === '0x0000000000000000000000000000000000000000' ? 'Yes' : 'No'
    const isContractVerified = goPlus('is_open_source')

    const yes = ['⚠️', 'Yes']
    const no = ['✅', 'No']
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

    bot.deleteMessage(chatId, botMsgId)
    bot.sendMessage(
      chatId,
      `🏷 Name: *${tokenName}*\n` +
      `💸 Symbol: *${tokenSymbol}*\n` +
      `🔗 Network: *${chain.name}*\n` +
      `🪙 Total Supply: *${totalSupply}*\n` +
      `💰 Tax: *Buy ${buyTax} | Sell ${sellTax}*\n` +
      `📄 Contract Verified: *${isContractVerified ? 'Yes' : 'No ⚠️'}*\n` +
      `🔁 Renounced Ownership: *${isRenounced}*\n\n` +
      `*Audit Report:*\n` +
      `${isBackOwner[0]} Regain Ownership: *${isBackOwner[1]}*\n` +
      `${isHiddenOwner[0]} Hidden Ownership: *${isHiddenOwner[1]}*\n` +
      `${isProxy[0]} Proxy Contract: *${isProxy[1]}*\n` +
      `️${isAntiWhale[0]} Anti Whale: *${isAntiWhale[1]}*\n` +
      `️${isAntiWhaleModifiable[0]} Anti Whale Modifiable: *${isAntiWhaleModifiable[1]}*\n` +
      `${isBlacklist[0]} Blacklist: *${isBlacklist[1]}*\n` +
      `${isMintable[0]} Mintable: *${isMintable[1]}*\n` +
      `${isTradingCooldown[0]} Trading Cooldown: *${isTradingCooldown[1]}*\n` +
      `${isTransferPausable[0]} Trading Pausable: *${isTransferPausable[1]}*\n` +
      `${isSlippageModifiable[0]} Tax Modifiable: *${isSlippageModifiable[1]}*\n` +
      `${isWhitelisted[0]} Whitelist: *${isWhitelisted[1]}*\n\n` +
      `❗️*NOT FINANCIAL ADVICE*❗️\n\n`,
      {
        parse_mode: 'MARKDOWN',
        // reply_to_message_id: msgId,
        disable_web_page_preview: true,
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: 'Audit', url: `https://gopluslabs.io/token-security/${chain.id}/${address}` },
              { text: 'Contract', url: `${chain.scan}${address}` }
            ],
            [
              { text: 'Buy', url: `https://app.1inch.io/#/${chain.id}/simple/swap/${chain.coin}/${address}` },
              { text: 'Chart', url: `https://${chain.name === 'BSC' ? 'poocoin.app/tokens' : 'coingecko.com/en/coins'}/${address}` }
            ],
          ]
        })
      }
    )

    await db.successfulCall(msg)
  } catch (err) {
    console.log(err)
  }
}