import 'dotenv/config'
import { MongoClient } from 'mongodb'

const { MONGODB_URI } = process.env

const client = new MongoClient(MONGODB_URI)

client.connect()

const db = client.db('safe-bot')
const users = db.collection('users')

export const createUser = async msg => {
  await users.findOne({ id: msg.chat.id }).then(async res => {
    if (!res) {
      await users.insertOne({
        id: msg.chat.id,
        username: msg.from.username,
        first_name: msg.from.first_name,
        last_name: msg.from.last_name,
        start_date: new Date()
      })
    }
  })
}

export const successfulCall = async msg => {
  await users.updateOne({ id: msg.chat.id },
    {
      $set: {
        username: msg.from.username,
        first_name: msg.from.first_name,
        last_name: msg.from.last_name,
        date_last_call: new Date(),
        last_call: msg.text.toLowerCase()
      },
      $inc: { number_calls: 1 },
      $push: {
        calls: {
          call: msg.text.toLowerCase(),
          date: new Date()
        }
      }
    }
  )
}

export const badCall = async msg => {
  await users.updateOne({ id: msg.chat.id },
    {
      $set: {
        username: msg.from.username,
        first_name: msg.from.first_name,
        last_name: msg.from.last_name,
        date_last_bad_call: new Date(),
        last_bad_call: msg.text
      },
      $inc: { number_bad_calls: 1 },
      $push: {
        bad_calls: {
          call: msg.text,
          date: new Date()
        }
      }
    }
  )
}