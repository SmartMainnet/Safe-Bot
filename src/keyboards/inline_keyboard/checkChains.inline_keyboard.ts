import { InlineKeyboard } from 'grammy'

export const checkChainsInlineKeyboard = (chains: any, address: String) => {
  const buttonRow = chains.map((chain: any) =>
    InlineKeyboard.text(chain.name, `${chain.name} ${address}`)
  )
  return InlineKeyboard.from([buttonRow])
}