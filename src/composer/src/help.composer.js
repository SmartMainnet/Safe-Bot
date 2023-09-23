import { Composer } from 'telegraf'

const composer = new Composer()

export default composer.command('help', async ctx => {
  try {
    await ctx.replyWithPhoto(
      { source: 'src/img/Example.png' },
      { caption: (
          'Enter the contract address in the BSC network to check it\n' +
          'Example: \`0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984\`'
        ),
        parse_mode: 'MARKDOWN'
      }
    )
  } catch (e) {
    console.log(e)
  }
})