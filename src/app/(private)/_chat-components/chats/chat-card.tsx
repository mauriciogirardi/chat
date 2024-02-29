import { formatDistanceToNow } from 'date-fns'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatType } from '@/interfaces/chat'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setSelectedChat } from '@/redux/slices/chat-slice'

type ChatCardProps = {
  chat: ChatType
  onOpenChats?: (open: boolean) => void
}

export function ChatCard({ chat, onOpenChats }: ChatCardProps) {
  const currentUserId = useAppSelector((state) => state.user.currentUserId)
  const selectedChatId = useAppSelector((state) => state.chat.selectedChat?._id)
  const dispatch = useAppDispatch()

  const isSelectedCard = chat._id === selectedChatId

  const chatDetails = useMemo(() => {
    let name
    let image
    let lastMessage
    let lastMessageSenderName
    let lastMessageTime = ''

    if (chat.isGroupChat) {
      name = chat.groupName || ''
      image = chat.groupProfilePicture || ''
    } else {
      const recipient = chat.users.find((user) => user._id !== currentUserId)
      name = recipient?.name || ''
      image = recipient?.profilePicture || ''
    }

    if (chat.lastMessage) {
      const { text, sender, createdAt } = chat.lastMessage
      const firstNameSender = sender.name.split(' ')[0]

      lastMessage = text
      lastMessageSenderName =
        sender._id === currentUserId ? 'You' : firstNameSender
      lastMessageTime = createdAt
        ? formatDistanceToNow(new Date(createdAt))
        : ''
    }

    return {
      name,
      image,
      lastMessage,
      lastMessageSenderName,
      lastMessageTime,
      fallbackImage: name.slice(0, 1),
    }
  }, [chat, currentUserId])

  const handleSelectChat = async () => {
    dispatch(setSelectedChat(chat))
    onOpenChats?.(false)
  }

  const unreadCounts = () => {
    if (
      !currentUserId ||
      !chat?.unreadCounts ||
      !chat?.unreadCounts[currentUserId]
    ) {
      return null
    }

    return (
      <span className="absolute left-12 top-3 rounded-full bg-lime-500 px-2 py-[2px] text-xs font-bold text-zinc-900">
        {chat.unreadCounts[currentUserId]}
      </span>
    )
  }

  return (
    <button
      type="button"
      className={twMerge(
        'relative flex w-full items-center gap-5 rounded p-4 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800',
        isSelectedCard && 'bg-zinc-100 dark:bg-zinc-800',
      )}
      onClick={handleSelectChat}
    >
      <Avatar className="size-12">
        <AvatarImage src={chatDetails.image} className="object-cover" />
        <AvatarFallback className="uppercase">
          {chatDetails.fallbackImage}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm font-medium">{chatDetails.name}</span>
        {chatDetails.lastMessageSenderName && chatDetails.lastMessageTime && (
          <span className="w-[150px] truncate text-left text-xs text-muted-foreground">
            <strong className="font-medium">
              {chatDetails.lastMessageSenderName}:{' '}
            </strong>
            {chatDetails.lastMessage}
          </span>
        )}
      </div>

      <p className="ml-auto text-right text-xs text-muted-foreground">
        {chatDetails.lastMessageTime}
      </p>

      {unreadCounts()}
    </button>
  )
}
