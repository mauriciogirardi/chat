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
  const dispatch = useAppDispatch()

  const { currentUserData, onlineUsers } = useAppSelector((state) => state.user)
  const { selectedChat } = useAppSelector((state) => state.chat)

  const infoChat = useMemo(() => {
    let name
    let image
    let lastMessage
    let lastMessageSenderName
    let lastMessageTime = ''

    if (chat.isGroupChat) {
      name = chat.groupName
      image = chat.groupProfilePicture
    } else {
      const recipient = chat.users.find(
        (user) => user._id !== currentUserData?._id,
      )
      name = recipient?.name
      image = recipient?.profilePicture
    }

    if (chat?.lastMessage) {
      lastMessage = chat?.lastMessage?.text
      lastMessageSenderName =
        chat?.lastMessage?.sender?._id === currentUserData?._id
          ? 'You :'
          : `${chat?.lastMessage?.sender?.name}: `
      lastMessageTime = chat?.lastMessage?.createdAt
        ? formatDistanceToNow(new Date(chat.lastMessage.createdAt), {
            addSuffix: true,
          })
        : ''
    }

    return {
      name,
      image,
      lastMessage,
      lastMessageSenderName,
      lastMessageTime,
      fallbackImage: name?.slice(0, 2),
    }
  }, [
    chat.groupName,
    chat.groupProfilePicture,
    chat.isGroupChat,
    chat.lastMessage,
    chat.users,
    currentUserData?._id,
  ])

  const isSelected = selectedChat?._id === chat._id

  const handleSelectChat = () => {
    dispatch(setSelectedChat(chat))
    onOpenChats?.(false)
  }

  const unreadCounts = () => {
    if (!currentUserData) return null
    if (
      !chat?.unreadCounts ||
      !chat?.unreadCounts[currentUserData._id] ||
      isSelected
    ) {
      return null
    }

    return (
      <span className="absolute left-12 top-3 rounded-full bg-lime-500 px-2 py-[2px] text-xs font-bold text-zinc-900">
        {chat.unreadCounts[currentUserData._id]}
      </span>
    )
  }

  const onlineIndicator = () => {
    if (chat.isGroupChat) return null
    const recipientId = chat.users.find(
      (user) => user._id !== currentUserData?._id,
    )?._id

    if (recipientId && onlineUsers.includes(recipientId)) {
      return <div className="h-2 w-2 rounded-full bg-lime-500" />
    }
  }

  return (
    <button
      type="button"
      className={twMerge(
        'relative flex w-full items-center gap-5 rounded p-4 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800',
        isSelected && 'bg-zinc-100 dark:bg-zinc-800',
      )}
      onClick={handleSelectChat}
      disabled={isSelected}
    >
      <Avatar className="size-12">
        <AvatarImage src={infoChat.image} className="object-cover" />
        <AvatarFallback className="uppercase">
          {infoChat.fallbackImage}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-start gap-1">
        <span className="flex items-center gap-1 text-sm font-medium">
          {infoChat.name} {onlineIndicator()}
        </span>
        {infoChat.lastMessageSenderName && (
          <span className="w-[150px] truncate text-left text-xs text-muted-foreground">
            <strong className="font-medium">
              {infoChat.lastMessageSenderName}{' '}
            </strong>
            {infoChat.lastMessage}
          </span>
        )}
      </div>

      <p className="ml-auto text-right text-xs text-muted-foreground">
        {infoChat.lastMessageTime}
      </p>

      {unreadCounts()}
    </button>
  )
}
