import { MessageType } from './message'
import { UserType } from './user'

export type ChatType = {
  _id: string
  users: UserType[]
  createdBy: UserType
  lastMessage: MessageType
  isGroupChat: boolean
  groupName: string
  groupProfilePicture: string
  groupBio: string
  groupAdmins: UserType[]
  unreadCounts: object
}
