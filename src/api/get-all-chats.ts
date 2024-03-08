'use server'

import { api } from '@/data/api'
import { ChatType } from '@/interfaces/chat'

type Response = {
  chats: ChatType[]
}
type GetAllChatsProps = {
  userId: string
}

export async function getAllChats({ userId }: GetAllChatsProps) {
  try {
    const { chats } = await api<Response>(`/chats/user/${userId}`)

    return chats
  } catch (error) {
    console.error(error)
  }
}
