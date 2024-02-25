'use client'

import { useEffect } from 'react'

import { useAppDispatch } from '@/redux'
import { loadCurrentUser } from '@/redux/slices/user-slice'

import { Logo } from './logo'
import { Profile } from './profile'
import { ToggleTheme } from './toggle-theme'

export function Header() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadCurrentUser())
  }, [dispatch])

  return (
    <div className="border border-b-zinc-200 bg-primary-foreground dark:border-b-zinc-700">
      <header className="container flex items-center justify-between py-4">
        <div>
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <Profile />
          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
          <ToggleTheme />
        </div>
      </header>
    </div>
  )
}
