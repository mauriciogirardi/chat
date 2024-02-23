'use client'

import { ChatHeader } from './chat-header'
import { ChatList } from './chat-list'

export function Chats() {
  return (
    <div className="h-full w-full max-w-[400px] border-r border-r-zinc-200 dark:border-r-zinc-900 py-6">
      <ChatHeader />
      <ChatList />
    </div>
  )
}
