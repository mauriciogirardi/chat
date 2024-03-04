import { ChatType } from './chat'
import { UserType } from './user'

export type MessageType = {
  _id: string
  socketMessageId: string
  chat: ChatType
  sender: UserType
  readBy: string[]
  text: string
  image: string
  createdAt: string
  updatedAt: string
}
