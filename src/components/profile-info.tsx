'use client'

import { useClerk } from '@clerk/nextjs'
import { format } from 'date-fns'
import { Loader2, LogOut, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ReactNode, useState } from 'react'
import { toast } from 'sonner'

import { socket } from '@/config/socket-config'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setSelectedChat } from '@/redux/slices/chat-slice'
import { setCurrentId, setCurrentUser } from '@/redux/slices/user-slice'

import { Button } from './ui/button'
import * as D from './ui/drawer'
import { UploadFile } from './upload-file'

type ProfileInfoProps = {
  children: ReactNode
}

export function ProfileInfo({ children }: ProfileInfoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const user = useAppSelector((state) => state.user.currentUserData)

  const router = useRouter()
  const { signOut } = useClerk()

  async function handleSignOut() {
    try {
      setIsLoading(true)
      socket.emit('logout', user?._id)
      await signOut()

      dispatch(setSelectedChat(null))
      dispatch(setCurrentUser(null))
      dispatch(setCurrentId(''))

      toast.success('logged out successfully!')
      router.push('/sign-in')
    } catch {
      toast.error(
        'There was an error logging out of the application, try again!',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <D.Drawer direction="left">
      <D.DrawerTrigger asChild className="cursor-pointer">
        {children}
      </D.DrawerTrigger>

      <D.DrawerContent className="h-screen w-full border dark:border-r-zinc-800 md:w-96">
        <D.DrawerHeader className="mt-8">
          <D.DrawerClose className="absolute right-5 top-5 cursor-pointer text-muted-foreground outline-none hover:text-muted-foreground/80 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-violet-500">
            <X />
          </D.DrawerClose>
          <h3 className="border-b border-zinc-200 pb-2 text-left text-2xl font-medium text-muted-foreground dark:border-zinc-800">
            Profile
          </h3>
        </D.DrawerHeader>

        <div className="mt-6 px-6">
          <UploadFile />

          <div className="my-6 h-px w-full bg-zinc-200 dark:bg-zinc-800 2xl:my-10" />

          <div className=" space-y-5">
            <Label label="Your Name" value={user?.name} />
            <Label label="Your Username" value={user?.username} />
            <Label label="Your ID" value={user?.clerkUserId} />
            <Label
              label="Created on"
              value={
                user?.createdAt
                  ? format(user.createdAt, "dd MMMM yyyy ',' p")
                  : ''
              }
            />
          </div>
        </div>

        <D.DrawerFooter>
          <Button
            className="mt-2 w-full"
            variant="outline"
            type="button"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <>
              Logout
              {isLoading ? (
                <Loader2 className="ml-4 size-5 animate-spin" />
              ) : (
                <LogOut className="ml-4 size-4" />
              )}
            </>
          </Button>
        </D.DrawerFooter>
      </D.DrawerContent>
    </D.Drawer>
  )
}

export function Label({ label, value }: { label: string; value?: string }) {
  return value ? (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground 2xl:text-sm">
        {label}
      </span>
      <span className="text-sm 2xl:text-base">{value}</span>
    </div>
  ) : null
}
