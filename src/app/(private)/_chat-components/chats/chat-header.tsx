'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export function ChatHeader() {
  return (
    <div className="flex flex-col gap-6 pr-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-muted-foreground">My Chats</h2>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                New Chat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="text-left">
                <DialogTitle className="text-xl text-muted-foreground">
                  Create New Chat
                </DialogTitle>
              </DialogHeader>

              <div className="my-5">
                <Input
                  placeholder="Search userId or username or email"
                  type="text"
                />
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" asChild>
            <Link href="/groups/create-group">New Group</Link>
          </Button>
        </div>
      </div>
      <Input placeholder="Search or start new chat" type="text" />
    </div>
  )
}
