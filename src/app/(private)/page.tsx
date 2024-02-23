import { LayoutApp } from '@/layouts/app'

import { ChatArea } from './_chat-components/chat-area'
import { Chats } from './_chat-components/chats'

export default async function Home() {
  return (
    <LayoutApp>
      <div className="flex h-[calc(100vh_-_4.6rem)] w-full items-start">
        <Chats />
        <ChatArea />
      </div>
    </LayoutApp>
  )
}
