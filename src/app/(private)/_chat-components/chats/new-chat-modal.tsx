'use client'

import { Check, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

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
import { socket } from '@/config/socket-config'
import { useDebounce } from '@/hooks/useDebounce'
import { UserType } from '@/interfaces/user'
import { useAppDispatch, useAppSelector } from '@/redux'
import { setChats } from '@/redux/slices/chat-slice'
import { CreateNewChat } from '@/server-actions/chats'
import { GetAllUsers } from '@/server-actions/users'

export function NewChatModal() {
  const currentUserId = useAppSelector((state) => state.user.currentUserId)
  const { chats } = useAppSelector((state) => state.chat)
  const dispatch = useAppDispatch()

  const [users, setUsers] = useState<UserType[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingNewUser, setIsLoadingNewUser] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const getUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const response = await GetAllUsers()
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

      const newChats = await CreateNewChat({
        users: [userId, currentUserId],
        createdBy: currentUserId,
        isGroupChat: false,
      })

      const payloadSocket = {
        chats: newChats,
        userId,
        type: 'chat',
      }

      socket.emit('add-user-chat', payloadSocket)

      const name = newChats[0].users.find((user) => user._id === userId)?.name

      dispatch(setChats(newChats))
      toast.success(`${name} has been successfully added to you chat!`)
    } catch {
      toast.error('Error adding user to new chat, try again!')
    } finally {
      setIsLoadingNewUser(false)
      setSelectedUserId('')
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  const filterUser = debouncedSearch
    ? users.filter((user) =>
        user.name
          .toLocaleLowerCase()
          .includes(debouncedSearch.toLocaleLowerCase()),
      )
    : users

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
          <Input
            placeholder="Search by name"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div
            className={twMerge('mt-6 h-72', 'overflow-y-auto scrollbar-thin')}
          >
            {isLoadingUsers ? (
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
                {filterUser.map((user) => {
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
                        filterUser.length >= 5 && 'pr-4',
                      )}
                    >
                      <Avatar className="size-12">
                        <AvatarImage src={user.profilePicture} />
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

                {filterUser.length <= 0 && (
                  <div className="flex h-52 items-center justify-center">
                    <span className="text-muted-foreground">
                      User not found!
                    </span>
                  </div>
                )}

                {users.length <= 0 && (
                  <div className="flex h-52 items-center justify-center">
                    <span className="w-48 text-center text-muted-foreground">
                      There are no users registered in the chat yet!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
