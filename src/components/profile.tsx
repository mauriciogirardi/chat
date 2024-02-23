'use client'

import { Settings } from 'lucide-react'

import { useAppSelector } from '@/redux'

import { ProfileInfo } from './profile-info'
import { Avatar, AvatarImage } from './ui/avatar'
import { Skeleton } from './ui/skeleton'

function SkeletonProfile() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  )
}

export function Profile() {
  const { currentUserData, isLoading } = useAppSelector((state) => state.user)

  return (
    <div className="flex items-center gap-4">
      {isLoading ? (
        <SkeletonProfile />
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium md:text-base">
            {currentUserData?.username}
          </p>
          <ProfileInfo>
            <div className="group relative bg-transparent">
              <Avatar role="button" aria-label="Open profile">
                <AvatarImage src={currentUserData?.profilePicture} />
              </Avatar>
              <Settings className="absolute -bottom-1 -right-1 h-4 w-4 text-zinc-800 group-hover:opacity-80 dark:text-zinc-100" />
            </div>
          </ProfileInfo>
        </div>
      )}
    </div>
  )
}
