import 'dotenv/config'
import { Telegraf } from 'telegraf'
import { limit } from './utils/rateLimit.js'
import { i18n } from './utils/locale.js'
import {
  startCommand,
  infoCommand,
  helpCommand,
  addressMessage,
  textMessage,
  buttonCallback
} from './composer/index.js'

const { BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN)

bot.use(i18n.middleware())
bot.use(limit)
bot.use(startCommand)
bot.use(infoCommand)
bot.use(helpCommand)
bot.use(addressMessage)
bot.use(textMessage)
bot.use(buttonCallback)

bot.launch()