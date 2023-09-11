import 'dotenv/config'
import TelegramApi from 'node-telegram-bot-api'
import {
  botStart,
  botSetCommands,
  botButtonCallback
} from './bot/index.js'

const { BOT_TOKEN } = process.env

const bot = new TelegramApi(BOT_TOKEN, { polling: true })

botStart(bot)

botSetCommands(bot)

botButtonCallback(bot)