import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { getAllUsers } from '@/api/get-all-users'
import { LayoutApp } from '@/layouts/app'

import { FormGroup } from '../_group-components/form-group'

export default async function CreateGroup() {
  const users = await getAllUsers()

  return (
    <LayoutApp className="py-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:pb-4">
        <h1 className="text-2xl font-bold text-muted-foreground">
          Create Group Chat
        </h1>

        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-semibold text-muted-foreground hover:text-muted-foreground/80 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <ChevronLeft className="size-5 text-muted-foreground group-hover:text-muted-foreground/80" />
          Back to chats
        </Link>
      </div>

      <div className="mt-6">
        <FormGroup users={users} />
      </div>
    </LayoutApp>
  )
}
