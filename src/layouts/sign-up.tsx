'use client'

import { SignUp as SignUpClerk } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export function SignUp() {
  const { theme } = useTheme()

  return (
    <SignUpClerk
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
      }}
    />
  )
}
