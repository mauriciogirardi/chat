'use server'

import ChatModel from '@/models/chat-model'
import MessageModel from '@/models/message-model'

export type SendNewMessagePayload = {
  text?: string
  image?: string
  chat: string
  sender: string
}

type ReadAllMessagesPramas = {
  chatId: string
  userId: string
}

export const SendNewMessage = async (data: SendNewMessagePayload) => {
  try {
    const newMessage = new MessageModel(data)

    const existingChat = await ChatModel.findById(data.chat)
    const existingUnreadCounts = existingChat?.unreadCounts as {
      [key: string]: number
    }

    existingChat?.users.forEach((userId) => {
      const userIdInString = userId.toString()

      if (userIdInString !== data.sender) {
        existingUnreadCounts[userIdInString] =
          (existingUnreadCounts[userIdInString] || 0) + 1
      }
    })

    await newMessage.save()
    await ChatModel.findByIdAndUpdate(data.chat, {
      lastMessage: newMessage._id,
      unreadCounts: existingUnreadCounts,
    })
  } catch (error) {
    throw error
  }
}

export const GetChatMessages = async (chatId: string) => {
  try {
    const messages = await MessageModel.find({ chat: chatId })
      .populate('sender')
      .sort({ createdAt: 1 })

    return JSON.parse(JSON.stringify(messages))
  } catch (error) {
    throw error
  }
}

export const ReadAllMessages = async ({
  chatId,
  userId,
}: ReadAllMessagesPramas) => {
  try {
    await MessageModel.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        readBy: { $nin: [userId] },
      },
      { $addToSet: { readBy: userId } },
    )

    const existingChat = await ChatModel.findById(chatId)
    const existingUnreadCounts = existingChat?.unreadCounts
    const newUnreadCounts = { ...existingUnreadCounts, [userId]: 0 }

    await ChatModel.findByIdAndUpdate(chatId, {
      unreadCounts: newUnreadCounts,
    })
  } catch (error) {
    throw error
  }
}
