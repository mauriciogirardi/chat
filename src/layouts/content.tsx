'use cliente'

import { Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'

import { Logo } from '@/components/logo'
import { useAppSelector } from '@/redux'

export function Content({ children }: { children: ReactNode }) {
  const { currentUserData } = useAppSelector((state) => state.user)
  const pathname = usePathname()
  const isPublicRoute =
    pathname.includes('sign-in') || pathname.includes('sign-up')

  if (isPublicRoute) return children

  if (!currentUserData) {
    return (
      <div className="flex h-[calc(100vh_-_5rem)] w-full flex-col items-center justify-center gap-5">
        <Loader2 className="size-10 animate-spin text-muted-foreground" />
        <Logo />
      </div>
    )
  }

  return <div>{children}</div>
}
