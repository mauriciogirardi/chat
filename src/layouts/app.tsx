'use client'

import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

import { Header } from '@/components/header'

import { Content } from './content'

type LayoutAppProps = {
  children: ReactNode
  className?: string
}

export function LayoutApp({ children, className }: LayoutAppProps) {
  return (
    <>
      <Header />
      <Content>
        <div className={twMerge('container', className)}>{children}</div>
      </Content>
    </>
  )
}
