'use server'

import { api } from '@/data/api'
import { UserType } from '@/interfaces/user'

type Response = {
  user: UserType
}

type UploadUserProfileProps = {
  userId: string
  profilePicture: string
}

export async function uploadUserProfile({
  profilePicture,
  userId,
}: UploadUserProfileProps) {
  try {
    const { user } = await api<Response>(`/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profilePicture }),
    })

    return user
  } catch (error) {
    console.error(error)
  }
}
