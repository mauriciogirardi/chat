'use server'

import { api } from '@/data/api'

export type SendNewMessagePayload = {
  text?: string
  image?: string
  chat: string
  sender: string
  readBy?: string[]
  socketMessageId: string
  createdAt: string
  updatedAt: string
}

type SendNewMessageProps = {
  data: SendNewMessagePayload
}

export async function sendNewMessage({ data }: SendNewMessageProps) {
  try {
    await api('/messages', {
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
