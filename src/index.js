import 'dotenv/config'
import { Telegraf } from 'telegraf'
import { i18n } from './utils/locale.js'
import {
  startComposer,
  infoComposer,
  helpComposer,
  messageComposer,
  callbackComposer
} from './composer/index.js'

const { BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN)

bot.use(i18n.middleware())
bot.use(startComposer)
bot.use(infoComposer)
bot.use(helpComposer)
bot.use(messageComposer)
bot.use(callbackComposer)

bot.launch()