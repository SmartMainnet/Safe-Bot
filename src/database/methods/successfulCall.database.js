import users from '../connect/db.connect.js'

export const successfulCall = async msg => {
  await users.updateOne({ id: msg.chat.id },
    {
      $set: {
        username: msg.from.username,
        first_name: msg.from.first_name,
        last_name: msg.from.last_name
      },
      $push: {
        calls: {
          call: msg.text.toLowerCase(),
          date: new Date()
        }
      }
    }
  )
}