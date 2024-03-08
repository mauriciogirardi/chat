'use server'

import { api } from '@/data/api'
import { MessageType } from '@/interfaces/message'

type GetAllChatsProps = {
  chatId: string
}

type Response = {
  messages: MessageType[]
}

export async function getChatMessages({ chatId }: GetAllChatsProps) {
  try {
    const { messages } = await api<Response>(`/messages/${chatId}`)
    return messages
  } catch (error) {
    console.error(error)
  }
}
