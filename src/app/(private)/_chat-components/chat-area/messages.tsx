'use client'

import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { getChatMessages } from '@/api/get-chat-messages'
import { readAllMessages } from '@/api/read-all-messages'
import { socket } from '@/config/socket-config'
import { MessageType } from '@/interfaces/message'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setChats } from '@/redux/slices/chat-slice'

import { Message } from './message'

export function Messages() {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [loading, setLoading] = useState(false)
  const { selectedChat, chats } = useAppSelector((state) => state.chat)
  const { currentUserData } = useAppSelector((state) => state.user)

  const dispatch = useAppDispatch()
  const messageDivRef = useRef<HTMLDivElement>(null)

  const getMessages = async () => {
    if (!selectedChat) return null

    try {
      setLoading(true)
      const response = await getChatMessages({ chatId: selectedChat._id })
      response && setMessages(response)
    } catch (error) {
      toast.error('Error loading messages!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat])

  const handleNewMessageReceivedEvent = useCallback(
    (message: MessageType) => {
      if (selectedChat?._id === message.chat._id) {
        setMessages((prev) => {
          const isMessageAlreadyExists = prev.find(
            (msg) => msg.socketMessageId === message.socketMessageId,
          )
          if (isMessageAlreadyExists) return prev
          else return [...prev, message]
        })
      }
    },
    [selectedChat?._id],
  )

  const handleUserReadAllChatMessagesEvent = useCallback(
    ({ chatId, readByUserId }: { chatId: string; readByUserId: string }) => {
      if (selectedChat?._id === chatId) {
        setMessages((prev) => {
          const newMessages = prev.map((msg) => {
            if (
              msg.sender._id !== readByUserId &&
              !msg.readBy.includes(readByUserId)
            ) {
              return { ...msg, readBy: [...msg.readBy, readByUserId] }
            }
            return msg
          })

          return newMessages
        })
      }
    },
    [selectedChat?._id],
  )

  useEffect(() => {
    // listen for new messages
    socket.on('new-message-received', handleNewMessageReceivedEvent)
    // listen for user-read-all-chat-messages event
    socket.on('user-read-all-chat-messages', handleUserReadAllChatMessagesEvent)

    return () => {
      socket.off('new-message-received', handleNewMessageReceivedEvent)
      socket.off(
        'user-read-all-chat-messages',
        handleUserReadAllChatMessagesEvent,
      )
    }
  }, [handleNewMessageReceivedEvent, handleUserReadAllChatMessagesEvent])

  const handleReadAllMessages = useCallback(
    async (userId: string, chatId: string) => {
      try {
        await readAllMessages({
          userId,
          chatId,
        })
      } catch {
        toast.error('Error read all messages')
      }
    },
    [],
  )

  useEffect(() => {
    if (!currentUserData || !selectedChat) return undefined
    // scroll to top when new message arrives
    if (messageDivRef.current) {
      messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight + 100
    }

    // clear unread messages

    let unreadMessages = 0
    const chat = chats.find((chat) => chat._id === selectedChat?._id)
    if (chat && chat.unreadCounts) {
      unreadMessages = chat?.unreadCounts[currentUserData._id] || 0
    }

    if (unreadMessages > 0) {
      handleReadAllMessages(currentUserData._id, selectedChat._id)

      socket.emit('read-all-messages', {
        chatId: selectedChat._id,
        readByUserId: currentUserData._id,
        users: selectedChat?.users
          .filter((user) => user._id !== currentUserData._id)
          .map((user) => user._id),
      })
    }

    // set the unread messages to 0 for the selected chat
    const newChats = chats.map((chat) => {
      if (chat._id === selectedChat?._id) {
        const chatData = { ...chat }
        chatData.unreadCounts = { ...chat.unreadCounts }
        chatData.unreadCounts[currentUserData._id] = 0
        return chatData
      } else return chat
    })

    dispatch(setChats(newChats))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, dispatch])

  if (loading) {
    return (
      <div className="my-8 flex-1">
        <div className="flex h-full items-center justify-center">
          <Loader2 className="size-12 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div
      ref={messageDivRef}
      className="my-8 h-[calc(100%_-_5rem)] flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent"
    >
      {messages.map((message) => {
        return <Message key={message.socketMessageId} message={message} />
      })}
    </div>
  )
}
