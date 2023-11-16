import { UserModel } from '../models/index.ts'

export const newCall = async (id: number, address: string) => {
  UserModel.findOneAndUpdate(
    { id },
    {
      $push: {
        calls: {
          call: address
        }
      }
    }
  ).catch(e => console.log(e))
}