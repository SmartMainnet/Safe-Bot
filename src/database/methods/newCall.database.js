import { User } from '../models/user.js'

export const newCall = async (id, address, successful) => {
  User.findOneAndUpdate(
    { id },
    {
      $push: {
        calls: {
          successful,
          call: address
        }
      }
    }
  )
  .then(res => console.log(res))
  .catch(e => console.log(e))
}