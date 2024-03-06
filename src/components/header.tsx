'use client'

import { useEffect } from 'react'

import { socket } from '@/config/socket-config'
import { useAppDispatch, useAppSelector } from '@/redux'
import { loadCurrentUser, setOnlineUsers } from '@/redux/slices/user-slice'

import { Logo } from './logo'
import { Profile } from './profile'
import { ToggleTheme } from './toggle-theme'

export function Header() {
  const currentUserId = useAppSelector((state) => state.user.currentUserId)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadCurrentUser())
  }, [dispatch])

  useEffect(() => {
    if (currentUserId) {
      socket.emit('join', currentUserId)
      socket.on('online-users-updated', (onlineUsers: string[]) => {
        dispatch(setOnlineUsers(onlineUsers))
      })
    }
  }, [currentUserId, dispatch])

  return (
    <div className="border border-b-zinc-200 bg-primary-foreground dark:border-b-zinc-700">
      <header className="container flex items-center justify-between py-4">
        <div>
          <Logo />
        </div>
        {currentUserId && (
          <div className="flex items-center gap-4">
            <Profile />
            <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
            <ToggleTheme />
          </div>
        )}
      </header>
    </div>
  )
}
