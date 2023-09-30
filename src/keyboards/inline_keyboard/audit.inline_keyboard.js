export const auditInlineKeyboard = (chain, address) => {
  return JSON.stringify({
    inline_keyboard: [
      [
        {
          text: 'Audit',
          url: `https://gopluslabs.io/token-security/${chain.id}/${address}`
        },
        {
          text: 'Contract',
          url: `${chain.scan}${address}`
        }
      ],
      [
        {
          text: 'Buy',
          url: `https://app.1inch.io/#/${chain.id}/simple/swap/${chain.coin}/${address}`
        },
        {
          text: 'Chart',
          url: `https://${chain.name === 'BSC' ? 'poocoin.app/tokens' : 'coingecko.com/en/coins'}/${address}`
        }
      ],
    ]
  })
}