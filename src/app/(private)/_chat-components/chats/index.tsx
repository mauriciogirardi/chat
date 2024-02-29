'use client'

import { MessageSquareText, X } from 'lucide-react'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'
import * as D from '@/components/ui/drawer'

import { ChatHeader } from './chat-header'
import { ChatList } from './chat-list'

export function Chats() {
  const [openChats, setChats] = useState(false)

  const handleOpenChangeChats = useCallback(
    (open: boolean) => setChats(open),
    [],
  )

  return (
    <div className="h-full dark:border-r-zinc-800 lg:w-full lg:max-w-[400px] lg:border-r lg:border-r-zinc-200 lg:py-6">
      <div className="hidden lg:block">
        <ChatHeader />
        <ChatList />
      </div>

      <div className="absolute right-6 top-[95px] z-20 lg:hidden">
        <D.Drawer
          direction="left"
          onOpenChange={handleOpenChangeChats}
          open={openChats}
        >
          <D.DrawerTrigger asChild>
            <Button
              variant="secondary"
              type="button"
              size="icon"
              className="rounded-full"
            >
              <MessageSquareText className="size-6" />
            </Button>
          </D.DrawerTrigger>

          <D.DrawerContent className="h-screen w-full border pl-6 dark:border-r-zinc-800">
            <D.DrawerHeader className="mt-8">
              <D.DrawerClose className="absolute right-5 top-5 cursor-pointer text-muted-foreground outline-none hover:text-muted-foreground/80 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-violet-500">
                <X />
              </D.DrawerClose>
            </D.DrawerHeader>

            <ChatHeader />
            <ChatList onOpenChats={handleOpenChangeChats} />
          </D.DrawerContent>
        </D.Drawer>
      </div>
    </div>
  )
}
