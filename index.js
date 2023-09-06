import 'dotenv/config'
import TelegramApi from 'node-telegram-bot-api'
import audit from './audit.js'
import * as texts from './texts.js'
import * as db from './db.js'

const { BOT_TOKEN, GROUP } = process.env

const bot = new TelegramApi(BOT_TOKEN, { polling: true })

bot.setMyCommands([
  { command: '/info', description: 'Returns Trust Level and Trust Score explanation' },
  { command: '/help', description: 'Returns Bot Commands' },
])

bot.on('message', async msg => {
  try {
    const text = msg.text.toLowerCase()
    const chatId = msg.chat.id
    const msgId = msg.message_id
    const isGroup = chatId < 0

    let isJoined = true
    if (GROUP) {
      const join = await bot.getChatMember(GROUP, chatId)
      isJoined = join.status !== 'left'
    }

    if (text) {
      if (text === '/start' && !isGroup) {
        await bot.sendMessage(chatId, texts.start(msg))
        await bot.sendMessage(chatId, texts.info, {
          disable_web_page_preview: true
        })
        await bot.sendPhoto(chatId, './img/Example.png', {
          caption: texts.help,
          parse_mode: 'MARKDOWN'
        })

        if (!isJoined) {
          await bot.sendMessage(chatId,
            `To use the Bot, you must be a Member from [Smart Bots](https://t.me/${GROUP})`,
            { parse_mode: 'MARKDOWN' }
          )
        }

        await db.createUser(msg)
      } else if (text === '/info' && !isGroup) {
        await bot.sendMessage(chatId, texts.info, {
          reply_to_message_id: msgId,
          disable_web_page_preview: true
        })
      } else if (text === '/help' && !isGroup) {
        await bot.sendPhoto(chatId, './img/Example.png', {
          caption: texts.help,
          parse_mode: 'MARKDOWN',
          reply_to_message_id: msgId
        })
      } else if (!isJoined) {
        await bot.sendMessage(chatId,
          `To use the Bot, you must be a Member from [Smart Bots](https://t.me/${GROUP})`,
          { parse_mode: 'MARKDOWN' }
        )
      } else if (!isGroup) {
        await audit(bot, msg)
      }
    }
  } catch (err) {
    console.log(err)
  }
})