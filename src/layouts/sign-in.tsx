'use client'

import { SignIn as SignInClerk } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'

export function SignIn() {
  const { theme } = useTheme()

  return (
    <SignInClerk
      afterSignInUrl="/"
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
      }}
    />
  )
}
