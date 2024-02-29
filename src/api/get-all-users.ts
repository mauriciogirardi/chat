import { toast } from 'sonner'

import { GetAllUsers } from '@/server-actions/users'

export async function getAllUsers() {
  try {
    const users = await GetAllUsers()
    return users
  } catch (error) {
    toast.error('Fail loading users!')
  }
}
