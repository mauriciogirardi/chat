'use server'

import { api } from '@/data/api'
import { ChatType } from '@/interfaces/chat'
import { ChatData } from '@/server-actions/chats'

type Response = {
  chat: ChatType
}
type GetAllChatsProps = {
  chatId: string
  data: ChatData
}

export async function updateChat({ chatId, data }: GetAllChatsProps) {
  try {
    const { chat } = await api<Response>(`/chats/${chatId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return chat
  } catch (error) {
    console.error(error)
  }
}
