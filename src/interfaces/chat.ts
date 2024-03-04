import { MessageType } from './message'
import { UserType } from './user'

export type ChatType = {
  _id: string
  users: UserType[]
  createdBy: UserType
  isGroupChat?: boolean
  lastMessage?: MessageType
  groupName?: string
  groupProfilePicture?: string
  groupBio?: string
  groupAdmins?: UserType[]
  createdAt: string
  updatedAt: string
  unreadCounts?: {
    [key: string]: number
  }
}
