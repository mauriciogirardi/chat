'use client'

import { Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import * as D from '@/components/ui/drawer'

import { ChatHeader } from './chat-header'
import { ChatList } from './chat-list'

export function Chats() {
  return (
    <div className=" h-full w-full max-w-[400px] py-6 dark:border-r-zinc-800 lg:border-r lg:border-r-zinc-200">
      <div className="hidden lg:block">
        <ChatHeader />
        <ChatList />
      </div>

      <div className="lg:hidden">
        <D.Drawer direction="left">
          <D.DrawerTrigger asChild>
            <Button variant="ghost" type="button" size="icon">
              <Menu className="size-8 text-muted-foreground" />
            </Button>
          </D.DrawerTrigger>

          <D.DrawerContent className="h-screen w-full border pl-6 dark:border-r-zinc-800">
            <D.DrawerHeader className="mt-8">
              <D.DrawerClose className="absolute right-5 top-5 cursor-pointer text-muted-foreground outline-none hover:text-muted-foreground/80 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-violet-500">
                <X />
              </D.DrawerClose>
            </D.DrawerHeader>

            <ChatHeader />
            <ChatList />
          </D.DrawerContent>
        </D.Drawer>
      </div>
    </div>
  )
}
