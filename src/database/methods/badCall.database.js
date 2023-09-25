import users from '../connect/db.connect.js'

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