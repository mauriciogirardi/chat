import { MessageType } from './message'
import { UserType } from './user'

export type ChatType = {
  _id: string
  users: UserType[]
  createdBy: string
  isGroupChat?: boolean
  lastMessage?: MessageType
  groupName?: string
  groupProfilePicture?: string
  groupBio?: string
  groupAdmins?: UserType[]
  unreadCounts?: object
}
