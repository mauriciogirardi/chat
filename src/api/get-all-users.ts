'use server'

import { api } from '@/data/api'
import { UserType } from '@/interfaces/user'

type Response = {
  users: UserType[]
}

export async function getAllUsers() {
  try {
    const { users } = await api<Response>('/users')

    return users
  } catch (error) {
    console.error(error)
  }
}
