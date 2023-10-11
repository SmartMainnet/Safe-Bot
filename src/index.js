import 'dotenv/config'
import Telegraf from 'telegraf'

import {
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

const bot = new Telegraf(BOT_TOKEN)

bot.use(i18nMiddleware)
bot.use(limitMiddleware)

bot.use(startCommand)
bot.use(infoCommand)
bot.use(helpCommand)
bot.use(addressMessage)
bot.use(textMessage)
bot.use(buttonCallback)

bot.launch()