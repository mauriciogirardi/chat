import { format } from 'date-fns'
import { Pen, X } from 'lucide-react'
import Link from 'next/link'
import { ReactNode, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import * as D from '@/components/ui/drawer'
import { useAppSelector } from '@/redux'

type RecipientInfoProps = {
  children: ReactNode
}

export function RecipientInfo({ children }: RecipientInfoProps) {
  const currentUserId = useAppSelector((state) => state.user.currentUserId)
  const selectedChat = useAppSelector((state) => state.chat.selectedChat)

  const userInfo = useMemo(() => {
    const isGroupChat = selectedChat?.isGroupChat
    let name
    let image = ''

    if (isGroupChat) {
      name = selectedChat.groupName
      image = selectedChat.groupProfilePicture || ''
    } else {
      const recipient = selectedChat?.users.find(
        (user) => user._id !== currentUserId,
      )
      name = recipient?.name
      image = recipient?.profilePicture || ''
    }

    const createdOn = selectedChat?.createdAt
      ? format(selectedChat.createdAt, "dd MMMM yyyy ',' p")
      : ''

    return {
      createdOn,
      name,
      image,
      imgPreview: name?.slice(0, 2),
      createdBy: selectedChat?.createdBy.name,
      isGroupChat,
    }
  }, [selectedChat, currentUserId])

  return (
    <D.Drawer direction="left">
      <D.DrawerTrigger asChild>{children}</D.DrawerTrigger>

      <D.DrawerContent className="h-screen w-4/5 border dark:border-r-zinc-800 md:w-96">
        <D.DrawerHeader className="px-0">
          <div className="flex items-center justify-between border-b px-6 pb-7 pt-4">
            <D.DrawerTitle className="text-muted-foreground">
              Chat Info
            </D.DrawerTitle>
            <D.DrawerClose className="cursor-pointer text-muted-foreground outline-none hover:text-muted-foreground/80 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-violet-500">
              <X />
            </D.DrawerClose>
          </div>
        </D.DrawerHeader>

        <div
          className={twMerge(
            'mt-7 flex flex-col items-center justify-center gap-4 px-6',
            'overflow-y-auto scrollbar-none',
          )}
        >
          <Avatar className="size-28">
            <AvatarImage src={userInfo.image} className="object-cover" />
            <AvatarFallback>{userInfo.imgPreview}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{userInfo.name}</span>

          <div className="mt-5 flex w-full flex-col gap-2 rounded bg-zinc-100 p-3 text-sm text-muted-foreground shadow dark:bg-zinc-900">
            <span>
              <strong>Created By:</strong> {userInfo.createdBy}
            </span>
            <span>
              <strong>Created On: </strong> {userInfo.createdOn}
            </span>
          </div>

          {userInfo.isGroupChat && (
            <div className="my-6 flex w-full flex-col justify-start gap-4">
              <div className="flex items-center justify-between border-b pb-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {selectedChat?.users.length} Members
                </p>
                <Button type="button" variant="secondary" size="xs" asChild>
                  <Link href={`/groups/edit-group/${selectedChat?._id}`}>
                    <Pen className="mr-1 size-3" />
                    Edit group
                  </Link>
                </Button>
              </div>
              {selectedChat?.users.map((user) => (
                <div key={user._id} className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src={user.profilePicture}
                      className="object-cover"
                    />
                  </Avatar>
                  <span className="text-sm">{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </D.DrawerContent>
    </D.Drawer>
  )
}
