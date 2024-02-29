'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { MessageType } from '@/interfaces/message'
import { useAppSelector } from '@/redux'
import { GetChatMessages } from '@/server-actions/messages'

import { Message } from './message'

export function Messages() {
  const selectedChat = useAppSelector((state) => state.chat.selectedChat)

  const [messages, setMessages] = useState<MessageType[]>([])
  const [isLoadingMessage, setIsLoadingMessage] = useState(false)

  const getMessages = async () => {
    try {
      if (!selectedChat) return

      setIsLoadingMessage(true)
      const response = await GetChatMessages(selectedChat._id)
      setMessages(response)
    } catch {
      toast.error('Error get messages!')
    } finally {
      setIsLoadingMessage(false)
    }
  }

  useEffect(() => {
    getMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])

  if (isLoadingMessage) {
    return (
      <div className="my-8 flex-1">
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-12 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="my-8 h-[calc(100%_-_5rem)] flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
      {messages.map((message) => (
        <Message key={message._id} message={message} />
      ))}
    </div>
  )
}
