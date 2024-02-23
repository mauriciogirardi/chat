'use client'

import { ReactNode } from 'react'
import { Toaster } from 'sonner'

import { ReduxProvider } from './redux-provider'
import { ThemeProvider } from './theme-provider'

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ReduxProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        storageKey="theme-chat"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster richColors />
      </ThemeProvider>
    </ReduxProvider>
  )
}
