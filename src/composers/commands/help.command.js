import Composer from 'telegraf'

const composer = new Composer()

export const helpCommand = composer.command('help', async ctx => {
  try {
    await ctx.replyWithPhoto(
      { source: 'src/img/Example.png' },
      {
        caption: ctx.i18n.t('help'),
        parse_mode: 'MARKDOWN'
      }
    )
  } catch (e) {
    console.log(e)
  }
})