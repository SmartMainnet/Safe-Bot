export const start = msg => {
  return (
    `👋🏻 Hello ${msg.from.first_name}${(msg.from.last_name === undefined) ? '' : ` ${msg.from.last_name}`}!\n` +
    '🤖 Welcome to SAFE Bot\n' +
    '🧑🏻‍💻 Author: @SmartMainnet'
  )
}

export const help = (
  'Enter the contract address in the BSC network to check it\n' +
  'Example: \`0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984\`'
)

export const info = (
  '🔒 Trust Level - Likelihood and impact of the risk\n' +
  '⚔️ Trust Score is used to measure the liquidity of trading pairs on cryptocurrency exchanges, as well as to measure overall liquidity and scale of transactions\n' +
  '✅ We use security audit platforms (https://gopluslabs.io, https://hashdit.io, https://blocksec.com)'
)