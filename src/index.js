import 'dotenv/config'
import { Telegraf } from 'telegraf'
import {
  startComposer,
  helpComposer,
  messageComposer,
  callbackComposer
} from './composer/index.js'

const { BOT_TOKEN } = process.env

const bot = new Telegraf(BOT_TOKEN)

bot.use(startComposer)
bot.use(helpComposer)
bot.use(messageComposer)
bot.use(callbackComposer)

bot.launch()