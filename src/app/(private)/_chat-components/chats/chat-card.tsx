import { twMerge } from 'tailwind-merge'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatType } from '@/interfaces/chat'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setSelectedChat } from '@/redux/slices/chat-slice'

type ChatCardProps = {
  chat: ChatType
}

export function ChatCard({ chat }: ChatCardProps) {
  const currentUserId = useAppSelector((state) => state.user.currentUserId)
  const selectedChatId = useAppSelector((state) => state.chat.selectedChat?._id)
  const dispatch = useAppDispatch()

  let chatName = ''
  let chatImage = ''
  // const chatMessage = ''
  // const lastMessageSenderName = ''
  const lastMessageTime = ''

  if (chat.isGroupChat) {
    chatName = chat.groupName || ''
    chatImage = chat.groupProfilePicture || ''
  } else {
    const recipient = chat.users.find((user) => user._id !== currentUserId)
    chatName = recipient?.name || ''
    chatImage = recipient?.profilePicture || ''
  }

  return (
    <button
      type="button"
      className={twMerge(
        'flex w-full items-center gap-5 rounded p-4 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800',
        chat._id === selectedChatId && 'bg-zinc-100 dark:bg-zinc-800',
      )}
      onClick={() => dispatch(setSelectedChat(chat))}
    >
      <Avatar className="size-12">
        <AvatarImage src={chatImage} />
        <AvatarFallback className="uppercase">
          {chatName.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm font-medium">{chatName}</span>
        {/* <span className="text-xs text-muted-foreground">{`${user.username}: Super`}</span> */}
      </div>

      <p className="ml-auto text-sm font-medium text-muted-foreground">
        {lastMessageTime}
      </p>
    </button>
  )
}
