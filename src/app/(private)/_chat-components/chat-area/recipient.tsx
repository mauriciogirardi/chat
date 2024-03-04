import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { socket } from '@/config/socket-config'
import { ChatType } from '@/interfaces/chat'
import { useAppSelector } from '@/redux'

import { RecipientInfo } from './recipient-info'

export function Recipient() {
  const selectedChat = useAppSelector((state) => state.chat.selectedChat)
  const currentUserId = useAppSelector((state) => state.user.currentUserId)

  const [typing, setTyping] = useState(false)
  const [senderName, setSenderName] = useState('')

  useEffect(() => {
    socket.on(
      'typing',
      ({ chat, senderName }: { chat: ChatType; senderName: string }) => {
        if (selectedChat?._id === chat?._id) {
          setTyping(true)

          if (chat.isGroupChat) {
            setSenderName(senderName)
          }
        }

        setTimeout(() => setTyping(false), 1000)
      },
    )

    return () => {
      socket.off('typing')
    }
  }, [selectedChat])

  let name = ''
  let image = ''

  if (!selectedChat) return null
  if (selectedChat.isGroupChat) {
    name = selectedChat.groupName || ''
    image = selectedChat.groupProfilePicture || ''
  } else {
    const recipient = selectedChat.users.find(
      (user) => user._id !== currentUserId,
    )
    name = recipient?.name || ''
    image = recipient?.profilePicture || ''
  }

  const typingAnimation = () => {
    if (typing)
      return (
        <span className="text-xs font-semibold text-green-700">
          {selectedChat?.isGroupChat && `${senderName} Is `}
          Typing...
        </span>
      )
  }

  return (
    <RecipientInfo>
      <Button
        variant="link"
        className="z-10 flex w-min items-center gap-3"
        type="button"
      >
        <ChevronLeft className="size-5 text-muted-foreground" />
        <Avatar className="size-10 2xl:size-12">
          <AvatarImage src={image} className="object-cover" />
        </Avatar>
        <div className="flex flex-col items-start">
          <span className="text-sm 2xl:text-lg">{name}</span>
          {typingAnimation()}
        </div>
      </Button>
    </RecipientInfo>
  )
}
