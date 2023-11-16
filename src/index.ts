import 'dotenv/config'
import { Bot } from 'grammy'

import { i18nMiddleware, limitMiddleware } from './middlewares/plugins/index.ts'
import { checkChains, checkMember } from './middlewares/checks/index.ts'
import { helpCommand, infoCommand, startCommand } from './handlers/commands/index.ts'
import { addressMessage, textMessage } from './handlers/messages/index.ts'
import { buttonCallback } from './handlers/callbacks/index.ts'
import { ContextType } from './types/index.ts'
import './database/connect/db.connect.ts'

const { BOT_TOKEN } = process.env

const bot = new Bot<ContextType>(BOT_TOKEN!)

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
bot.callbackQuery(/.*/, buttonCallback)

bot.start()