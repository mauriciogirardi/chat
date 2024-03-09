'use client'

import { useState } from 'react'
import { Control, Controller } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { UserType } from '@/interfaces/user'
import { useAppSelector } from '@/redux'

import { FormData } from './schema-form'

type SelectedListProps = {
  users?: UserType[]
  hasError?: boolean
  selectedCount?: number
  initialCount?: number
  control: Control<FormData>
}

export function CheckboxesUsersList({
  users,
  hasError,
  initialCount,
  control,
}: SelectedListProps) {
  const [selectedCount, setSelectedCount] = useState(initialCount || 0)
  const currentUserId = useAppSelector((state) => state.user.currentUserId)

  return (
    <div>
      {hasError ? (
        <p className="text-sm text-red-400">
          You have to select at least one user.
        </p>
      ) : (
        <p className="text-sm font-medium text-muted-foreground">
          Selected users {selectedCount}
        </p>
      )}

      <div
        dir="rtl"
        className={twMerge(
          'mt-4 h-[calc(100vh_-_16.1rem)] w-full md:w-[350px] lg:w-[400px] ',
          'overflow-y-auto scrollbar-thin dark:scrollbar-track-zinc-800 dark:scrollbar-thumb-zinc-700',
        )}
      >
        {users?.map((user) => {
          if (user._id === currentUserId) return null

          return (
            <div
              className="mt-6 flex items-center space-x-3 pl-3"
              key={user._id}
              dir="ltr"
            >
              <Controller
                name={'users'}
                control={control}
                render={({ field }) => {
                  const isChecked = field.value
                    ? field.value.includes(user._id)
                    : false

                  const handleCheckboxChange = (isChecked: boolean) => {
                    const updatedUsers = isChecked
                      ? [...(field.value ?? []), user._id]
                      : (field.value ?? []).filter(
                          (value) => value !== user._id,
                        )
                    setSelectedCount(updatedUsers.length)
                    field.onChange(updatedUsers)
                  }

                  return (
                    <Checkbox
                      id={user._id}
                      checked={isChecked}
                      onCheckedChange={handleCheckboxChange}
                    />
                  )
                }}
              />
              <label
                htmlFor={user._id}
                className="flex items-center gap-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Avatar>
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {user.name}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}
