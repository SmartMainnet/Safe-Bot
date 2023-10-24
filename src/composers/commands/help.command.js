import { InputFile } from 'grammy'

export const helpCommand = async ctx => {
  try {
    await ctx.replyWithPhoto(
      new InputFile('./src/img/Example.png'),
      {
        caption: ctx.t('help'),
        parse_mode: 'MARKDOWN'
      }
    )
  } catch (e) {
    console.log(e)
  }
}