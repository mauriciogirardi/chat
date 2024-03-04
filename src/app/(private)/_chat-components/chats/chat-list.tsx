'use client'

import { useEffect } from 'react'
import { twMerge } from 'tailwind-merge'

import { Skeleton } from '@/components/ui/skeleton'
import { socket } from '@/config/socket-config'
import { filterChatByUserName } from '@/helpers/filter-chat-by-user-name'
import { MessageType } from '@/interfaces/message'
import { store, useAppDispatch, useAppSelector } from '@/redux'
import { loadChats, setChats } from '@/redux/slices/chat-slice'

import { ChatCard } from './chat-card'

type ChatListProps = {
  onOpenChats?: (open: boolean) => void
}

export function ChatList({ onOpenChats }: ChatListProps) {
  const dispatch = useAppDispatch()
  const { currentUserData } = useAppSelector((state) => state.user)
  const { chats, selectedChat, isLoadingChats } = useAppSelector(
    (state) => state.chat,
  )
  const search = useAppSelector((state) => state.searchFilter.search)

  useEffect(() => {
    if (currentUserData) dispatch(loadChats({ userId: currentUserData._id }))
  }, [currentUserData, dispatch])

  useEffect(() => {
    socket.on('new-message-received', (newMessage: MessageType) => {
      const { chats } = store.getState().chat
      let prevChats = [...chats]

      const indexOfChatToUpdate = prevChats.findIndex(
        (chat) => chat._id === newMessage.chat._id,
      )

      if (indexOfChatToUpdate === -1) return

      const chatToUpdate = prevChats[indexOfChatToUpdate]

      if (
        chatToUpdate?.lastMessage?.socketMessageId ===
        newMessage?.socketMessageId
      )
        return

      const chatToUpdateCopy = { ...chatToUpdate }
      chatToUpdateCopy.lastMessage = newMessage
      chatToUpdateCopy.updatedAt = newMessage.createdAt
      chatToUpdateCopy.unreadCounts = { ...chatToUpdate.unreadCounts }

      if (
        currentUserData &&
        newMessage.sender._id !== currentUserData?._id &&
        selectedChat?._id !== newMessage.chat._id
      ) {
        chatToUpdateCopy.unreadCounts[currentUserData._id] =
          (chatToUpdateCopy.unreadCounts[currentUserData._id] || 0) + 1
      }

      prevChats[indexOfChatToUpdate] = chatToUpdateCopy

      // push the updated chat to the top
      prevChats = [
        prevChats[indexOfChatToUpdate],
        ...prevChats.filter((chat) => chat._id !== newMessage.chat._id),
      ]
      dispatch(setChats(prevChats))
    })
  }, [selectedChat, dispatch, currentUserData])

  const filterChats = filterChatByUserName(chats, search)

  return (
    <div
      className={twMerge(
        'mt-8 h-[calc(100%_-_6.8rem)] divide-y divide-zinc-200/70 pr-6 dark:divide-zinc-900',
        'overflow-y-auto scrollbar-thin',
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

      {!isLoadingChats && (
        <>
          {filterChats && filterChats?.length > 0
            ? filterChats?.map((chat) => (
                <ChatCard
                  key={chat._id}
                  chat={chat}
                  onOpenChats={onOpenChats}
                />
              ))
            : chats?.map((chat) => (
                <ChatCard
                  key={chat._id}
                  chat={chat}
                  onOpenChats={onOpenChats}
                />
              ))}
        </>
      )}
    </div>
  )
}
