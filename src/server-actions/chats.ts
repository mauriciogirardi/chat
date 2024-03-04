'use server'

import { ChatType } from '@/interfaces/chat'
import { MessageType } from '@/interfaces/message'

import ChatModel from '../models/chat-model'

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

export const CreateNewChat = async (data: ChatData): Promise<ChatType[]> => {
  try {
    await ChatModel.create(data)
    const newChats = await ChatModel.find({
      users: {
        $in: [data.createdBy],
      },
    })
      .populate('users')
      .sort({ updatedAt: -1 })
    return JSON.parse(JSON.stringify(newChats))
  } catch (error) {
    throw error
  }
}

export const GetAllChats = async (userId: string): Promise<ChatType[]> => {
  try {
    const usersChat = await ChatModel.find({
      users: {
        $in: [userId],
      },
    })
      .populate('users')
      .populate('lastMessage')
      .populate('createdBy')
      .populate({ path: 'lastMessage', populate: { path: 'sender' } })
      .sort({ lastMessageAt: -1 })
    return JSON.parse(JSON.stringify(usersChat))
  } catch (error) {
    throw error
  }
}

export const GetChatDataById = async (chatId: string): Promise<ChatType> => {
  try {
    const usersChat = await ChatModel.findById(chatId)
      .populate('users')
      .populate('lastMessage')
      .populate('createdBy')
      .populate({ path: 'lastMessage', populate: { path: 'sender' } })
      .sort({ updatedAt: -1 })
    return JSON.parse(JSON.stringify(usersChat))
  } catch (error) {
    throw error
  }
}

export const UpdateChat = async (
  chatId: string,
  chat: ChatData,
): Promise<void> => {
  try {
    await ChatModel.findByIdAndUpdate(chatId, chat)
  } catch (error) {
    throw error
  }
}
