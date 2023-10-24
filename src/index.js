import 'dotenv/config'
import { Bot } from 'grammy'

import {
  checkChains,
  checkMember,
  i18nMiddleware,
  limitMiddleware
} from './middlewares/index.js'
import {
  startCommand,
  infoCommand,
  helpCommand,
  addressMessage,
  textMessage,
  buttonCallback
} from './composers/index.js'
import './database/connect/db.connect.js'

const { BOT_TOKEN } = process.env

const bot = new Bot(BOT_TOKEN)

bot.use(i18nMiddleware)
bot.use(limitMiddleware)

bot.command('start', startCommand)
bot.command('info', infoCommand)
bot.command('help', helpCommand)

bot.hears(/^(0x)?[0-9a-f]{40}$/i, checkMember, checkChains, addressMessage)
bot.hears(/.*/, textMessage)

bot.on("callback_query:data", buttonCallback)

bot.start()