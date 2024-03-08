'use server'

import { api } from '@/data/api'
import { ChatType } from '@/interfaces/chat'
import { ChatData } from '@/interfaces/chat-data'

type Response = {
  chats: ChatType[]
}
type GetAllChatsProps = {
  data: ChatData
}

export async function createNewChat({ data }: GetAllChatsProps) {
  try {
    const { chats } = await api<Response>('/chats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return chats
  } catch (error) {
    console.error(error)
  }
}
