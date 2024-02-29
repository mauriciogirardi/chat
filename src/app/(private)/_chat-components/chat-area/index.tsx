'use client'

import { MessagingLogo } from '@/components/messaging-log'
import { useAppSelector } from '@/redux'

import { Messages } from './messages'
import { NewMessage } from './new-message'
import { Recipient } from './recipient'

export function ChatArea() {
  const selectedChat = useAppSelector((state) => state.chat.selectedChat)

  if (!selectedChat) {
    return (
      <div className="-mt-20 flex h-full w-full items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center">
          <MessagingLogo className="w-1/2" />
          <p className="text-center font-medium text-muted-foreground">
            Select a chat to start messaging...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex-1 py-5 lg:pl-4">
      <div className="flex h-full flex-col justify-between">
        <Recipient />
        <Messages />
        <NewMessage />
      </div>
    </div>
  )
}
