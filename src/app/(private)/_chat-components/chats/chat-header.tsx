'use client'

import Link from 'next/link'
import { ChangeEvent, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { useAppDispatch } from '@/redux'
import { setSearchFilter } from '@/redux/slices/search-slice'

import { NewChatModal } from './new-chat-modal'

export function ChatHeader() {
  const [search, setSearch] = useState('')
  const dispatch = useAppDispatch()
  const debouncedSearch = useDebounce(search)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setSearch(value)
  }

  useEffect(() => {
    dispatch(setSearchFilter(debouncedSearch))
  }, [debouncedSearch, dispatch])

  return (
    <div className="flex flex-col gap-6 pr-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-muted-foreground">My Chats</h2>
        <div className="flex items-center gap-2">
          <NewChatModal />
          <Button variant="outline" size="sm" asChild>
            <Link href="/groups/create-group">New Group</Link>
          </Button>
        </div>
      </div>
      <Input
        placeholder="Search chat..."
        type="text"
        onChange={handleChange}
        value={search}
      />
    </div>
  )
}
