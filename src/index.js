import 'dotenv/config'
import { Bot } from 'grammy'

import { i18nMiddleware, limitMiddleware } from './middlewares/plugins/index.js'
import { checkChains, checkMember } from './middlewares/checks/index.js'
import { helpCommand, infoCommand, startCommand } from './composers/commands/index.js'
import { addressMessage, textMessage } from './composers/messages/index.js'
import { buttonCallback } from './composers/callbacks/index.js'
import './database/connect/db.connect.js'

const { BOT_TOKEN } = process.env

const bot = new Bot(BOT_TOKEN)

// plugins
bot.use(i18nMiddleware)
bot.use(limitMiddleware)

// commands
bot.command('start', startCommand)
bot.command('info', infoCommand)
bot.command('help', helpCommand)

// messages
bot.hears(/^(0x)?[0-9a-f]{40}$/i, checkMember, checkChains, addressMessage)
bot.hears(/.*/, textMessage)

// callbacks
bot.on("callback_query:data", buttonCallback)

bot.start()