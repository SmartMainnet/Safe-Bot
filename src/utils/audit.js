import axios from 'axios'
// import db from '../database/db.js'

export default async ctx => {
  try {
    const msgWait = ctx.msgWait
    const address = ctx.address
    const chain = ctx.chain

    const resGoPlus = await axios.get(`https://api.gopluslabs.io/api/v1/token_security/${chain.id}?contract_addresses=${address}`)
    const res = resGoPlus.data.result[address]

    const buyTaxValue = res.buy_tax * 100
    const sellTaxValue = res.sell_tax * 100

    const buyTax = buyTaxValue.toFixed(0) + (buyTaxValue > 15 ? `% ⚠️` : '%')
    const sellTax = sellTaxValue.toFixed(0) + (sellTaxValue > 15 ? `% ⚠️` : '%')

    const totalSupply = String(Math.floor(res['total_supply'])).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1,')
    const isRenounced = res.owner_address === '0x000000000000000000000000000000000000dead' || res.owner_address === '0x0000000000000000000000000000000000000000'

    const token = {
      res,
      buyTax,
      sellTax,
      totalSupply,
      isRenounced,
      chain: chain.name,
    }

    ctx.telegram.editMessageText(
      msgWait.chat.id,
      msgWait.message_id,
      undefined,
      ctx.i18n.t('audit_result', { token }),
      {
        parse_mode: 'MARKDOWN',
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

    // await db.successfulCall(msg)
  } catch (e) {
    console.log(e)
  }
}