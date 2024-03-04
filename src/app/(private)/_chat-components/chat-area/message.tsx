import { format, formatDistanceToNowStrict } from 'date-fns'
import { useMemo } from 'react'

import { MessageType } from '@/interfaces/message'
import { useAppSelector } from '@/redux'

import { CardMessage } from './card-message'

type MessageProps = {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  const currentUserData = useAppSelector((state) => state.user.currentUserData)
  const selectedChat = useAppSelector((state) => state.chat.selectedChat)

  const isLoggedInUserMessage = message.sender?._id === currentUserData?._id
  const fallbackNameImage = message.sender.name.slice(0, 2)

  const createdAtMessage = useMemo(() => {
    const timeChatCreatedAt = format(new Date(message.createdAt), " 'at' p")
    return (
      formatDistanceToNowStrict(new Date(message.createdAt), {
        addSuffix: true,
      }) + timeChatCreatedAt
    )
  }, [message.createdAt])

  let read = false
  if (selectedChat && selectedChat.users.length - 1 === message.readBy.length) {
    read = true
  }

  if (isLoggedInUserMessage) {
    return (
      <CardMessage
        isLoggedIn
        name={message.sender.name}
        image={message.image}
        text={message.text}
        createdAt={createdAtMessage}
        read={read}
        profilePicture={message.sender.profilePicture}
        fallbackNameImage={fallbackNameImage}
      />
    )
  }

  return (
    <CardMessage
      name={message.sender.name}
      image={message.image}
      text={message.text}
      createdAt={createdAtMessage}
      profilePicture={message.sender.profilePicture}
      fallbackNameImage={fallbackNameImage}
    />
  )
}
