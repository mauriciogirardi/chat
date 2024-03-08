'use server'

import { api } from '@/data/api'

type GetAllChatsProps = {
  chatId: string
  userId: string
}

export async function readAllMessages({ chatId, userId }: GetAllChatsProps) {
  try {
    const data = { chatId, userId }

    await api(`/messages/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error(error)
  }
}
