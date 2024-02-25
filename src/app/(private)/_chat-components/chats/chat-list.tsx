'use client'

import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/redux'
import { loadChats } from '@/redux/slices/chat-slice'

import { ChatCard } from './chat-card'

export function ChatList() {
  const { chats, isLoadingChats } = useAppSelector((state) => state.chat)
  const currentUserId = useAppSelector((state) => state.user.currentUserId)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (currentUserId) {
      dispatch(loadChats({ userId: currentUserId }))
    }
  }, [currentUserId, dispatch])

  return (
    <div
      className={twMerge(
        'mt-8 h-[calc(100%_-_6.8rem)] divide-y divide-zinc-200/70 pr-6 dark:divide-zinc-900',
        'dark:scrollbar-thumb-zinc-700 scrollbar-thin dark:scrollbar-track-zinc-800 overflow-y-auto',
      )}
    >
      {isLoadingChats &&
        Array.from({ length: 5 }).map((_, i) => (
          <div className="flex items-center gap-5 p-4" key={i}>
            <Skeleton className="size-[50px] rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="ml-auto h-4 w-[70px]" />
          </div>
        ))}

      {!isLoadingChats &&
        chats.map((chat) => <ChatCard key={chat._id} chat={chat} />)}
    </div>
  )
}
