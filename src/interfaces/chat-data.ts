import { MessageType } from './message'

export type ChatData = {
  users: string[]
  createdBy: string
  isGroupChat?: boolean
  lastMessage?: MessageType
  groupName?: string
  groupProfilePicture?: string
  groupBio?: string
  groupAdmins?: string[]
  unreadCounts?: object
}
