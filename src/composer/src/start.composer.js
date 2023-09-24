import { Composer } from 'telegraf'

const composer = new Composer()

export const startComposer = composer.command('start', async ctx => {
  try {
    const msg = ctx.update.message

    await ctx.reply(
      `👋🏻 Hello ${msg.from.first_name}${(msg.from.last_name === undefined) ? '' : ` ${msg.from.last_name}`}!\n` +
      `🤖 Welcome to ${ctx.botInfo.first_name}\n` +
      '🧑🏻‍💻 Author: @SmartMainnet'
    )

    await ctx.reply(
      '✅ We use security audit platforms (https://gopluslabs.io)',
      { disable_web_page_preview: true }
    )

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