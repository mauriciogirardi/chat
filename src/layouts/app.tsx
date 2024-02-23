import { ReactNode } from 'react'

import { Header } from '@/components/header'

type LayoutAppProps = {
  children: ReactNode
}

export function LayoutApp({ children }: LayoutAppProps) {
  return (
    <>
      <Header />
      <div className="container">{children}</div>
    </>
  )
}
