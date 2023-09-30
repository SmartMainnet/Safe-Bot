export const checkChainsInlineKeyboard = (chains, address) => {
  return JSON.stringify({
    inline_keyboard: chains.map(chain => [
      {
        text: chain.name,
        callback_data: `${chain.name} ${address}`
      }
    ])
  })
}