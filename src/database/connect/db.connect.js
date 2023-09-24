import 'dotenv/config'
import { MongoClient } from 'mongodb'

const { MONGODB_URI } = process.env

const client = new MongoClient(MONGODB_URI)

client.connect()

const db = client.db('safe-bot')
const users = db.collection('users')

export default users