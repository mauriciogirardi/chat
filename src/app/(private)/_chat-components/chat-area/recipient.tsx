import { ChevronLeft } from 'lucide-react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/redux'

import { RecipientInfo } from './recipient-info'

export function Recipient() {
  const selectedChat = useAppSelector((state) => state.chat.selectedChat)
  const currentUserId = useAppSelector((state) => state.user.currentUserId)

  let chatName
  let chatImage = ''

  if (!selectedChat) return null
  if (selectedChat.isGroupChat) {
    chatName = selectedChat.groupName || ''
    chatImage = selectedChat.groupProfilePicture || ''
  } else {
    const recipient = selectedChat.users.find(
      (user) => user._id !== currentUserId,
    )
    chatName = recipient?.name || ''
    chatImage = recipient?.profilePicture || ''
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
          <AvatarImage src={chatImage} className="object-cover" />
        </Avatar>
        <span className="text-sm 2xl:text-lg">{chatName}</span>
      </Button>
    </RecipientInfo>
  )
}
