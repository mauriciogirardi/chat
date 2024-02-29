import { Loader2 } from 'lucide-react'

import { Logo } from '@/components/logo'

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Logo />
        <Loader2 className="size-10 animate-spin text-muted-foreground" />
      </div>
    </div>
  )
}
