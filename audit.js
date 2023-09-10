import 'dotenv/config'
import axios from 'axios'
import Web3 from 'web3'
import * as db from './db.js'

const { ETH_RPC, BNB_RPC, MATIC_RPC, AVAX_RPC, FTM_RPC } = process.env

const web3 = new Web3()
const web3ETH = new Web3(ETH_RPC)
const web3BNB = new Web3(BNB_RPC)
const web3MATIC = new Web3(MATIC_RPC)
const web3AVAX = new Web3(AVAX_RPC)
const web3FTM = new Web3(FTM_RPC)

export default async (bot, msg) => {
  const chatId = msg.chat.id
  const msgId = msg.message_id
  const address = msg.text.toLowerCase()

  try {
    const isAddress = web3.utils.isAddress(address)

    if (isAddress) {
      const codeETH = await web3ETH.eth.getCode(address)
      const codeBNB = await web3BNB.eth.getCode(address)
      const codeMATIC = await web3MATIC.eth.getCode(address)
      const codeAVAX = await web3AVAX.eth.getCode(address)
      const codeFTM = await web3FTM.eth.getCode(address)

      const isContractAddressETH = codeETH !== '0x'
      const isContractAddressBNB = codeBNB !== '0x'
      const isContractAddressMATIC = codeMATIC !== '0x'
      const isContractAddressAVAX = codeAVAX !== '0x'
      const isContractAddressFTM = codeFTM !== '0x'

      const chainID = (
        isContractAddressETH ? 1
        : isContractAddressBNB ? 56
        : isContractAddressMATIC ? 137
        : isContractAddressAVAX ? 43114
        : isContractAddressFTM ? 250
        : false
      )

      const chainName = (
        isContractAddressETH ? 'ETH'
        : isContractAddressBNB ? 'BSC'
        : isContractAddressMATIC ? 'Polygon'
        : isContractAddressAVAX ? 'Avalanche'
        : isContractAddressFTM ? 'Fantom'
        : false
      )

      const chainCoin = (
        isContractAddressETH ? 'ETH'
        : isContractAddressBNB ? 'BNB'
        : isContractAddressMATIC ? 'MATIC'
        : isContractAddressAVAX ? 'AVAX'
        : isContractAddressFTM ? 'FTM'
        : false
      )

      const chainScan = (
        isContractAddressETH ? 'https://etherscan.io/token/'
        : isContractAddressBNB ? 'https://bscscan.com/token/'
        : isContractAddressMATIC ? 'https://polygonscan.com/token/'
        : isContractAddressAVAX ? 'https://avascan.info/blockchain/c/token/'
        : isContractAddressFTM ? 'https://ftmscan.com/token/'
        : false
      )

      if (chainID) {
        const botMsg = await bot.sendMessage(chatId, 'Checking...')
        const botMsgId = botMsg.message_id

        const resGoPlus = await axios.get(`https://api.gopluslabs.io/api/v1/token_security/${chainID}?contract_addresses=${address}`)

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
          `🔗 Network: *${chainName}*\n` +
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
            reply_to_message_id: msgId,
            disable_web_page_preview: true,
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [
                  { text: 'Audit', url: `https://gopluslabs.io/token-security/${chainID}/${address}` },
                  { text: 'Contract', url: `${chainScan}${address}` }
                ],
                [
                  { text: 'Buy', url: `https://app.1inch.io/#/${chainID}/simple/swap/${chainCoin}/${address}` },
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