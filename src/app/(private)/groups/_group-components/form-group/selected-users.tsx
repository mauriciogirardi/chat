'use client'

import { X } from 'lucide-react'
import { useCallback } from 'react'
import { Control } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import * as D from '@/components/ui/drawer'
import { UserType } from '@/interfaces/user'

import { CheckboxesUsersList } from './checkboxes-users-list'
import { FormData } from './schema-form'

type SelectedUsersProps = {
  users?: UserType[]
  hasError?: boolean
  initialCount?: number
  control: Control<FormData>
  isDisabled?: boolean
}

export function SelectedUsers({
  users,
  hasError,
  initialCount,
  control,
  isDisabled = false,
}: SelectedUsersProps) {
  const checkboxesUsers = useCallback(() => {
    return (
      <CheckboxesUsersList
        control={control}
        users={users}
        hasError={hasError}
        initialCount={initialCount}
      />
    )
  }, [control, hasError, initialCount, users])

  return (
    <>
      <div className="hidden md:block">{checkboxesUsers()}</div>

      <div className="flex justify-end md:hidden">
        <D.Drawer direction="left">
          <D.DrawerTrigger asChild>
            <Button
              variant={hasError ? 'destructive' : 'secondary'}
              type="button"
              size="xs"
              disabled={isDisabled}
            >
              {hasError
                ? 'You have to select at least one user.'
                : `Choose users`}
            </Button>
          </D.DrawerTrigger>

          <D.DrawerContent className="h-screen w-4/5 border pl-6 dark:border-r-zinc-800">
            <D.DrawerHeader className="mt-8">
              <D.DrawerClose className="absolute right-5 top-5 cursor-pointer text-muted-foreground outline-none hover:text-muted-foreground/80 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-violet-500">
                <X />
              </D.DrawerClose>
            </D.DrawerHeader>

            {checkboxesUsers()}
          </D.DrawerContent>
        </D.Drawer>
      </div>
    </>
  )
}
