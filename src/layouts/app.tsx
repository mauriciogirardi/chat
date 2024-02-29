import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { Header } from '@/components/header'

type LayoutAppProps = {
  children: ReactNode
  className?: string
}

export function LayoutApp({ children, className }: LayoutAppProps) {
  return (
    <>
      <Header />
      <div className={twMerge('container', className)}>{children}</div>
    </>
  )
}
