'use client'

import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

import { env } from '@/env'

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: 'chat-6f56e.appspot.com',
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
export const firebaseApp = initializeApp(firebaseConfig)
export const storageUpload = getStorage(firebaseApp)
