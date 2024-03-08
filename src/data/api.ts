import { env } from '@/env'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const baseUrl = env.NEXT_PUBLIC_BACKEND_URL
    const url = new URL(path, baseUrl)

    return fetch(url, init).then((response) => {
      if (!response.ok) throw new Error('Network response was not ok')

      return response.json() as Promise<T>
    })
  } catch (error) {
    throw error
  }
}
