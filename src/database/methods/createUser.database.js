import { User } from '../models/user.js'

export const createUser = from => {
  const user = new User({
    id: from.id,
    username: from.username,
    first_name: from.first_name,
    last_name: from.last_name
  })

  user
    .save()
    .then(res => console.log(res))
    .catch(e => console.log(e))
}