'use client'

import { Check, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

import { getAllUsers } from '@/api/get-all-users'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { UserType } from '@/interfaces/user'
import { useAppSelector } from '@/redux'
import { loadChats } from '@/redux/slices/chat-slice'
import { CreateNewChat } from '@/server-actions/chats'

export function NewChatModal() {
  const currentUserId = useAppSelector((state) => state.user.currentUserId)
  const { chats, isLoadingChats } = useAppSelector((state) => state.chat)
  const dispatch = useDispatch()

  const [users, setUsers] = useState<UserType[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingNewUser, setIsLoadingNewUser] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')

  const getUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const response = (await getAllUsers()) || []
      setUsers(response)
    } catch (error) {
      toast.error('Fail loading users!')
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const handleAddToChat = async (userId: string) => {
    try {
      if (!currentUserId) return null
      setIsLoadingNewUser(true)
      setSelectedUserId(userId)

      await CreateNewChat({
        users: [userId, currentUserId],
        createdBy: currentUserId,
        isGroupChat: false,
      })

      toast.success('Chat created successfully!')
    } catch {
      toast.error('Error adding user to new chat, try again!')
    } finally {
      setIsLoadingNewUser(false)
      setSelectedUserId('')
    }
  }

  useEffect(() => {
    if (currentUserId && selectedUserId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      dispatch(loadChats({ userId: currentUserId }))
    }
  }, [currentUserId, dispatch, selectedUserId])

  useEffect(() => {
    getUsers()
  }, [])

  const isLoadingList = isLoadingChats || isLoadingUsers

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl text-muted-foreground">
            Create New Chat
          </DialogTitle>
        </DialogHeader>

        <div className="mt-5">
          <Input placeholder="Search userId or username or email" type="text" />

          <div
            className={twMerge('mt-6 h-72', 'overflow-y-auto scrollbar-thin')}
          >
            {isLoadingList ? (
              <div className="divide-y">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div className="flex items-center py-4" key={i}>
                    <Skeleton className="size-12 rounded-full" />
                    <Skeleton className="ml-2 h-4 w-1/2 pr-5" />
                    <Skeleton className="ml-auto h-7 w-28" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {users.map((user) => {
                  const chatAlreadyCreated = chats.find((chat) =>
                    chat.users.find((chatUser) => chatUser._id === user._id),
                  )

                  if (user._id === currentUserId || chatAlreadyCreated)
                    return null

                  return (
                    <div
                      key={user._id}
                      className={twMerge(
                        'flex items-center py-4',
                        users.length >= 5 && 'pr-4',
                      )}
                    >
                      <Avatar className="size-12">
                        <AvatarImage src={''} />
                        <AvatarFallback className="text-sm">
                          {user.username.toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="ml-2 pr-5 text-sm">
                        {user.name ? user.name : user.username}
                      </span>
                      <Button
                        size="xs"
                        variant="outline"
                        type="button"
                        className="ml-auto"
                        disabled={isLoadingNewUser}
                        onClick={() => handleAddToChat(user._id)}
                      >
                        {user._id === selectedUserId && isLoadingNewUser ? (
                          <Loader2 className="mr-1 size-4 animate-spin" />
                        ) : (
                          <Check className="mr-1 size-4" />
                        )}
                        Add to chats
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
