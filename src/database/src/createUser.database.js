import users from '../connect/db.connect.js'

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