import { format, formatDistanceToNow } from 'date-fns'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageType } from '@/interfaces/message'
import { useAppSelector } from '@/redux'

type MessageProps = {
  message: MessageType
}

export function Message({ message }: MessageProps) {
  // const selectedChat = useAppSelector((state) => state.chat.selectedChat)
  const currentUserData = useAppSelector((state) => state.user.currentUserData)

  const isLoggedInUserMessage = message.sender?._id === currentUserData?._id
  const fallbackNameImage = message.sender.name.slice(0, 2)

  const timeChatCreatedAt = format(
    new Date(message.sender.createdAt),
    " 'at' p",
  )
  const createdAtMessage =
    formatDistanceToNow(new Date(message.sender.createdAt), {
      addSuffix: true,
    }) + timeChatCreatedAt

  if (isLoggedInUserMessage) {
    return (
      <div className="mt-4 flex justify-end">
        <div className="flex gap-2">
          <div className="flex flex-col items-end">
            <div className="max-w-[300px] rounded-xl rounded-br-none border border-zinc-400 bg-zinc-300 px-4 py-3 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 lg:max-w-[400px]">
              <span className="block pb-1 text-xs font-bold text-violet-500 dark:text-violet-400">
                {message.sender.name}
              </span>
              <span className="text-pretty text-sm font-medium">
                {message.text}
              </span>
            </div>
            {message.createdAt && (
              <span className="pt-1 text-right text-xs text-muted-foreground">
                {createdAtMessage}
              </span>
            )}
          </div>

          <Avatar className="size-8">
            <AvatarImage src={message.sender.profilePicture} />
            <AvatarFallback>{fallbackNameImage}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 flex justify-start">
      <div className="flex gap-2">
        <Avatar className="size-8">
          <AvatarImage src={message.sender.profilePicture} />
          <AvatarFallback>{fallbackNameImage}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <div className="max-w-[300px] rounded-xl rounded-bl-none border border-zinc-300 bg-zinc-100 px-4 py-3 shadow-lg dark:border-zinc-500 dark:bg-zinc-600 lg:max-w-[400px]">
            <span className="block pb-1 text-xs font-bold text-blue-600 dark:text-blue-400">
              {message.sender.name}
            </span>
            <span className="text-pretty text-sm font-medium">
              {message.text}
            </span>
          </div>

          {message.createdAt && (
            <span className="pt-1 text-xs text-muted-foreground">
              {createdAtMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
