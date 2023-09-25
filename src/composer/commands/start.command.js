import { Composer } from 'telegraf'

const composer = new Composer()

export const startCommand = composer.command('start', async ctx => {
  try {
    await ctx.reply(ctx.i18n.t('welcome', { ctx }))

    await ctx.reply(
      ctx.i18n.t('info'),
      { disable_web_page_preview: true }
    )

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