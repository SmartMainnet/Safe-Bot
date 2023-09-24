import Web3 from 'web3'

const web3 = new Web3()

export const checkAddress = async (ctx, next) => {
  try {
    const isAddress = web3.utils.isAddress(ctx.update.message.text)

    if (isAddress) {
      next()
    } else {
      ctx.reply('⚠️ Only contract addresses!')
    }
  } catch (e) {
    console.log(e)
  }
}