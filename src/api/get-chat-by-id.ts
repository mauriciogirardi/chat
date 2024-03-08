'use server'

import { api } from '@/data/api'
import { ChatType } from '@/interfaces/chat'

type Response = {
  chat: ChatType
}
type GetAllChatsProps = {
  groupId: string
}

export async function getChatById({ groupId }: GetAllChatsProps) {
  try {
    const { chat } = await api<Response>(`/chats/${groupId}`)

    return chat
  } catch (error) {
    console.error(error)
  }
}
