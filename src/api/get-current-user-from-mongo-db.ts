'use server'

import { currentUser, redirectToSignIn } from '@clerk/nextjs'

import { api } from '@/data/api'
import { UserType } from '@/interfaces/user'

type Response = {
  user: UserType
}

export async function getCurrentUserFromMongoDB() {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      redirectToSignIn()
      throw new Error('Not have clerk user!')
    }

    const { id, firstName, lastName, emailAddresses, username, imageUrl } =
      clerkUser

    const data = {
      clerkUserId: id,
      name: firstName + ' ' + lastName,
      username,
      email: emailAddresses[0]?.emailAddress || '',
      profilePicture: imageUrl || '',
    }

    const { user } = await api<Response>('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return user
  } catch (error) {
    console.error(error)
  }
}
