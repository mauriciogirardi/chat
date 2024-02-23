import { ChatType } from './chat'
import { UserType } from './user'

export type MessageType = {
  _id: string
  chat: ChatType
  sender: UserType
  readBy: UserType[]
  text: string
  image: string
}
